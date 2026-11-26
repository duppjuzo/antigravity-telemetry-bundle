import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { tableStyles } from '../components/data-table';
import { telemetryStore } from '../state/store';
import type { GlobalRange, ModelEntry, ModelScope } from '../types/telemetry';
import {
  fmtCompact,
  fmtNum,
  fmtPct,
  fmtSec,
  fmtTps,
} from '../utils/format';

const RANGE_OPTIONS: ReadonlyArray<{ key: GlobalRange; label: string }> = [
  { key: 'since18', label: '18:00+' },
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: 'all', label: 'All' },
];

@customElement('models-page')
export class ModelsPage extends LitElement {
  static styles = [
    tableStyles,
    css`
      :host {
        display: block;
        container-type: inline-size;
      }

      .card {
        display: block;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        --md-elevated-card-container-shape: var(--tm-radius-md, 16px);
        --md-elevated-card-container-color: var(
          --md-sys-color-surface-container-low
        );
      }

      .card-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px 12px;
        margin-bottom: 12px;
      }

      .card-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.3;
        color: var(--md-sys-color-on-surface);
      }

      .scope-set {
        flex-shrink: 0;
      }

      .range-chips {
        margin-bottom: 12px;
      }

      .mono-cell {
        font-family: var(--tm-font-mono);
        white-space: nowrap;
      }

      .model-name {
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
        word-break: break-word;
      }

      .empty-box {
        padding: 28px 16px;
        text-align: center;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-surface-container);
        color: var(--md-sys-color-on-surface-variant);
        font-size: 13px;
      }
    `,
  ];

  @state() private modelScope: ModelScope = telemetryStore.modelScope;
  @state() private globalRange: GlobalRange = telemetryStore.globalRange;
  @state() private sessionModels: ModelEntry[] =
    telemetryStore.data?.selected_session?.models_list ?? [];
  @state() private globalModels: ModelEntry[] =
    telemetryStore.data?.models_list ?? [];

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
    this.modelScope = telemetryStore.modelScope;
    this.globalRange = telemetryStore.globalRange;
    this.sessionModels =
      telemetryStore.data?.selected_session?.models_list ?? [];
    this.globalModels = telemetryStore.data?.models_list ?? [];
  }

  private handleScopeSelection(e: CustomEvent<{ index: number }>): void {
    const idx = e.detail?.index;
    if (idx === 0) {
      telemetryStore.setModelScope('session');
    } else if (idx === 1) {
      telemetryStore.setModelScope('global');
    }
  }

  private handleRangeClick(e: Event, range: GlobalRange): void {
    if (this.globalRange === range) {
      e.preventDefault();
      return;
    }
    telemetryStore.setGlobalRange(range);
  }

  private renderModelRow(m: ModelEntry) {
    return html`
      <tr>
        <th scope="row" class="model-name">${m.name}</th>
        <td data-label="会话" class="mono-cell">${fmtNum(m.sessions)}</td>
        <td data-label="步数" class="mono-cell">${fmtNum(m.turns)}</td>
        <td data-label="Fresh In" class="mono-cell">
          ${fmtCompact(m.input)}
        </td>
        <td data-label="Cached" class="mono-cell">
          ${fmtCompact(m.cached)}
        </td>
        <td data-label="Output" class="mono-cell">
          ${fmtCompact(m.output)}
        </td>
        <td data-label="Thinking" class="mono-cell">
          ${fmtCompact(m.thinking)}
        </td>
        <td
          data-label="Cache %"
          class="mono-cell"
          style="color:var(--tm-status-ok);font-weight:600;"
        >
          ${fmtPct(m.cache_hit_rate_pct)}
        </td>
        <td
          data-label="Avg TTFT"
          class="mono-cell"
          style="color:var(--tm-status-warn);"
        >
          ${fmtSec(m.avg_ttft_sec)}
        </td>
        <td
          data-label="Stream TPS"
          class="mono-cell"
          style="color:var(--tm-chart-0);"
        >
          ${fmtTps(m.avg_stream_tps)}
        </td>
        <td data-label="E2E TPS" class="mono-cell">
          ${fmtTps(m.avg_e2e_tps)}
        </td>
      </tr>
    `;
  }

  render() {
    const models =
      this.modelScope === 'session' ? this.sessionModels : this.globalModels;

    return html`
      <md-elevated-card class="card">
        <div class="card-head">
          <h2 class="card-title">分模型统计 (Usage &amp; Speed)</h2>
          <md-outlined-segmented-button-set
            class="scope-set"
            aria-label="模型统计作用域"
            @segmented-button-set-selection=${this.handleScopeSelection}
          >
            <md-outlined-segmented-button
              label="当前会话"
              .selected=${this.modelScope === 'session'}
            ></md-outlined-segmented-button>
            <md-outlined-segmented-button
              label="全局统计"
              .selected=${this.modelScope === 'global'}
            ></md-outlined-segmented-button>
          </md-outlined-segmented-button-set>
        </div>

        ${this.modelScope === 'global'
          ? html`
              <md-chip-set class="range-chips" aria-label="统计时间范围">
                ${RANGE_OPTIONS.map(
                  (opt) => html`
                    <md-filter-chip
                      label=${opt.label}
                      .selected=${this.globalRange === opt.key}
                      @click=${(e: Event) => this.handleRangeClick(e, opt.key)}
                    ></md-filter-chip>
                  `
                )}
              </md-chip-set>
            `
          : nothing}
        ${models.length > 0
          ? html`
              <div
                class="tm-table-wrap"
                tabindex="0"
                role="region"
                aria-label="分模型性能统计表"
              >
                <table class="tm-table">
                  <thead>
                    <tr>
                      <th scope="col">模型</th>
                      <th scope="col">会话</th>
                      <th scope="col">步数</th>
                      <th scope="col">Fresh In</th>
                      <th scope="col">Cached</th>
                      <th scope="col">Output</th>
                      <th scope="col">Thinking</th>
                      <th scope="col">Cache %</th>
                      <th scope="col">Avg TTFT</th>
                      <th scope="col">Stream TPS</th>
                      <th scope="col">E2E TPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${models.map((m) => this.renderModelRow(m))}
                  </tbody>
                </table>
              </div>
            `
          : html`<div class="empty-box">暂无模型统计数据</div>`}
      </md-elevated-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'models-page': ModelsPage;
  }
}
