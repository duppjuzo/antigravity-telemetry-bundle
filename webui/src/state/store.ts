import {
  MonetThemeEngine,
  type AppliedPaletteInfo,
  type HostThemePayload,
  type MonetSpecVersion,
  type MonetVariantId,
  type ThemeMode,
} from '../theme/monet-engine';
import { createDefaultSeedProvider } from '../theme/seed-provider';
import {
  DEFAULT_USER_SETTINGS,
  type GlobalRange,
  type GlobalTrendsCardMode,
  type HomeCardId,
  type HomeScope,
  type HourlyEntry,
  type HudStatus,
  type ModelScope,
  type PageId,
  type StatsResponse,
  type UserSettings,
} from '../types/telemetry';

const STORAGE_KEY = 'ag_telemetry_ui_v2';
const POLL_INTERVAL_MS = 3000;

const VALID_PAGES = new Set<PageId>([
  'home',
  'context',
  'steps',
  'models',
  'global',
  'sessions',
  'settings',
]);

const VALID_HOME_CARDS = new Set<HomeCardId>([
  'default',
  'context',
  'step',
  'models',
  'global-trends',
  'extra-stats',
  'tools',
]);

const VALID_GLOBAL_TRENDS_MODES: GlobalTrendsCardMode[] = [
  'today',
  'month',
  'data',
];

const VALID_HOME_SCOPES = new Set<HomeScope>([
  'latest_step',
  'session',
  'global',
]);

type ApiFetchFn = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;

const apiFetch: ApiFetchFn = (window as any).sidecar?.fetch
  ? (window as any).sidecar.fetch.bind((window as any).sidecar)
  : fetch.bind(window);

function resolveHostConvoId(): string {
  const sidecarId = (window as any).sidecar?.conversationId;
  if (typeof sidecarId === 'string' && sidecarId.trim()) {
    return sidecarId.trim();
  }
  const params = new URLSearchParams(window.location.search);
  return (params.get('conversationId') || '').trim();
}

function loadPersistedSettings(): UserSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_USER_SETTINGS, homeCards: [...DEFAULT_USER_SETTINGS.homeCards] };
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    const homeCards = Array.isArray(parsed.homeCards)
      ? parsed.homeCards.filter((id): id is HomeCardId =>
          VALID_HOME_CARDS.has(id as HomeCardId)
        )
      : [...DEFAULT_USER_SETTINGS.homeCards];

    return {
      themeMode:
        parsed.themeMode === 'light' ||
        parsed.themeMode === 'dark' ||
        parsed.themeMode === 'follow-gui'
          ? parsed.themeMode
          : DEFAULT_USER_SETTINGS.themeMode,
      variant:
        typeof parsed.variant === 'string' && parsed.variant
          ? (parsed.variant as MonetVariantId)
          : DEFAULT_USER_SETTINGS.variant,
      specVersion:
        parsed.specVersion === '2021' || parsed.specVersion === '2025'
          ? parsed.specVersion
          : DEFAULT_USER_SETTINGS.specVersion,
      homeScope: VALID_HOME_SCOPES.has(parsed.homeScope as HomeScope)
        ? (parsed.homeScope as HomeScope)
        : DEFAULT_USER_SETTINGS.homeScope,
      sessionMode: parsed.sessionMode === 'pinned' ? 'pinned' : 'auto',
      pinnedConvoId:
        typeof parsed.pinnedConvoId === 'string' && parsed.pinnedConvoId
          ? parsed.pinnedConvoId
          : null,
      liveEnabled:
        typeof parsed.liveEnabled === 'boolean'
          ? parsed.liveEnabled
          : DEFAULT_USER_SETTINGS.liveEnabled,
      globalTrendsCardMode: VALID_GLOBAL_TRENDS_MODES.includes(
        parsed.globalTrendsCardMode as GlobalTrendsCardMode
      )
        ? (parsed.globalTrendsCardMode as GlobalTrendsCardMode)
        : DEFAULT_USER_SETTINGS.globalTrendsCardMode,
      homeCards: homeCards.length > 0 ? homeCards : ['default'],
    };
  } catch {
    return {
      ...DEFAULT_USER_SETTINGS,
      homeCards: [...DEFAULT_USER_SETTINGS.homeCards],
    };
  }
}

export class TelemetryStore extends EventTarget {
  settings: UserSettings;
  activePage: PageId = 'home';
  drawerOpen = false;
  globalRange: GlobalRange = 'all';
  modelScope: ModelScope = 'session';
  stepsDesc = true;
  editMode = false;

  data: StatsResponse | null = null;
  todayHourly: HourlyEntry[] = [];
  isFetching = false;
  lastError: string | null = null;
  appliedPalette: AppliedPaletteInfo | null = null;
  hudStatus: HudStatus | null = null;
  hudBusy = false;
  hudError: string | null = null;
  readonly hostConvoId: string;
  readonly themeEngine: MonetThemeEngine;

  private pollTimer: number | null = null;
  private started = false;
  private lastHostThemeSig = '';
  private lastHudThemeSig = '';
  private readonly onVisibilityChange = (): void => {
    if (!document.hidden && this.settings.liveEnabled) {
      void this.refresh(false);
    }
  };

  constructor() {
    super();
    this.settings = loadPersistedSettings();
    this.hostConvoId = resolveHostConvoId();
    this.themeEngine = new MonetThemeEngine(
      createDefaultSeedProvider(),
      document.documentElement
    );
    this.syncTheme();
  }

  subscribe(fn: () => void): () => void {
    const handler = () => fn();
    this.addEventListener('change', handler);
    return () => this.removeEventListener('change', handler);
  }

  private emitChange(): void {
    this.dispatchEvent(new CustomEvent('change'));
  }

  private saveSettings(): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore storage quota or private-mode errors
    }
  }

  private syncTheme(hostTheme?: HostThemePayload | null): void {
    if (hostTheme !== undefined) {
      const sig = JSON.stringify(hostTheme ?? null);
      if (sig !== this.lastHostThemeSig) {
        this.lastHostThemeSig = sig;
        this.themeEngine.setHostTheme(hostTheme ?? null);
      }
    }
    this.appliedPalette = this.themeEngine.setConfig({
      themeMode: this.settings.themeMode,
      variant: this.settings.variant,
      specVersion: this.settings.specVersion,
    });
    if (this.started) {
      void this.syncHudTheme();
    }
  }

  start(): void {
    if (this.started) return;
    this.started = true;
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.pollTimer = window.setInterval(() => {
      if (this.settings.liveEnabled && !document.hidden) {
        void this.refresh(false);
        if (this.activePage === 'settings') {
          void this.refreshHudStatus();
        }
      }
    }, POLL_INTERVAL_MS);
    void this.refresh(false);
    void this.refreshHudStatus();
    void this.syncHudTheme(true);
  }

  destroy(): void {
    if (!this.started) return;
    this.started = false;
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    if (this.pollTimer !== null) {
      window.clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.themeEngine.destroy();
  }

  async refresh(force = false): Promise<void> {
    if (this.isFetching && !force) return;
    this.isFetching = true;
    this.emitChange();

    try {
      const convoParam =
        this.settings.sessionMode === 'pinned' && this.settings.pinnedConvoId
          ? this.settings.pinnedConvoId
          : 'auto';

      const mainUrl = `./api/stats?range=${encodeURIComponent(
        this.globalRange
      )}&convo_id=${encodeURIComponent(convoParam)}&force=${force ? 1 : 0}`;

      const needTodayHourlyFetch =
        this.globalRange !== 'today' &&
        (this.activePage === 'home' || this.todayHourly.length === 0) &&
        this.settings.homeCards.includes('global-trends') &&
        this.settings.globalTrendsCardMode === 'today';

      const [mainRes, todayRes] = await Promise.all([
        apiFetch(mainUrl, { cache: 'no-store' }),
        needTodayHourlyFetch
          ? apiFetch('./api/stats?range=today&convo_id=auto&force=0', {
              cache: 'no-store',
            }).catch(() => null)
          : Promise.resolve(null),
      ]);

      if (!mainRes.ok) {
        throw new Error(`HTTP ${mainRes.status}`);
      }

      const payload = (await mainRes.json()) as StatsResponse;
      this.data = payload;
      this.lastError = null;

      if (this.globalRange === 'today') {
        this.todayHourly = payload.hourly || [];
      } else if (todayRes && todayRes.ok) {
        const todayPayload = (await todayRes.json()) as StatsResponse;
        this.todayHourly = todayPayload.hourly || [];
      }

      if (payload.host_theme) {
        this.syncTheme(payload.host_theme);
      }
    } catch (err) {
      this.lastError = err instanceof Error ? err.message : String(err);
    } finally {
      this.isFetching = false;
      this.emitChange();
    }
  }

  navigate(page: PageId): void {
    if (!VALID_PAGES.has(page)) return;
    this.activePage = page;
    this.drawerOpen = false;
    this.emitChange();
    if (page === 'settings') {
      void this.refreshHudStatus();
    }
    if (
      page === 'home' &&
      this.globalRange !== 'today' &&
      this.settings.homeCards.includes('global-trends') &&
      this.settings.globalTrendsCardMode === 'today' &&
      this.todayHourly.length === 0
    ) {
      void this.refresh(false);
    }
  }

  async syncHudTheme(force = false): Promise<void> {
    try {
      const payload = this.themeEngine.exportHudThemePayload();
      const sig = JSON.stringify(payload);
      if (!force && sig === this.lastHudThemeSig) {
        return;
      }
      this.lastHudThemeSig = sig;
      await apiFetch('./api/hud/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: sig,
      });
    } catch {
      // Ignore HUD theme sync errors if server doesn't support it
    }
  }

  async refreshHudStatus(): Promise<void> {
    try {
      const res = await apiFetch('./api/hud/status', { cache: 'no-store' });
      if (!res.ok) return;
      const status = (await res.json()) as HudStatus;
      this.hudStatus = status;
      this.emitChange();
    } catch {
      // Ignore transient polling errors
    }
  }

  async setHudEnabled(enabled: boolean): Promise<void> {
    if (this.hudBusy) return;
    this.hudBusy = true;
    this.hudError = null;
    this.emitChange();
    try {
      const res = await apiFetch('./api/hud/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      const payload = (await res.json()) as HudStatus;
      this.hudStatus = payload;
      if (!res.ok) {
        this.hudError = payload.error || `HTTP ${res.status}`;
      } else if (enabled && payload.running) {
        void this.syncHudTheme(true);
      }
    } catch (err) {
      this.hudError = err instanceof Error ? err.message : String(err);
    } finally {
      this.hudBusy = false;
      this.emitChange();
    }
  }

  async setHudAlwaysOnTop(alwaysOnTop: boolean): Promise<void> {
    if (this.hudBusy) return;
    this.hudBusy = true;
    this.hudError = null;
    this.emitChange();
    try {
      const res = await apiFetch('./api/hud/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ always_on_top: alwaysOnTop }),
      });
      const payload = (await res.json()) as HudStatus;
      this.hudStatus = payload;
      if (!res.ok) {
        this.hudError = payload.error || `HTTP ${res.status}`;
      }
    } catch (err) {
      this.hudError = err instanceof Error ? err.message : String(err);
    } finally {
      this.hudBusy = false;
      this.emitChange();
    }
  }

  async resetHudPosition(): Promise<void> {
    if (this.hudBusy) return;
    this.hudBusy = true;
    this.hudError = null;
    this.emitChange();
    try {
      const res = await apiFetch('./api/hud/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_position: true }),
      });
      const payload = (await res.json()) as HudStatus;
      this.hudStatus = payload;
      if (!res.ok) {
        this.hudError = payload.error || `HTTP ${res.status}`;
      }
    } catch (err) {
      this.hudError = err instanceof Error ? err.message : String(err);
    } finally {
      this.hudBusy = false;
      this.emitChange();
    }
  }

  setDrawerOpen(open: boolean): void {
    if (this.drawerOpen === open) return;
    this.drawerOpen = open;
    this.emitChange();
  }

  toggleLive(): void {
    this.settings = {
      ...this.settings,
      liveEnabled: !this.settings.liveEnabled,
    };
    this.saveSettings();
    this.emitChange();
    if (this.settings.liveEnabled) {
      void this.refresh(false);
    }
  }

  setGlobalRange(range: GlobalRange): void {
    if (this.globalRange === range) return;
    this.globalRange = range;
    this.emitChange();
    void this.refresh(false);
  }

  setModelScope(scope: ModelScope): void {
    if (this.modelScope === scope) return;
    this.modelScope = scope;
    this.emitChange();
  }

  toggleStepsOrder(): void {
    this.stepsDesc = !this.stepsDesc;
    this.emitChange();
  }

  setEditMode(enabled: boolean): void {
    if (this.editMode === enabled) return;
    this.editMode = enabled;
    this.emitChange();
  }

  setHomeScope(scope: HomeScope): void {
    if (!VALID_HOME_SCOPES.has(scope) || this.settings.homeScope === scope) {
      return;
    }
    this.settings = { ...this.settings, homeScope: scope };
    this.saveSettings();
    this.emitChange();
  }

  setThemeConfig(partial: {
    themeMode?: ThemeMode;
    variant?: MonetVariantId;
    specVersion?: MonetSpecVersion;
  }): void {
    this.settings = {
      ...this.settings,
      ...(partial.themeMode !== undefined ? { themeMode: partial.themeMode } : {}),
      ...(partial.variant !== undefined ? { variant: partial.variant } : {}),
      ...(partial.specVersion !== undefined
        ? { specVersion: partial.specVersion }
        : {}),
    };
    this.saveSettings();
    this.syncTheme();
    this.emitChange();
  }

  selectAutoSession(): void {
    this.settings = {
      ...this.settings,
      sessionMode: 'auto',
      pinnedConvoId: null,
    };
    this.saveSettings();
    this.emitChange();
    void this.refresh(false);
  }

  pinSession(convoId: string): void {
    if (!convoId) return;
    this.settings = {
      ...this.settings,
      sessionMode: 'pinned',
      pinnedConvoId: convoId,
    };
    this.saveSettings();
    this.emitChange();
    void this.refresh(false);
  }

  addCard(cardId: HomeCardId): void {
    if (!VALID_HOME_CARDS.has(cardId)) return;
    if (this.settings.homeCards.includes(cardId)) return;
    const nextCards = [...this.settings.homeCards, cardId];
    this.settings = { ...this.settings, homeCards: nextCards };
    this.saveSettings();
    this.emitChange();
    if (
      cardId === 'global-trends' &&
      this.settings.globalTrendsCardMode === 'today' &&
      this.todayHourly.length === 0
    ) {
      void this.refresh(false);
    }
  }

  removeCard(cardId: HomeCardId): void {
    const nextCards = this.settings.homeCards.filter((id) => id !== cardId);
    this.settings = { ...this.settings, homeCards: nextCards };
    this.saveSettings();
    this.emitChange();
  }

  moveCard(fromIdx: number, toIdx: number): void {
    const list = [...this.settings.homeCards];
    if (
      fromIdx < 0 ||
      fromIdx >= list.length ||
      toIdx < 0 ||
      toIdx >= list.length ||
      fromIdx === toIdx
    ) {
      return;
    }
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    this.settings = { ...this.settings, homeCards: list };
    this.saveSettings();
    this.emitChange();
  }

  reorderCards(newOrder: HomeCardId[]): void {
    const deduped: HomeCardId[] = [];
    for (const id of newOrder) {
      if (VALID_HOME_CARDS.has(id) && !deduped.includes(id)) {
        deduped.push(id);
      }
    }
    this.settings = { ...this.settings, homeCards: deduped };
    this.saveSettings();
    this.emitChange();
  }

  cycleGlobalTrendsCardMode(): void {
    const idx = VALID_GLOBAL_TRENDS_MODES.indexOf(
      this.settings.globalTrendsCardMode
    );
    const nextMode =
      VALID_GLOBAL_TRENDS_MODES[(idx + 1) % VALID_GLOBAL_TRENDS_MODES.length];
    this.settings = { ...this.settings, globalTrendsCardMode: nextMode };
    this.saveSettings();
    this.emitChange();
    if (
      nextMode === 'today' &&
      this.globalRange !== 'today' &&
      this.todayHourly.length === 0
    ) {
      void this.refresh(false);
    }
  }
}

export const telemetryStore = new TelemetryStore();
