import {
  MonetThemeEngine,
  type AppliedPaletteInfo,
  type HostThemePayload,
  type MonetSpecVersion,
  type MonetVariantId,
  type ThemeMode,
} from '../theme/monet-engine';
import {
  DEFAULT_SEED_HEX,
  DynamicSeedColorProvider,
  isValidSeedHex,
  normalizeSeedHex,
} from '../theme/seed-provider';
import { extractWallpaperSeedColors } from '../theme/wallpaper-extractor';
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
  type SeedSourceMode,
  type StatsResponse,
  type SystemThemeInfo,
  type UserSettings,
  type WallpaperMonitorInfo,
  type WallpaperMonitorMode,
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

const VALID_SEED_SOURCES = new Set<SeedSourceMode>([
  'manual',
  'system-accent',
  'wallpaper',
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
      seedSource: VALID_SEED_SOURCES.has(parsed.seedSource as SeedSourceMode)
        ? (parsed.seedSource as SeedSourceMode)
        : DEFAULT_USER_SETTINGS.seedSource,
      manualSeedHex:
        typeof parsed.manualSeedHex === 'string' &&
        isValidSeedHex(parsed.manualSeedHex)
          ? normalizeSeedHex(parsed.manualSeedHex)
          : DEFAULT_USER_SETTINGS.manualSeedHex,
      wallpaperMonitor:
        typeof parsed.wallpaperMonitor === 'string' &&
        parsed.wallpaperMonitor.trim()
          ? parsed.wallpaperMonitor.trim()
          : DEFAULT_USER_SETTINGS.wallpaperMonitor,
      wallpaperColorIndex:
        typeof parsed.wallpaperColorIndex === 'number' &&
        Number.isInteger(parsed.wallpaperColorIndex) &&
        parsed.wallpaperColorIndex >= 0 &&
        parsed.wallpaperColorIndex < 4
          ? parsed.wallpaperColorIndex
          : DEFAULT_USER_SETTINGS.wallpaperColorIndex,
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
  systemTheme: SystemThemeInfo | null = null;
  wallpaperCandidates: string[] = [];
  wallpaperBusy = false;
  resolvedWallpaperMonitorId: string | null = null;
  seedStatusMessage: string | null = null;
  seedFallbackActive = false;
  hudStatus: HudStatus | null = null;
  hudBusy = false;
  hudError: string | null = null;
  readonly hostConvoId: string;
  readonly themeEngine: MonetThemeEngine;

  private readonly seedProvider: DynamicSeedColorProvider;
  private seedUnsubscribe: (() => void) | null = null;
  private readonly wallpaperPaletteCache = new Map<string, string[]>();
  private wallpaperReqSeq = 0;
  private systemThemePollTick = 0;
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
    this.seedProvider = new DynamicSeedColorProvider(
      this.settings.manualSeedHex || DEFAULT_SEED_HEX
    );
    this.themeEngine = new MonetThemeEngine(
      this.seedProvider,
      document.documentElement
    );
    this.seedUnsubscribe = this.seedProvider.subscribe(() => {
      this.appliedPalette = this.themeEngine.getLastApplied();
      if (this.started) {
        void this.syncHudTheme();
      }
      this.emitChange();
    });
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
    const prevDark = this.appliedPalette?.isDark ?? null;
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
      if (
        prevDark !== null &&
        prevDark !== this.appliedPalette.isDark &&
        this.settings.seedSource === 'wallpaper'
      ) {
        void this.refreshSystemTheme(false);
      }
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
        if (this.settings.seedSource !== 'manual') {
          this.systemThemePollTick += 1;
          if (this.activePage === 'settings' || this.systemThemePollTick % 2 === 0) {
            void this.refreshSystemTheme(false);
          }
        }
      }
    }, POLL_INTERVAL_MS);
    void this.refresh(false);
    void this.refreshHudStatus();
    void this.refreshSystemTheme(false);
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
    this.seedUnsubscribe?.();
    this.seedUnsubscribe = null;
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
      void this.refreshSystemTheme(false);
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

  private applyResolvedSeedHex(hex: string): void {
    const normalized = isValidSeedHex(hex) ? normalizeSeedHex(hex) : DEFAULT_SEED_HEX;
    const changed = this.seedProvider.setSeedColorHex(normalized);
    if (!changed) {
      this.appliedPalette = this.themeEngine.getLastApplied();
    }
  }

  private pickTargetMonitor(
    monitors: WallpaperMonitorInfo[],
    followWindowSupported: boolean,
    activeWindowMonitorId: string | null
  ): WallpaperMonitorInfo {
    const pref = this.settings.wallpaperMonitor;
    if (pref === 'follow-window') {
      if (followWindowSupported && activeWindowMonitorId) {
        const active = monitors.find((m) => m.id === activeWindowMonitorId);
        if (active) return active;
      }
      return monitors.find((m) => m.is_primary) ?? monitors[0];
    }
    if (pref === 'primary') {
      return monitors.find((m) => m.is_primary) ?? monitors[0];
    }
    return (
      monitors.find((m) => m.id === pref) ??
      monitors.find((m) => m.is_primary) ??
      monitors[0]
    );
  }

  async refreshSystemTheme(force = false): Promise<void> {
    try {
      const isDark = this.appliedPalette?.isDark ?? false;
      const url = `./api/theme/system?dark=${isDark ? 1 : 0}&force=${force ? 1 : 0}`;
      const res = await apiFetch(url, { cache: 'no-store' });
      if (!res.ok) return;
      const payload = (await res.json()) as SystemThemeInfo;
      this.systemTheme = payload;
      await this.resolveActiveSeedColor(force);
      this.emitChange();
    } catch {
      if (this.settings.seedSource !== 'manual') {
        this.seedFallbackActive = true;
        this.seedStatusMessage = '无法连接后端主题检测接口，已回退至手动种子色';
        this.applyResolvedSeedHex(this.settings.manualSeedHex);
        this.emitChange();
      }
    }
  }

  private async resolveActiveSeedColor(forceExtract = false): Promise<void> {
    const mode = this.settings.seedSource;
    if (mode === 'manual') {
      this.wallpaperReqSeq += 1;
      this.wallpaperBusy = false;
      this.wallpaperCandidates = [];
      this.resolvedWallpaperMonitorId = null;
      this.seedFallbackActive = false;
      this.seedStatusMessage = null;
      this.applyResolvedSeedHex(this.settings.manualSeedHex);
      return;
    }

    if (mode === 'system-accent') {
      this.wallpaperReqSeq += 1;
      this.wallpaperBusy = false;
      this.wallpaperCandidates = [];
      this.resolvedWallpaperMonitorId = null;
      const accent = this.systemTheme?.accent;
      if (accent?.supported && accent.hex && isValidSeedHex(accent.hex)) {
        this.seedFallbackActive = false;
        this.seedStatusMessage = `已同步 ${this.systemTheme?.desktop_env || '系统'} 主题色`;
        this.applyResolvedSeedHex(accent.hex);
      } else {
        this.seedFallbackActive = true;
        this.seedStatusMessage =
          accent?.reason || '未能读取系统主题色，已回退至手动种子色';
        this.applyResolvedSeedHex(this.settings.manualSeedHex);
      }
      return;
    }

    // mode === 'wallpaper'
    const wp = this.systemTheme?.wallpaper;
    if (!wp?.supported || !wp.monitors || wp.monitors.length === 0) {
      this.wallpaperReqSeq += 1;
      this.wallpaperBusy = false;
      this.wallpaperCandidates = [];
      this.resolvedWallpaperMonitorId = null;
      this.seedFallbackActive = true;
      this.seedStatusMessage =
        wp?.reason || '未能读取桌面壁纸，已回退至手动种子色';
      this.applyResolvedSeedHex(this.settings.manualSeedHex);
      return;
    }

    const target = this.pickTargetMonitor(
      wp.monitors,
      wp.follow_window_supported,
      wp.active_window_monitor_id
    );
    this.resolvedWallpaperMonitorId = target.id;

    if (!target.has_image && target.solid_color && isValidSeedHex(target.solid_color)) {
      this.wallpaperReqSeq += 1;
      this.wallpaperBusy = false;
      const solidHex = normalizeSeedHex(target.solid_color);
      this.wallpaperCandidates = [solidHex];
      this.seedFallbackActive = false;
      this.seedStatusMessage = `已使用纯色桌面背景（${target.label}）`;
      this.applyResolvedSeedHex(solidHex);
      return;
    }

    const cacheKey = `${target.id}|${target.signature}|${JSON.stringify(target.crop ?? null)}`;
    let candidates = !forceExtract
      ? this.wallpaperPaletteCache.get(cacheKey)
      : undefined;

    if (!candidates) {
      const reqSeq = ++this.wallpaperReqSeq;
      this.wallpaperBusy = true;
      this.emitChange();
      try {
        const res = await apiFetch(
          `./api/theme/wallpaper?monitor=${encodeURIComponent(target.id)}&sig=${encodeURIComponent(target.signature)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const blob = await res.blob();
        const extracted = await extractWallpaperSeedColors(blob, target.crop);
        if (reqSeq !== this.wallpaperReqSeq || this.settings.seedSource !== 'wallpaper') {
          return;
        }
        if (this.wallpaperPaletteCache.size >= 16) {
          const oldest = this.wallpaperPaletteCache.keys().next().value;
          if (oldest !== undefined) {
            this.wallpaperPaletteCache.delete(oldest);
          }
        }
        this.wallpaperPaletteCache.set(cacheKey, extracted);
        candidates = extracted;
      } catch {
        if (reqSeq !== this.wallpaperReqSeq || this.settings.seedSource !== 'wallpaper') {
          return;
        }
        this.wallpaperBusy = false;
        this.wallpaperCandidates = [];
        this.seedFallbackActive = true;
        this.seedStatusMessage = '壁纸加载或取色失败，已回退至手动种子色';
        this.applyResolvedSeedHex(this.settings.manualSeedHex);
        this.emitChange();
        return;
      } finally {
        if (reqSeq === this.wallpaperReqSeq) {
          this.wallpaperBusy = false;
        }
      }
    }

    this.wallpaperCandidates = [...candidates];
    const idx = Math.max(
      0,
      Math.min(candidates.length - 1, this.settings.wallpaperColorIndex)
    );
    this.seedFallbackActive = false;
    this.seedStatusMessage = `已从「${target.label}」提取 Monet 候选色`;
    this.applyResolvedSeedHex(candidates[idx] ?? DEFAULT_SEED_HEX);
  }

  setSeedSource(source: SeedSourceMode): void {
    if (!VALID_SEED_SOURCES.has(source) || this.settings.seedSource === source) {
      return;
    }
    this.settings = { ...this.settings, seedSource: source };
    this.saveSettings();
    if (source === 'manual') {
      void this.resolveActiveSeedColor(false);
      this.emitChange();
    } else if (this.systemTheme) {
      void this.resolveActiveSeedColor(false);
      void this.refreshSystemTheme(false);
      this.emitChange();
    } else {
      void this.refreshSystemTheme(false);
      this.emitChange();
    }
  }

  setManualSeedHex(rawHex: string): boolean {
    if (!isValidSeedHex(rawHex)) {
      return false;
    }
    const normalized = normalizeSeedHex(rawHex);
    this.settings = {
      ...this.settings,
      manualSeedHex: normalized,
      ...(this.settings.seedSource !== 'manual' ? { seedSource: 'manual' as const } : {}),
    };
    this.saveSettings();
    void this.resolveActiveSeedColor(false);
    this.emitChange();
    return true;
  }

  setWallpaperMonitor(monitor: WallpaperMonitorMode): void {
    const next = (monitor || 'follow-window').trim() || 'follow-window';
    if (this.settings.wallpaperMonitor === next) {
      return;
    }
    this.settings = {
      ...this.settings,
      wallpaperMonitor: next,
      wallpaperColorIndex: 0,
    };
    this.saveSettings();
    if (this.settings.seedSource === 'wallpaper') {
      void this.resolveActiveSeedColor(false);
    }
    this.emitChange();
  }

  setWallpaperColorIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= 4) {
      return;
    }
    this.settings = { ...this.settings, wallpaperColorIndex: index };
    this.saveSettings();
    if (this.settings.seedSource === 'wallpaper' && this.wallpaperCandidates.length > 0) {
      const clamped = Math.min(index, this.wallpaperCandidates.length - 1);
      this.applyResolvedSeedHex(this.wallpaperCandidates[clamped]);
    }
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
