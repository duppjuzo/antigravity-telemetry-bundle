import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { telemetryStore } from '../state/store';
import type { PageId } from '../types/telemetry';
import { renderMdIcon, type IconName } from '../utils/format';

interface NavEntry {
  id: PageId;
  label: string;
  icon: IconName;
}

const NAV_ITEMS: NavEntry[] = [
  { id: 'home', label: '主页', icon: 'home' },
  { id: 'context', label: '上下文', icon: 'donut_large' },
  { id: 'steps', label: '单步统计', icon: 'waterfall_chart' },
  { id: 'models', label: '模型统计', icon: 'pie_chart' },
  { id: 'global', label: '全局趋势', icon: 'trending_up' },
  { id: 'sessions', label: '最近会话', icon: 'history' },
  { id: 'settings', label: '设置', icon: 'settings' },
];

@customElement('telemetry-app')
export class TelemetryApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--md-sys-color-background);
      color: var(--md-sys-color-on-background);
    }

    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    /* M3-WEB-PLACEHOLDER: Top App Bar (not provided by @material/web@2.5.0) */
    .top-app-bar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      height: 56px;
      padding: 0 12px;
      background: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }

    .top-bar-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .top-bar-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      line-height: 1.25;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .top-bar-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .live-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      background: var(--md-sys-color-surface-container-high);
      color: var(--md-sys-color-on-surface-variant);
      border: 1px solid var(--md-sys-color-outline-variant);
    }

    .live-pill.active {
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      border-color: transparent;
    }

    .drawer-header {
      padding: 16px 20px 12px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }

    .drawer-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--md-sys-color-on-surface);
    }

    .drawer-subtitle {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
      margin-top: 2px;
    }

    .drawer-list {
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      --md-list-container-color: transparent;
    }

    .nav-item {
      border-radius: 9999px;
      overflow: hidden;
    }

    .nav-item.active {
      background: var(--md-sys-color-secondary-container);
      --md-list-item-label-text-color: var(
        --md-sys-color-on-secondary-container
      );
      --md-list-item-leading-icon-color: var(
        --md-sys-color-on-secondary-container
      );
      font-weight: 600;
    }

    .main-viewport {
      flex: 1;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      container-type: inline-size;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      margin-bottom: 12px;
      border-radius: 12px;
      background: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      font-size: 13px;
    }
  `;

  @state() private activePage: PageId = telemetryStore.activePage;
  @state() private drawerOpen = telemetryStore.drawerOpen;
  @state() private liveEnabled = telemetryStore.settings.liveEnabled;
  @state() private isFetching = telemetryStore.isFetching;
  @state() private lastError = telemetryStore.lastError;

  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncFromStore();
    this.unsubscribe = telemetryStore.subscribe(() => this.syncFromStore());
    telemetryStore.start();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  private syncFromStore(): void {
    this.activePage = telemetryStore.activePage;
    this.drawerOpen = telemetryStore.drawerOpen;
    this.liveEnabled = telemetryStore.settings.liveEnabled;
    this.isFetching = telemetryStore.isFetching;
    this.lastError = telemetryStore.lastError;
  }

  private handleDrawerChanged(e: CustomEvent<{ opened: boolean }>): void {
    const opened = Boolean(e.detail?.opened);
    if (opened !== telemetryStore.drawerOpen) {
      telemetryStore.setDrawerOpen(opened);
    }
  }

  private renderPage() {
    switch (this.activePage) {
      case 'home':
        return html`<home-page></home-page>`;
      case 'context':
        return html`<context-page></context-page>`;
      case 'steps':
        return html`<steps-page></steps-page>`;
      case 'models':
        return html`<models-page></models-page>`;
      case 'global':
        return html`<global-trends-page></global-trends-page>`;
      case 'sessions':
        return html`<recent-sessions-page></recent-sessions-page>`;
      case 'settings':
        return html`<settings-page></settings-page>`;
    }
  }

  render() {
    const currentNav =
      NAV_ITEMS.find((n) => n.id === this.activePage) ?? NAV_ITEMS[0];

    return html`
      <md-navigation-drawer-modal
        .opened=${this.drawerOpen}
        @navigation-drawer-changed=${this.handleDrawerChanged}
      >
        <div class="drawer-header">
          <div class="drawer-title">Antigravity Telemetry</div>
          <div class="drawer-subtitle">Usage &amp; Performance</div>
        </div>
        <md-list class="drawer-list">
          ${NAV_ITEMS.map((item) => {
            const isActive = item.id === this.activePage;
            return html`
              <md-list-item
                type="button"
                class="nav-item ${isActive ? 'active' : ''}"
                aria-current=${isActive ? 'page' : 'false'}
                @click=${() => telemetryStore.navigate(item.id)}
              >
                ${renderMdIcon(item.icon, 'start')}
                <span slot="headline">${item.label}</span>
              </md-list-item>
            `;
          })}
        </md-list>
      </md-navigation-drawer-modal>

      <div class="app-shell">
        <header class="top-app-bar">
          <div class="top-bar-left">
            <md-icon-button
              aria-label="打开导航菜单"
              @click=${() => telemetryStore.setDrawerOpen(!this.drawerOpen)}
            >
              ${renderMdIcon('menu')}
            </md-icon-button>
            <h1 class="top-bar-title">${currentNav.label}</h1>
          </div>

          <div class="top-bar-actions">
            <span class="live-pill ${this.liveEnabled ? 'active' : ''}">
              ${this.liveEnabled ? 'LIVE 3s' : '已暂停'}
            </span>
            <md-icon-button
              aria-label=${this.liveEnabled ? '暂停实时轮询' : '开启实时轮询'}
              @click=${() => telemetryStore.toggleLive()}
            >
              ${renderMdIcon(this.liveEnabled ? 'pause' : 'play_arrow')}
            </md-icon-button>
            <md-icon-button
              aria-label="立即刷新"
              ?disabled=${this.isFetching}
              @click=${() => void telemetryStore.refresh(true)}
            >
              ${renderMdIcon('refresh')}
            </md-icon-button>
          </div>
        </header>

        <main class="main-viewport">
          ${this.lastError
            ? html`
                <div class="error-banner" role="alert">
                  ${renderMdIcon('error_outline')}
                  <span>读取遥测数据失败: ${this.lastError}</span>
                </div>
              `
            : nothing}
          ${this.renderPage()}
        </main>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'telemetry-app': TelemetryApp;
  }
}
