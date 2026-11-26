import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { telemetryStore } from '../state/store';
import {
  MONET_VARIANT_OPTIONS,
  type AppliedPaletteInfo,
  type MonetSpecVersion,
  type MonetVariantId,
  type ThemeMode,
} from '../theme/monet-engine';
import {
  DEFAULT_SEED_HEX,
  PRESET_SEED_COLORS,
  isValidSeedHex,
  normalizeSeedHex,
} from '../theme/seed-provider';
import type { MdSwitch } from '@material/web/switch/switch.js';
import type {
  HomeScope,
  HudStatus,
  SeedSourceMode,
  SessionIndexItem,
  StatsResponse,
  SystemThemeInfo,
  UserSettings,
} from '../types/telemetry';
import {
  ctxToneVar,
  fmtCompact,
  fmtNum,
  renderMdIcon,
  shortModel,
} from '../utils/format';

const THEME_MODE_OPTIONS: ReadonlyArray<{ value: ThemeMode; label: string }> = [
  { value: 'light', label: '亮色' },
  { value: 'dark', label: '暗色' },
  { value: 'follow-gui', label: '跟随 GUI' },
];

const SPEC_VERSION_OPTIONS: ReadonlyArray<{
  value: MonetSpecVersion;
  label: string;
}> = [
  { value: '2021', label: 'SPEC_2021' },
  { value: '2025', label: 'SPEC_2025' },
];

const HOME_SCOPE_OPTIONS: ReadonlyArray<{ value: HomeScope; label: string }> = [
  { value: 'latest_step', label: '最新一步' },
  { value: 'session', label: '单个会话' },
  { value: 'global', label: '全局' },
];

const SEED_SOURCE_OPTIONS: ReadonlyArray<{ value: SeedSourceMode; label: string }> = [
  { value: 'manual', label: '手动指定' },
  { value: 'system-accent', label: '系统主题色' },
  { value: 'wallpaper', label: '桌面壁纸取色' },
];

function formatAccentSourceLabel(source: string | null | undefined): string {
  switch (source) {
    case 'windows-dwm':
      return 'Windows DWM';
    case 'windows-explorer':
      return 'Windows Explorer';
    case 'xdg-portal':
      return 'XDG Portal';
    case 'kdeglobals':
      return 'KDE Plasma';
    case 'gnome-gsettings':
      return 'GNOME Accent';
    case 'gnome-yaru':
      return 'Ubuntu Yaru';
    default:
      return source || '系统接口';
  }
}

@customElement('settings-page')
export class SettingsPage extends LitElement {
  static styles = [
    css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      :host {
        display: block;
        container-type: inline-size;
      }

      .page-stack {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .settings-card {
        display: block;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        --md-outlined-card-container-color: var(
          --md-sys-color-surface-container-low
        );
        --md-outlined-card-outline-color: var(--md-sys-color-outline-variant);
        --md-outlined-card-container-shape: var(--tm-radius-md, 16px);
      }

      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .section-title-row {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .section-title-row md-icon {
        --md-icon-size: 20px;
        color: var(--md-sys-color-primary);
      }

      .section-title {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: var(--md-sys-color-on-surface);
      }

      .mode-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 9px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 11px;
        font-weight: 700;
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      .mode-badge.pinned {
        background: var(--md-sys-color-tertiary-container);
        color: var(--md-sys-color-on-tertiary-container);
      }

      .settings-list {
        --md-list-container-color: transparent;
        padding: 0;
      }

      .setting-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px 14px;
        padding: 6px 0;
      }

      .setting-info {
        flex: 1 1 210px;
        min-width: 0;
      }

      .setting-info md-list-item {
        --md-list-item-leading-space: 0px;
        --md-list-item-trailing-space: 0px;
        --md-list-item-top-space: 6px;
        --md-list-item-bottom-space: 6px;
        --md-list-item-container-color: transparent;
      }

      .setting-select {
        flex: 0 1 210px;
        min-width: 170px;
        --md-outlined-select-text-field-container-shape: var(
          --tm-radius-sm,
          12px
        );
        --md-outlined-select-text-field-top-space: 10px;
        --md-outlined-select-text-field-bottom-space: 10px;
      }

      md-divider {
        margin: 4px 0;
        --md-divider-color: var(--md-sys-color-outline-variant);
      }

      .quick-actions-list {
        --md-list-container-color: transparent;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 10px;
      }

      .session-item {
        border-radius: var(--tm-radius-sm, 12px);
        overflow: hidden;
        --md-list-item-container-color: var(--md-sys-color-surface-container);
        --md-list-item-top-space: 8px;
        --md-list-item-bottom-space: 8px;
      }

      .session-item.selected {
        --md-list-item-container-color: var(
          --md-sys-color-secondary-container
        );
        --md-list-item-label-text-color: var(
          --md-sys-color-on-secondary-container
        );
        --md-list-item-supporting-text-color: var(
          --md-sys-color-on-secondary-container
        );
        --md-list-item-trailing-supporting-text-color: var(
          --md-sys-color-on-secondary-container
        );
        --md-list-item-leading-icon-color: var(
          --md-sys-color-on-secondary-container
        );
      }

      .search-box-wrap {
        margin: 10px 0 8px;
      }

      .session-search {
        width: 100%;
        --md-outlined-field-container-shape: var(--tm-radius-sm, 12px);
        --md-outlined-text-field-top-space: 10px;
        --md-outlined-text-field-bottom-space: 10px;
      }

      .session-picker-list {
        --md-list-container-color: transparent;
        padding: 0;
        max-height: 360px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .status-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--md-sys-color-outline);
      }

      .status-dot.active {
        background: var(--tm-status-ok);
      }

      .status-dot.recent {
        background: var(--tm-status-warn);
      }

      .trailing-meta {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: var(--tm-font-mono);
        font-size: 11.5px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .trailing-meta md-icon {
        --md-icon-size: 18px;
      }

      .empty-state {
        padding: 20px 12px;
        text-align: center;
        font-size: 12.5px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .mode-badge.running {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
      }

      .mode-badge.unsupported {
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-on-surface-variant);
      }

      .hud-error {
        margin-top: 8px;
        padding: 8px 12px;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-error-container);
        color: var(--md-sys-color-on-error-container);
        font-size: 12px;
      }

      .setting-action {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
      }

      .seed-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px 3px 6px;
        border-radius: var(--tm-radius-full, 9999px);
        background: var(--md-sys-color-surface-container-high);
        border: 1px solid var(--md-sys-color-outline-variant);
        font-family: var(--tm-font-mono);
        font-size: 11.5px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .seed-pill-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid color-mix(in srgb, var(--md-sys-color-on-surface) 22%, transparent);
        flex-shrink: 0;
      }

      .seed-subpanel {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 4px 0 10px;
        padding: 12px;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-surface-container);
        border: 1px solid var(--md-sys-color-outline-variant);
      }

      .seed-manual-controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
      }

      .color-picker-wrap {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid var(--md-sys-color-outline);
        flex-shrink: 0;
        cursor: pointer;
      }

      .color-picker-input {
        position: absolute;
        inset: -6px;
        width: calc(100% + 12px);
        height: calc(100% + 12px);
        border: 0;
        padding: 0;
        background: transparent;
        cursor: pointer;
      }

      .hex-field {
        flex: 0 1 150px;
        min-width: 128px;
        --md-outlined-field-container-shape: var(--tm-radius-sm, 12px);
        --md-outlined-text-field-top-space: 8px;
        --md-outlined-text-field-bottom-space: 8px;
      }

      .swatch-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }

      .swatch-btn {
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid color-mix(in srgb, var(--md-sys-color-on-surface) 18%, transparent);
        padding: 0;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.14s ease, box-shadow 0.14s ease;
      }

      .swatch-btn:hover {
        transform: scale(1.08);
      }

      .swatch-btn.active {
        border-color: var(--md-sys-color-primary);
        box-shadow: 0 0 0 2px var(--md-sys-color-surface-container), 0 0 0 4px var(--md-sys-color-primary);
      }

      .swatch-btn md-icon {
        --md-icon-size: 16px;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.55));
        color: #ffffff;
      }

      .wallpaper-swatch-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 5px 10px 5px 6px;
        border-radius: var(--tm-radius-full, 9999px);
        border: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface-container-low);
        color: var(--md-sys-color-on-surface);
        font-family: var(--tm-font-mono);
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        transition: border-color 0.14s ease, background 0.14s ease;
      }

      .wallpaper-swatch-btn:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .wallpaper-swatch-btn.active {
        border-color: var(--md-sys-color-primary);
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      .wallpaper-swatch-dot {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid color-mix(in srgb, var(--md-sys-color-on-surface) 22%, transparent);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .wallpaper-swatch-dot md-icon {
        --md-icon-size: 12px;
        color: #ffffff;
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.6));
      }

      .seed-status-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .seed-status-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        flex-wrap: wrap;
        font-size: 12.5px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .seed-warning {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 10px;
        border-radius: var(--tm-radius-xs, 8px);
        background: var(--md-sys-color-error-container);
        color: var(--md-sys-color-on-error-container);
        font-size: 12px;
        line-height: 1.45;
      }

      .seed-warning md-icon {
        --md-icon-size: 16px;
        flex-shrink: 0;
        margin-top: 1px;
      }

      .sub-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface-variant);
      }

      @container (width < 480px) {
        .setting-row {
          flex-direction: column;
          align-items: stretch;
          gap: 6px;
          padding: 8px 0;
        }

        .setting-info {
          flex: none;
        }

        .setting-select {
          flex: none;
          width: 100%;
          min-width: 0;
        }
      }
    `,
  ];

  @state() private settings: UserSettings = telemetryStore.settings;
  @state() private data: StatsResponse | null = telemetryStore.data;
  @state() private appliedPalette: AppliedPaletteInfo | null = telemetryStore.appliedPalette;
  @state() private systemTheme: SystemThemeInfo | null = telemetryStore.systemTheme;
  @state() private wallpaperCandidates: string[] = telemetryStore.wallpaperCandidates;
  @state() private wallpaperBusy = telemetryStore.wallpaperBusy;
  @state() private resolvedWallpaperMonitorId: string | null =
    telemetryStore.resolvedWallpaperMonitorId;
  @state() private seedStatusMessage: string | null = telemetryStore.seedStatusMessage;
  @state() private seedFallbackActive = telemetryStore.seedFallbackActive;
  @state() private hexDraft = telemetryStore.settings.manualSeedHex;
  @state() private hudStatus: HudStatus | null = telemetryStore.hudStatus;
  @state() private hudBusy = telemetryStore.hudBusy;
  @state() private hudError: string | null = telemetryStore.hudError;
  @state() private sessionSearch = '';

  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncFromStore();
    this.unsubscribe = telemetryStore.subscribe(() => this.syncFromStore());
    void telemetryStore.refreshHudStatus();
    void telemetryStore.refreshSystemTheme(false);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  private syncFromStore(): void {
    const prevManual = this.settings.manualSeedHex;
    this.settings = telemetryStore.settings;
    this.data = telemetryStore.data;
    this.appliedPalette = telemetryStore.appliedPalette;
    this.systemTheme = telemetryStore.systemTheme;
    this.wallpaperCandidates = telemetryStore.wallpaperCandidates;
    this.wallpaperBusy = telemetryStore.wallpaperBusy;
    this.resolvedWallpaperMonitorId = telemetryStore.resolvedWallpaperMonitorId;
    this.seedStatusMessage = telemetryStore.seedStatusMessage;
    this.seedFallbackActive = telemetryStore.seedFallbackActive;
    if (prevManual !== this.settings.manualSeedHex) {
      this.hexDraft = this.settings.manualSeedHex;
    }
    this.hudStatus = telemetryStore.hudStatus;
    this.hudBusy = telemetryStore.hudBusy;
    this.hudError = telemetryStore.hudError;
  }

  private handleHudToggle(e: Event): void {
    const selected = Boolean((e.target as MdSwitch).selected);
    void telemetryStore.setHudEnabled(selected);
  }

  private handleHudAlwaysOnTop(e: Event): void {
    const selected = Boolean((e.target as MdSwitch).selected);
    void telemetryStore.setHudAlwaysOnTop(selected);
  }

  private handleHudResetPosition(): void {
    void telemetryStore.resetHudPosition();
  }

  private handleThemeModeChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as ThemeMode;
    telemetryStore.setThemeConfig({ themeMode: value });
  }

  private handleVariantChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as MonetVariantId;
    telemetryStore.setThemeConfig({ variant: value });
  }

  private handleSpecVersionChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as MonetSpecVersion;
    telemetryStore.setThemeConfig({ specVersion: value });
  }

  private handleSeedSourceChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as SeedSourceMode;
    telemetryStore.setSeedSource(value);
  }

  private handleManualColorInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    if (isValidSeedHex(val)) {
      const normalized = normalizeSeedHex(val);
      this.hexDraft = normalized;
      telemetryStore.setManualSeedHex(normalized);
    }
  }

  private handleManualHexTextInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value ?? '';
    this.hexDraft = val;
    const trimmed = val.trim();
    if (/^#?[0-9a-fA-F]{6}$/.test(trimmed)) {
      telemetryStore.setManualSeedHex(trimmed);
    }
  }

  private handleManualHexBlur(): void {
    if (isValidSeedHex(this.hexDraft)) {
      const normalized = normalizeSeedHex(this.hexDraft);
      this.hexDraft = normalized;
      telemetryStore.setManualSeedHex(normalized);
    } else {
      this.hexDraft = this.settings.manualSeedHex;
    }
  }

  private handleRefreshSystemTheme(): void {
    void telemetryStore.refreshSystemTheme(true);
  }

  private handleWallpaperMonitorChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    telemetryStore.setWallpaperMonitor(value);
  }

  private handleHomeScopeChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as HomeScope;
    telemetryStore.setHomeScope(value);
  }

  private handleSearchInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.sessionSearch = target.value ?? '';
  }

  private clearSearch(): void {
    this.sessionSearch = '';
  }

  private getFilteredSessions(index: SessionIndexItem[]): SessionIndexItem[] {
    const q = this.sessionSearch.trim().toLowerCase();
    if (!q) return index;
    return index.filter(
      (s) =>
        (s.title || '').toLowerCase().includes(q) ||
        (s.model || '').toLowerCase().includes(q) ||
        (s.project || '').toLowerCase().includes(q) ||
        (s.convo_id || '').toLowerCase().includes(q)
    );
  }

  render() {
    const sessionsIndex = this.data?.sessions_index ?? [];
    const filteredSessions = this.getFilteredSessions(sessionsIndex);
    const autoLatestId = this.data?.auto_latest_id ?? null;
    const autoLatestSession = autoLatestId
      ? sessionsIndex.find((s) => s.convo_id === autoLatestId) ?? null
      : sessionsIndex[0] ?? null;

    const hostConvoId = telemetryStore.hostConvoId;
    const hostSession = hostConvoId
      ? sessionsIndex.find((s) => s.convo_id === hostConvoId) ?? null
      : null;

    const isAuto = this.settings.sessionMode === 'auto';
    const isPinnedHost =
      !isAuto &&
      hostSession !== null &&
      this.settings.pinnedConvoId === hostSession.convo_id;

    return html`
      <div class="page-stack">
        <!-- Section 1: 外观与 Monet 配色 -->
        <md-outlined-card class="settings-card">
          <div class="section-head">
            <div class="section-title-row">
              ${renderMdIcon('palette')}
              <h2 class="section-title">外观与 Monet 配色</h2>
            </div>
            <span class="seed-pill" title="当前生效种子色">
              <span
                class="seed-pill-dot"
                style="background:${this.appliedPalette?.seedHex || this.settings.manualSeedHex || DEFAULT_SEED_HEX};"
              ></span>
              <span>${this.appliedPalette?.seedHex || this.settings.manualSeedHex || DEFAULT_SEED_HEX}</span>
            </span>
          </div>

          <md-list class="settings-list">
            <!-- 1. 种子色来源 -->
            <div class="setting-row">
              <div class="setting-info">
                <md-list-item>
                  ${renderMdIcon(
                    this.settings.seedSource === 'wallpaper'
                      ? 'wallpaper'
                      : this.settings.seedSource === 'system-accent'
                        ? 'desktop_windows'
                        : 'colorize',
                    'start'
                  )}
                  <span slot="headline">种子色来源</span>
                  <span slot="supporting-text">
                    手动选色、跟随系统主题色或从桌面壁纸提取 Monet 色板
                  </span>
                </md-list-item>
              </div>
              <md-outlined-select
                class="setting-select"
                aria-label="种子色来源"
                menu-positioning="popover"
                .value=${this.settings.seedSource}
                @change=${this.handleSeedSourceChange}
              >
                ${SEED_SOURCE_OPTIONS.map(
                  (opt) => html`
                    <md-select-option
                      value=${opt.value}
                      ?selected=${this.settings.seedSource === opt.value}
                    >
                      <div slot="headline">${opt.label}</div>
                    </md-select-option>
                  `
                )}
              </md-outlined-select>
            </div>

            ${this.renderSeedSourceControls()}

            <md-divider></md-divider>

            <!-- 2. 主题模式 -->
            <div class="setting-row">
              <div class="setting-info">
                <md-list-item>
                  ${renderMdIcon(
                    this.settings.themeMode === 'dark'
                      ? 'dark_mode'
                      : this.settings.themeMode === 'light'
                        ? 'light_mode'
                        : 'computer',
                    'start'
                  )}
                  <span slot="headline">主题模式</span>
                  <span slot="supporting-text">
                    亮色、暗色或自动跟随宿主 GUI 主题
                  </span>
                </md-list-item>
              </div>
              <md-outlined-select
                class="setting-select"
                aria-label="主题模式"
                menu-positioning="popover"
                .value=${this.settings.themeMode}
                @change=${this.handleThemeModeChange}
              >
                ${THEME_MODE_OPTIONS.map(
                  (opt) => html`
                    <md-select-option
                      value=${opt.value}
                      ?selected=${this.settings.themeMode === opt.value}
                    >
                      <div slot="headline">${opt.label}</div>
                    </md-select-option>
                  `
                )}
              </md-outlined-select>
            </div>

            <md-divider></md-divider>

            <!-- 2. 色板风格 -->
            <div class="setting-row">
              <div class="setting-info">
                <md-list-item>
                  ${renderMdIcon('palette', 'start')}
                  <span slot="headline">色板风格</span>
                  <span slot="supporting-text">部分色板不支持 SPEC_2025</span>
                </md-list-item>
              </div>
              <md-outlined-select
                class="setting-select"
                aria-label="色板风格"
                menu-positioning="popover"
                .value=${this.settings.variant}
                @change=${this.handleVariantChange}
              >
                ${MONET_VARIANT_OPTIONS.map(
                  (opt) => html`
                    <md-select-option
                      value=${opt.id}
                      ?selected=${this.settings.variant === opt.id}
                    >
                      <div slot="headline">${opt.label}</div>
                    </md-select-option>
                  `
                )}
              </md-outlined-select>
            </div>

            <md-divider></md-divider>

            <!-- 3. 推导算法 -->
            <div class="setting-row">
              <div class="setting-info">
                <md-list-item>
                  ${renderMdIcon('auto_awesome', 'start')}
                  <span slot="headline">推导算法</span>
                  <span slot="supporting-text">
                    动态色阶生成规范版本
                  </span>
                </md-list-item>
              </div>
              <md-outlined-select
                class="setting-select"
                aria-label="推导算法"
                menu-positioning="popover"
                .value=${this.settings.specVersion}
                @change=${this.handleSpecVersionChange}
              >
                ${SPEC_VERSION_OPTIONS.map(
                  (opt) => html`
                    <md-select-option
                      value=${opt.value}
                      ?selected=${this.settings.specVersion === opt.value}
                    >
                      <div slot="headline">${opt.label}</div>
                    </md-select-option>
                  `
                )}
              </md-outlined-select>
            </div>
          </md-list>
        </md-outlined-card>

        <!-- Section 2: 桌面悬浮窗 -->
        ${this.renderHudSection()}

        <!-- Section 3: 主页统计作用域 -->
        <md-outlined-card class="settings-card">
          <div class="section-head">
            <div class="section-title-row">
              ${renderMdIcon('home')}
              <h2 class="section-title">主页统计作用域</h2>
            </div>
          </div>

          <md-list class="settings-list">
            <div class="setting-row">
              <div class="setting-info">
                <md-list-item>
                  ${renderMdIcon('insights', 'start')}
                  <span slot="headline">主页统计作用域</span>
                  <span slot="supporting-text">
                    切换主页默认摘要卡片统计范围
                  </span>
                </md-list-item>
              </div>
              <md-outlined-select
                class="setting-select"
                aria-label="主页统计作用域"
                menu-positioning="popover"
                .value=${this.settings.homeScope}
                @change=${this.handleHomeScopeChange}
              >
                ${HOME_SCOPE_OPTIONS.map(
                  (opt) => html`
                    <md-select-option
                      value=${opt.value}
                      ?selected=${this.settings.homeScope === opt.value}
                    >
                      <div slot="headline">${opt.label}</div>
                    </md-select-option>
                  `
                )}
              </md-outlined-select>
            </div>
          </md-list>
        </md-outlined-card>

        <!-- Section 4: 手动选择会话 -->
        <md-outlined-card class="settings-card">
          <div class="section-head">
            <div class="section-title-row">
              ${renderMdIcon('push_pin')}
              <h2 class="section-title">手动选择会话</h2>
            </div>
            <span class="mode-badge ${isAuto ? '' : 'pinned'}">
              ${isAuto ? 'AUTO' : 'PINNED'}
            </span>
          </div>

          <md-list class="quick-actions-list">
            <md-list-item
              type="button"
              class="session-item ${isAuto ? 'selected' : ''}"
              @click=${() => telemetryStore.selectAutoSession()}
            >
              ${renderMdIcon('auto_awesome', 'start')}
              <span slot="headline">自动跟踪最新会话 (AUTO)</span>
              <span slot="supporting-text">
                ${autoLatestSession
                  ? `${autoLatestSession.title || autoLatestSession.convo_id} · ${shortModel(
                      autoLatestSession.model
                    )}`
                  : '实时跟踪本地最新活跃对话'}
              </span>
              ${isAuto ? renderMdIcon('check', 'end') : nothing}
            </md-list-item>

            ${hostSession
              ? html`
                  <md-list-item
                    type="button"
                    class="session-item ${isPinnedHost ? 'selected' : ''}"
                    @click=${() =>
                      telemetryStore.pinSession(hostSession.convo_id)}
                  >
                    ${renderMdIcon('push_pin', 'start')}
                    <span slot="headline">切换到当前窗口会话</span>
                    <span slot="supporting-text">
                      ${hostSession.title || hostSession.convo_id} ·
                      ${shortModel(hostSession.model)}
                    </span>
                    ${isPinnedHost ? renderMdIcon('check', 'end') : nothing}
                  </md-list-item>
                `
              : nothing}
          </md-list>

          <md-divider></md-divider>

          <div class="search-box-wrap">
            <md-outlined-text-field
              class="session-search"
              type="search"
              label="搜索会话"
              placeholder="按标题、模型、项目或 ID 筛选..."
              aria-label="搜索手动选择会话"
              .value=${this.sessionSearch}
              @input=${this.handleSearchInput}
            >
              ${renderMdIcon('search', 'leading-icon')}
              ${this.sessionSearch
                ? html`
                    <md-icon-button
                      slot="trailing-icon"
                      aria-label="清除搜索"
                      @click=${this.clearSearch}
                    >
                      ${renderMdIcon('close')}
                    </md-icon-button>
                  `
                : nothing}
            </md-outlined-text-field>
          </div>

          ${filteredSessions.length === 0
            ? html`
                <div class="empty-state">
                  ${sessionsIndex.length === 0
                    ? '暂无可选会话'
                    : '无匹配会话'}
                </div>
              `
            : html`
                <md-list
                  class="session-picker-list"
                  aria-label="会话列表 (${filteredSessions.length})"
                >
                  ${filteredSessions.map((s) => {
                    const isSelected =
                      this.settings.sessionMode === 'pinned' &&
                      this.settings.pinnedConvoId === s.convo_id;
                    const dotClass = s.is_active
                      ? 'active'
                      : s.is_recent
                        ? 'recent'
                        : '';
                    const ctxStr =
                      s.ctx_used_pct != null
                        ? `${Math.round(s.ctx_used_pct)}%`
                        : '-';

                    return html`
                      <md-list-item
                        type="button"
                        class="session-item ${isSelected ? 'selected' : ''}"
                        @click=${() => telemetryStore.pinSession(s.convo_id)}
                      >
                        <span
                          slot="start"
                          class="status-dot ${dotClass}"
                          aria-hidden="true"
                        ></span>
                        <span slot="headline">${s.title || s.convo_id}</span>
                        <span slot="supporting-text">
                          ${shortModel(s.model)} ·
                          ${s.project || '未关联项目'} ·
                          ${fmtNum(s.turn_count)} 步 ·
                          ${fmtCompact(s.total_tokens)}
                        </span>
                        <span slot="trailing-supporting-text" class="trailing-meta">
                          <span
                            style="color:${isSelected
                              ? 'inherit'
                              : ctxToneVar(s.ctx_used_pct)};"
                          >
                            上下文 ${ctxStr}
                          </span>
                          ${isSelected ? renderMdIcon('check') : nothing}
                        </span>
                      </md-list-item>
                    `;
                  })}
                </md-list>
              `}
        </md-outlined-card>
      </div>
    `;
  }

  private renderSeedSourceControls() {
    const mode = this.settings.seedSource;
    if (mode === 'manual') {
      const currentHex = this.settings.manualSeedHex || DEFAULT_SEED_HEX;
      return html`
        <div class="seed-subpanel">
          <div class="seed-manual-controls">
            <label class="color-picker-wrap" title="打开系统取色器" style="background:${currentHex};">
              <input
                class="color-picker-input"
                type="color"
                aria-label="选择种子色"
                .value=${currentHex}
                @input=${this.handleManualColorInput}
              />
            </label>
            <md-outlined-text-field
              class="hex-field"
              label="种子色 HEX"
              placeholder="#ADD8E6"
              aria-label="种子色 HEX"
              maxlength="7"
              .value=${this.hexDraft}
              @input=${this.handleManualHexTextInput}
              @blur=${this.handleManualHexBlur}
            ></md-outlined-text-field>
          </div>
          <div class="swatch-row" role="group" aria-label="预设种子色">
            ${PRESET_SEED_COLORS.map((preset) => {
              const isSelected = preset.hex === currentHex;
              return html`
                <button
                  type="button"
                  class="swatch-btn ${isSelected ? 'active' : ''}"
                  style="background:${preset.hex};"
                  title="${preset.label} (${preset.hex})"
                  aria-label="${preset.label} ${preset.hex}"
                  aria-pressed=${isSelected ? 'true' : 'false'}
                  @click=${() => telemetryStore.setManualSeedHex(preset.hex)}
                >
                  ${isSelected ? renderMdIcon('check') : nothing}
                </button>
              `;
            })}
          </div>
        </div>
      `;
    }

    if (mode === 'system-accent') {
      const accent = this.systemTheme?.accent;
      const accentHex = accent?.supported && accent.hex ? accent.hex : null;
      return html`
        <div class="seed-subpanel">
          <div class="seed-status-row">
            <div class="seed-status-meta">
              ${accentHex
                ? html`
                    <span class="seed-pill">
                      <span class="seed-pill-dot" style="background:${accentHex};"></span>
                      <span>${accentHex}</span>
                    </span>
                    <span>
                      来源：${formatAccentSourceLabel(accent?.source)}
                      (${this.systemTheme?.desktop_env || 'System'})
                    </span>
                  `
                : html`<span>正在检测系统主题色...</span>`}
            </div>
            <md-icon-button
              aria-label="重新读取系统主题色"
              title="重新读取系统主题色"
              @click=${this.handleRefreshSystemTheme}
            >
              ${renderMdIcon('refresh')}
            </md-icon-button>
          </div>
          ${this.seedFallbackActive && this.seedStatusMessage
            ? html`
                <div class="seed-warning" role="status">
                  ${renderMdIcon('error_outline')}
                  <span>${this.seedStatusMessage}</span>
                </div>
              `
            : nothing}
        </div>
      `;
    }

    // mode === 'wallpaper'
    const wp = this.systemTheme?.wallpaper;
    const monitors = wp?.monitors ?? [];
    const followSupported = Boolean(wp?.follow_window_supported);
    const activeMonitorObj = this.resolvedWallpaperMonitorId
      ? monitors.find((m) => m.id === this.resolvedWallpaperMonitorId) ?? null
      : null;

    const monitorOptions: Array<{ value: string; label: string }> = [];
    if (followSupported) {
      monitorOptions.push({
        value: 'follow-window',
        label: '跟随 Antigravity 窗口所在屏',
      });
    }
    monitorOptions.push({ value: 'primary', label: '主显示器' });
    for (const m of monitors) {
      monitorOptions.push({ value: m.id, label: m.label });
    }

    const selectedMonitorPref = monitorOptions.some(
      (o) => o.value === this.settings.wallpaperMonitor
    )
      ? this.settings.wallpaperMonitor
      : monitorOptions[0]?.value || 'primary';

    const clampedIdx =
      this.wallpaperCandidates.length > 0
        ? Math.min(
            this.settings.wallpaperColorIndex,
            this.wallpaperCandidates.length - 1
          )
        : 0;

    return html`
      <div class="seed-subpanel">
        <div class="setting-row" style="padding:0;">
          <div class="setting-info">
            <span class="sub-label">目标显示器</span>
            ${activeMonitorObj
              ? html`
                  <div style="font-size:11.5px;color:var(--md-sys-color-on-surface-variant);margin-top:2px;">
                    当前生效：${activeMonitorObj.label}${wp?.position === 'span' ? ' · 跨区裁剪' : ''}
                  </div>
                `
              : nothing}
          </div>
          <md-outlined-select
            class="setting-select"
            aria-label="目标显示器"
            menu-positioning="popover"
            ?disabled=${monitors.length === 0}
            .value=${selectedMonitorPref}
            @change=${this.handleWallpaperMonitorChange}
          >
            ${monitorOptions.map(
              (opt) => html`
                <md-select-option
                  value=${opt.value}
                  ?selected=${selectedMonitorPref === opt.value}
                >
                  <div slot="headline">${opt.label}</div>
                </md-select-option>
              `
            )}
          </md-outlined-select>
        </div>

        <div class="seed-status-row">
          <span class="sub-label">
            壁纸提取候选色（Top 4）
            ${this.wallpaperBusy ? ' · 提取中...' : ''}
          </span>
          <md-icon-button
            aria-label="重新读取壁纸并取色"
            title="重新读取壁纸并取色"
            ?disabled=${this.wallpaperBusy}
            @click=${this.handleRefreshSystemTheme}
          >
            ${renderMdIcon('refresh')}
          </md-icon-button>
        </div>

        ${this.wallpaperCandidates.length > 0
          ? html`
              <div class="swatch-row" role="group" aria-label="壁纸提取候选色">
                ${this.wallpaperCandidates.map((hex, idx) => {
                  const isSelected = idx === clampedIdx;
                  return html`
                    <button
                      type="button"
                      class="wallpaper-swatch-btn ${isSelected ? 'active' : ''}"
                      title="候选色 ${idx + 1}: ${hex}"
                      aria-pressed=${isSelected ? 'true' : 'false'}
                      @click=${() => telemetryStore.setWallpaperColorIndex(idx)}
                    >
                      <span class="wallpaper-swatch-dot" style="background:${hex};">
                        ${isSelected ? renderMdIcon('check') : nothing}
                      </span>
                      <span>${hex}</span>
                    </button>
                  `;
                })}
              </div>
            `
          : nothing}

        ${this.seedFallbackActive && this.seedStatusMessage
          ? html`
              <div class="seed-warning" role="status">
                ${renderMdIcon('error_outline')}
                <span>${this.seedStatusMessage}</span>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private renderHudSection() {
    const hud = this.hudStatus;
    const hudSupported = hud ? Boolean(hud.supported) : true;
    const hudRunning = Boolean(hud?.running);
    const badgeClass = !hudSupported
      ? 'unsupported'
      : hudRunning
        ? 'running'
        : '';
    const badgeLabel = !hudSupported
      ? '仅限 Windows'
      : hudRunning
        ? '运行中'
        : '已关闭';

    return html`
      <md-outlined-card class="settings-card">
        <div class="section-head">
          <div class="section-title-row">
            ${renderMdIcon('picture_in_picture')}
            <h2 class="section-title">桌面悬浮窗</h2>
          </div>
          <span class="mode-badge ${badgeClass}">${badgeLabel}</span>
        </div>

        <md-list class="settings-list">
          <div class="setting-row">
            <div class="setting-info">
              <md-list-item>
                ${renderMdIcon('picture_in_picture', 'start')}
                <span slot="headline">启用桌面悬浮窗</span>
                <span slot="supporting-text">
                  ${hudSupported
                    ? '在 Antigravity 窗口上方显示跟随式 M3 遥测胶囊，配色自动同步 Monet 主题'
                    : '仅支持 Windows 桌面环境'}
                </span>
              </md-list-item>
            </div>
            <div class="setting-action">
              <md-switch
                aria-label="启用桌面悬浮窗"
                .selected=${hudRunning}
                ?disabled=${!hudSupported || this.hudBusy}
                @change=${this.handleHudToggle}
              ></md-switch>
            </div>
          </div>

          ${hudSupported
            ? html`
                <md-divider></md-divider>

                <div class="setting-row">
                  <div class="setting-info">
                    <md-list-item>
                      ${renderMdIcon('push_pin', 'start')}
                      <span slot="headline">始终置顶显示</span>
                      <span slot="supporting-text">
                        切换到其他应用时保持可见，不随 Antigravity 失焦隐藏
                      </span>
                    </md-list-item>
                  </div>
                  <div class="setting-action">
                    <md-switch
                      aria-label="始终置顶显示"
                      .selected=${Boolean(hud?.always_on_top)}
                      ?disabled=${this.hudBusy}
                      @change=${this.handleHudAlwaysOnTop}
                    ></md-switch>
                  </div>
                </div>

                <md-divider></md-divider>

                <div class="setting-row">
                  <div class="setting-info">
                    <md-list-item>
                      ${renderMdIcon('restart_alt', 'start')}
                      <span slot="headline">悬浮窗位置</span>
                      <span slot="supporting-text">
                        将拖拽后的胶囊复位至 Antigravity 窗口顶部居中
                      </span>
                    </md-list-item>
                  </div>
                  <div class="setting-action">
                    <md-outlined-button
                      ?disabled=${this.hudBusy}
                      @click=${this.handleHudResetPosition}
                    >
                      重置位置
                    </md-outlined-button>
                  </div>
                </div>
              `
            : nothing}
        </md-list>

        ${this.hudError
          ? html`<div class="hud-error" role="alert">${this.hudError}</div>`
          : nothing}
      </md-outlined-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'settings-page': SettingsPage;
  }
}
