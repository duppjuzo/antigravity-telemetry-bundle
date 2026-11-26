import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { chartStyles, renderWaterfallBar } from '../components/charts';
import { tableStyles } from '../components/data-table';
import { telemetryStore } from '../state/store';
import type { SelectedSession, StepDetail } from '../types/telemetry';
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

@customElement('steps-page')
export class StepsPage extends LitElement {
  static styles = [
    chartStyles,
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
        gap: 8px 12px;
        margin-bottom: 14px;
      }

      .card-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.3;
        color: var(--md-sys-color-on-surface);
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .head-actions {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      .card-meta {
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
        font-variant-numeric: tabular-nums;
      }

      .wf-cell {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
      }

      .wf-dur {
        font-family: var(--tm-font-mono);
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .mono-cell {
        font-family: var(--tm-font-mono);
        white-space: nowrap;
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

  @state() private selectedSession: SelectedSession | null =
    telemetryStore.data?.selected_session ?? null;
  @state() private stepsDesc = telemetryStore.stepsDesc;

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
    this.selectedSession = telemetryStore.data?.selected_session ?? null;
    this.stepsDesc = telemetryStore.stepsDesc;
  }

  private renderStepRow(st: StepDetail, maxDur: number) {
    const ctxText = st.ctx_pct != null ? `${st.ctx_pct.toFixed(1)}%` : '-';

    return html`
      <tr>
        <th scope="row" class="mono-cell">#${st.idx}</th>
        <td data-label="模型">${shortModel(st.model)}</td>
        <td data-label="时序图">
          <span class="wf-cell">
            ${renderWaterfallBar(st.ttft_sec, st.stream_sec, maxDur)}
            <span class="wf-dur">${fmtSec(st.e2e_sec)}</span>
          </span>
        </td>
        <td
          data-label="TTFT"
          class="mono-cell"
          style="color:var(--tm-status-warn);"
        >
          ${fmtSec(st.ttft_sec)}
        </td>
        <td
          data-label="Stream TPS"
          class="mono-cell"
          style="color:var(--tm-chart-0);"
        >
          ${fmtTps(st.stream_tps)}
        </td>
        <td data-label="E2E TPS" class="mono-cell">
          ${fmtTps(st.e2e_tps)}
        </td>
        <td data-label="思考耗时" class="mono-cell">
          ${fmtSec(st.think_sec)}
        </td>
        <td
          data-label="Cache %"
          class="mono-cell"
          style="color:var(--tm-status-ok);"
        >
          ${fmtPct(st.cache_hit_rate_pct)}
        </td>
        <td data-label="Fresh In" class="mono-cell">
          ${fmtNum(st.input_tokens)}
        </td>
        <td data-label="Cached" class="mono-cell">
          ${fmtNum(st.cached_tokens)}
        </td>
        <td data-label="Out / Think" class="mono-cell">
          ${fmtCompact(st.output_tokens)} / ${fmtCompact(st.thinking_tokens)}
        </td>
        <td
          data-label="Ctx %"
          class="mono-cell"
          style="color:${ctxToneVar(st.ctx_pct)};font-weight:600;"
        >
          ${ctxText}
        </td>
      </tr>
    `;
  }

  render() {
    const sel = this.selectedSession;
    const rawSteps = sel?.steps_detail ?? [];
    const hasSteps = rawSteps.length > 0;
    const titleSuffix = sel
      ? ` · ${(sel.title || sel.convo_id).slice(0, 34)}`
      : '';
    const title = hasSteps ? `单步瀑布流${titleSuffix}` : '单步瀑布流';
    const meta = hasSteps ? `${rawSteps.length} 步` : '0 steps';

    const maxDur = hasSteps
      ? Math.max(
          0.5,
          ...rawSteps.map((s) => (s.ttft_sec || 0) + (s.stream_sec || 0))
        )
      : 0.5;
    const orderedSteps = this.stepsDesc ? [...rawSteps].reverse() : rawSteps;

    return html`
      <md-elevated-card class="card">
        <div class="card-head">
          <h2 class="card-title" title=${title}>${title}</h2>
          <div class="head-actions">
            <span class="card-meta">${meta}</span>
            <md-filled-tonal-button
              @click=${() => telemetryStore.toggleStepsOrder()}
            >
              ${renderMdIcon(
                this.stepsDesc ? 'arrow_downward' : 'arrow_upward',
                'icon'
              )}
              ${this.stepsDesc ? '最新在前' : '按时间正序'}
            </md-filled-tonal-button>
          </div>
        </div>

        ${hasSteps
          ? html`
              <div
                class="tm-table-wrap"
                tabindex="0"
                role="region"
                aria-label="单步性能瀑布表"
              >
                <table class="tm-table">
                  <thead>
                    <tr>
                      <th scope="col">Step</th>
                      <th scope="col">模型</th>
                      <th scope="col">时序图</th>
                      <th scope="col">TTFT</th>
                      <th scope="col">Stream TPS</th>
                      <th scope="col">E2E TPS</th>
                      <th scope="col">思考耗时</th>
                      <th scope="col">Cache %</th>
                      <th scope="col">Fresh In</th>
                      <th scope="col">Cached</th>
                      <th scope="col">Out / Think</th>
                      <th scope="col">Ctx %</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderedSteps.map((st) => this.renderStepRow(st, maxDur))}
                  </tbody>
                </table>
              </div>
            `
          : html`<div class="empty-box">暂无单步性能数据</div>`}
      </md-elevated-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'steps-page': StepsPage;
  }
}
