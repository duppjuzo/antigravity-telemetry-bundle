import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { tableStyles } from '../components/data-table';
import { telemetryStore } from '../state/store';
import type { RecentSession } from '../types/telemetry';
import {
  ctxToneVar,
  fmtCompact,
  fmtNum,
  fmtPct,
  fmtSec,
  fmtTps,
  renderMdIcon,
  shortModel,
} from '../utils/format';

@customElement('recent-sessions-page')
export class RecentSessionsPage extends LitElement {
  static styles = [
    tableStyles,
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

      .sessions-card {
        display: block;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        --md-outlined-card-container-color: var(
          --md-sys-color-surface-container-low
        );
        --md-outlined-card-outline-color: var(--md-sys-color-outline-variant);
        --md-outlined-card-container-shape: var(--tm-radius-md, 16px);
      }

      .card-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
      }

      .title-group {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .title-group md-icon {
        --md-icon-size: 20px;
        color: var(--md-sys-color-primary);
      }

      .card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: var(--md-sys-color-on-surface);
        line-height: 1.3;
      }

      .count-pill {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 11px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-on-surface-variant);
      }

      .search-field {
        width: 260px;
        max-width: 100%;
        --md-outlined-field-container-shape: var(--tm-radius-sm, 12px);
        --md-outlined-text-field-top-space: 10px;
        --md-outlined-text-field-bottom-space: 10px;
      }

      table.tm-table tbody tr.clickable {
        user-select: none;
      }

      table.tm-table tbody tr.clickable:active {
        background: var(--md-sys-color-surface-container-highest);
      }

      table.tm-table tbody tr.clickable.is-current {
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      table.tm-table tbody tr.clickable.is-current:hover {
        background: color-mix(
          in srgb,
          var(--md-sys-color-secondary-container) 90%,
          var(--md-sys-color-on-secondary-container)
        );
      }

      table.tm-table tbody tr.clickable.is-current th,
      table.tm-table tbody tr.clickable.is-current td {
        color: var(--md-sys-color-on-secondary-container);
      }

      .session-cell {
        position: relative;
        max-width: 300px;
      }

      .session-main {
        display: flex;
        align-items: center;
        gap: 7px;
        min-width: 0;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
        background: var(--md-sys-color-outline);
      }

      .status-dot.active {
        background: var(--tm-status-ok);
      }

      .status-dot.recent {
        background: var(--tm-status-warn);
      }

      .session-title {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .current-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 6px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 10px;
        font-weight: 700;
        flex-shrink: 0;
        background: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
      }

      .session-project {
        margin-top: 2px;
        padding-left: 15px;
        font-size: 11px;
        font-weight: 400;
        color: var(--md-sys-color-on-surface-variant);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      tr.is-current .session-project {
        color: var(--md-sys-color-on-secondary-container);
        opacity: 0.85;
      }

      .mono-val {
        font-family: var(--tm-font-mono);
        font-variant-numeric: tabular-nums;
      }

      .cache-val {
        color: var(--tm-status-ok);
        font-weight: 600;
      }

      .ttft-val {
        color: var(--tm-status-warn);
      }

      .tps-val {
        color: var(--tm-chart-1);
      }

      .empty-state {
        padding: 28px 16px;
        text-align: center;
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant);
      }

      @container (width < 560px) {
        .search-field {
          width: 100%;
        }

        .session-cell {
          max-width: none;
        }
      }
    `,
  ];

  @state() private sessions: RecentSession[] =
    telemetryStore.data?.recent_sessions ?? [];
  @state() private currentConvoId: string | null = this.resolveCurrentConvoId();
  @state() private searchQuery = '';

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

  private resolveCurrentConvoId(): string | null {
    const data = telemetryStore.data;
    if (data?.selected_session?.convo_id) {
      return data.selected_session.convo_id;
    }
    if (telemetryStore.settings.sessionMode === 'pinned') {
      return telemetryStore.settings.pinnedConvoId;
    }
    return data?.auto_latest_id ?? null;
  }

  private syncFromStore(): void {
    this.sessions = telemetryStore.data?.recent_sessions ?? [];
    this.currentConvoId = this.resolveCurrentConvoId();
  }

  private handleSearchInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.searchQuery = target.value ?? '';
  }

  private clearSearch(): void {
    this.searchQuery = '';
  }

  private selectSession(convoId: string): void {
    telemetryStore.pinSession(convoId);
    telemetryStore.navigate('home');
  }

  private handleRowKeydown(e: KeyboardEvent, convoId: string): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.selectSession(convoId);
    }
  }

  private getFilteredSessions(): RecentSession[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.sessions;
    return this.sessions.filter(
      (s) =>
        (s.title || '').toLowerCase().includes(q) ||
        (s.model || '').toLowerCase().includes(q) ||
        (s.project || '').toLowerCase().includes(q) ||
        (s.convo_id || '').toLowerCase().includes(q)
    );
  }

  render() {
    const filtered = this.getFilteredSessions();

    return html`
      <md-outlined-card class="sessions-card">
        <div class="card-head">
          <div class="title-group">
            ${renderMdIcon('history')}
            <h2 class="card-title">最近会话 (点击切入监控)</h2>
            <span class="count-pill">
              ${this.searchQuery.trim()
                ? `${filtered.length} / ${this.sessions.length}`
                : `${this.sessions.length}`}
            </span>
          </div>

          <md-outlined-text-field
            class="search-field"
            type="search"
            placeholder="筛选标题、模型或项目..."
            aria-label="筛选历史会话"
            .value=${this.searchQuery}
            @input=${this.handleSearchInput}
          >
            ${renderMdIcon('search', 'leading-icon')}
            ${this.searchQuery
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

        ${filtered.length === 0
          ? html`
              <div class="empty-state">
                ${this.sessions.length === 0
                  ? '暂无会话记录'
                  : '没有匹配的会话记录'}
              </div>
            `
          : html`
              <div
                class="tm-table-wrap"
                tabindex="0"
                role="region"
                aria-label="历史会话列表"
              >
                <table class="tm-table">
                  <thead>
                    <tr>
                      <th scope="col">会话 / 项目</th>
                      <th scope="col">最近活跃</th>
                      <th scope="col">模型</th>
                      <th scope="col">步数</th>
                      <th scope="col">Tokens</th>
                      <th scope="col">Ctx %</th>
                      <th scope="col">Cache %</th>
                      <th scope="col">TTFT</th>
                      <th scope="col">Stream TPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filtered.map((s) => {
                      const isCurrent = s.convo_id === this.currentConvoId;
                      const dotClass = s.is_active
                        ? 'active'
                        : s.is_recent
                          ? 'recent'
                          : '';
                      const ctxStr =
                        s.ctx_used_pct != null
                          ? `${Math.round(s.ctx_used_pct)}%`
                          : '-';
                      const activeStr = (
                        s.last_active_at ||
                        s.created_at ||
                        ''
                      ).slice(5, 16);

                      return html`
                        <tr
                          class="clickable ${isCurrent ? 'is-current' : ''}"
                          tabindex="0"
                          aria-current=${isCurrent ? 'true' : 'false'}
                          title=${`${s.title || s.convo_id}\n${
                            s.project || ''
                          } (${s.convo_id})`}
                          @click=${() => this.selectSession(s.convo_id)}
                          @keydown=${(e: KeyboardEvent) =>
                            this.handleRowKeydown(e, s.convo_id)}
                        >
                          <th scope="row" class="session-cell">
                            <md-ripple></md-ripple>
                            <div class="session-main">
                              <span
                                class="status-dot ${dotClass}"
                                aria-hidden="true"
                              ></span>
                              <span class="session-title">
                                ${s.title || s.convo_id}
                              </span>
                              ${isCurrent
                                ? html`<span class="current-badge">当前</span>`
                                : nothing}
                            </div>
                            ${s.project
                              ? html`<div class="session-project">${s.project}</div>`
                              : nothing}
                          </th>
                          <td data-label="最近活跃" class="mono-val">
                            ${activeStr || '-'}
                          </td>
                          <td data-label="模型">${shortModel(s.model)}</td>
                          <td data-label="步数" class="mono-val">
                            ${fmtNum(s.turn_count)}
                          </td>
                          <td data-label="Tokens" class="mono-val">
                            ${fmtCompact(s.total_tokens)}
                          </td>
                          <td
                            data-label="Ctx %"
                            class="mono-val"
                            style="color:${isCurrent
                              ? 'inherit'
                              : ctxToneVar(s.ctx_used_pct)};font-weight:600;"
                          >
                            ${ctxStr}
                          </td>
                          <td
                            data-label="Cache %"
                            class="mono-val ${isCurrent ? '' : 'cache-val'}"
                          >
                            ${fmtPct(s.cache_hit_rate_pct)}
                          </td>
                          <td
                            data-label="TTFT"
                            class="mono-val ${isCurrent ? '' : 'ttft-val'}"
                          >
                            ${fmtSec(s.avg_ttft_sec)}
                          </td>
                          <td
                            data-label="Stream TPS"
                            class="mono-val ${isCurrent ? '' : 'tps-val'}"
                          >
                            ${fmtTps(s.avg_stream_tps)}
                          </td>
                        </tr>
                      `;
                    })}
                  </tbody>
                </table>
              </div>
            `}
      </md-outlined-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'recent-sessions-page': RecentSessionsPage;
  }
}
