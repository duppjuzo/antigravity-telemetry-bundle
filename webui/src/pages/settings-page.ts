import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { telemetryStore } from '../state/store';
import {
  MONET_VARIANT_OPTIONS,
  type MonetSpecVersion,
  type MonetVariantId,
  type ThemeMode,
} from '../theme/monet-engine';
import type {
  HomeScope,
  SessionIndexItem,
  StatsResponse,
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
  @state() private sessionSearch = '';

  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncFromStore();
    this.unsubscribe = telemetryStore.subscribe(() => this.syncFromStore());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  private syncFromStore(): void {
    this.settings = telemetryStore.settings;
    this.data = telemetryStore.data;
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
          </div>

          <md-list class="settings-list">
            <!-- 1. 主题模式 -->
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
                menu-positioning="fixed"
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
                menu-positioning="fixed"
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
                menu-positioning="fixed"
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

        <!-- Section 2: 主页统计作用域 -->
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
                menu-positioning="fixed"
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

        <!-- Section 3: 手动选择会话 -->
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
                            Ctx ${ctxStr}
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
}

declare global {
  interface HTMLElementTagNameMap {
    'settings-page': SettingsPage;
  }
}
