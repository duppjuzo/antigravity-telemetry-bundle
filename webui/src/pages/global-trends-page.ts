import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  chartStyles,
  renderHeatmapGrid,
  renderHourlyBars,
} from '../components/charts';
import { telemetryStore } from '../state/store';
import type {
  AllDailyEntry,
  DailyEntry,
  GlobalRange,
  StatsResponse,
} from '../types/telemetry';
import {
  fmtCompact,
  fmtNum,
  fmtPct,
  fmtSec,
  fmtTps,
  renderMdIcon,
} from '../utils/format';

const GLOBAL_RANGES: ReadonlyArray<{ key: GlobalRange; label: string }> = [
  { key: 'since18', label: '18:00+' },
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: 'all', label: 'All' },
];

const DEFAULT_HEATMAP_HINT = '悬停查看每日明细';

@customElement('global-trends-page')
export class GlobalTrendsPage extends LitElement {
  static styles = [
    chartStyles,
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

      .trend-card {
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

      .card-title-row {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .card-title-row md-icon {
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

      .sub-title {
        margin: 0;
        font-size: 13.5px;
        font-weight: 700;
        color: var(--md-sys-color-on-surface);
      }

      .card-meta {
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
        font-variant-numeric: tabular-nums;
      }

      .range-chips {
        --md-filter-chip-container-height: 30px;
        --md-filter-chip-label-text-size: 12px;
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }

      .kpi-tile {
        background: var(--md-sys-color-surface-container);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: var(--tm-radius-sm, 12px);
        padding: 10px 12px;
        min-width: 0;
      }

      .kpi-label {
        font-size: 11.5px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface-variant);
        margin-bottom: 4px;
      }

      .kpi-value {
        font-size: 18px;
        font-weight: 700;
        line-height: 1.25;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .kpi-value.ok {
        color: var(--tm-status-ok);
      }

      .kpi-value.accent {
        color: var(--tm-chart-1);
      }

      .kpi-value.warn {
        color: var(--tm-status-warn);
      }

      .kpi-sub {
        margin-top: 4px;
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
        font-variant-numeric: tabular-nums;
        line-height: 1.35;
      }

      .chips-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 12px;
      }

      .tonal-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px;
        border-radius: var(--tm-radius-xs, 8px);
        font-size: 11.5px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      .tonal-chip.tool {
        background: var(--md-sys-color-tertiary-container);
        color: var(--md-sys-color-on-tertiary-container);
      }

      .legend-row {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
      }

      .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 11.5px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .legend-swatch {
        width: 9px;
        height: 9px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .daily-bars-scroll {
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .daily-bars {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        height: 132px;
        padding-top: 8px;
        min-width: max-content;
      }

      .bar-col {
        flex: 1 0 20px;
        min-width: 20px;
        max-width: 38px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
        gap: 4px;
        padding: 2px 1px;
        border-radius: 6px;
        transition: background-color 0.15s ease;
        cursor: default;
      }

      .bar-col:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .bar-track {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: flex-end;
        min-height: 0;
      }

      .bar-stack {
        width: 100%;
        display: flex;
        flex-direction: column-reverse;
        border-radius: 4px 4px 1px 1px;
        overflow: hidden;
        min-height: 4px;
        background: var(--md-sys-color-surface-container-highest);
      }

      .bar-seg {
        width: 100%;
      }

      .bar-label {
        font-family: var(--tm-font-mono);
        font-size: 9.5px;
        line-height: 1;
        color: var(--md-sys-color-on-surface-variant);
        white-space: nowrap;
      }

      .section-divider {
        margin: 14px 0;
        --md-divider-color: var(--md-sys-color-outline-variant);
      }

      .heatmap-scroll {
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .heatmap-scroll .tm-hm-grid {
        min-width: max-content;
      }

      .heatmap-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
        margin-top: 8px;
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .hm-scale-box {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }

      .empty-state {
        padding: 20px 12px;
        text-align: center;
        font-size: 12.5px;
        color: var(--md-sys-color-on-surface-variant);
      }

      @container (width < 720px) {
        .kpi-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @container (width < 320px) {
        .kpi-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  @state() private data: StatsResponse | null = telemetryStore.data;
  @state() private globalRange: GlobalRange = telemetryStore.globalRange;
  @state() private heatmapHoverText = DEFAULT_HEATMAP_HINT;

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
    this.data = telemetryStore.data;
    this.globalRange = telemetryStore.globalRange;
  }

  private handleRangeClick(e: Event, range: GlobalRange): void {
    e.preventDefault();
    telemetryStore.setGlobalRange(range);
  }

  private handleHeatmapHover(info: {
    date: string;
    entry: AllDailyEntry | null;
  }): void {
    this.heatmapHoverText = info.entry
      ? `${info.date}: ${fmtCompact(info.entry.total)} tok · ${fmtNum(
          info.entry.turns
        )} turns`
      : `${info.date}: 0 tokens`;
  }

  private renderDailyBars(daily: DailyEntry[]) {
    const slice = daily.slice(-24);
    if (!slice.length) {
      return html`<div class="empty-state">暂无每日用量数据</div>`;
    }
    const maxDaily = Math.max(1, ...slice.map((d) => d.total || 0));

    return html`
      <div class="daily-bars-scroll">
        <div class="daily-bars" role="img" aria-label="每日用量趋势 (近 24 天)">
          ${slice.map((d) => {
            const total = d.total || 0;
            const heightPct = Math.max(4, Math.round((total / maxDaily) * 100));
            const denom = Math.max(1, total);
            const cachedPct = (((d.cached || 0) / denom) * 100).toFixed(1);
            const inputPct = (((d.input || 0) / denom) * 100).toFixed(1);
            const outputPct = (((d.output || 0) / denom) * 100).toFixed(1);
            const tooltip = `${d.date}\nTokens: ${fmtNum(total)} (Cache ${
              d.cache_hit_rate_pct
            }%)\nTTFT: ${fmtSec(d.avg_ttft_sec)} | Stream: ${fmtTps(
              d.avg_stream_tps
            )}`;

            return html`
              <div class="bar-col" title=${tooltip}>
                <div class="bar-track">
                  <div class="bar-stack" style="height:${heightPct}%;">
                    <div
                      class="bar-seg"
                      style="height:${cachedPct}%;background:var(--tm-chart-0);"
                    ></div>
                    <div
                      class="bar-seg"
                      style="height:${inputPct}%;background:var(--tm-chart-1);"
                    ></div>
                    <div
                      class="bar-seg"
                      style="height:${outputPct}%;background:var(--tm-chart-2);"
                    ></div>
                  </div>
                </div>
                <span class="bar-label">${d.date.slice(5)}</span>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  render() {
    const data = this.data;
    const s = data?.summary;
    const c = data?.costs;
    const st = data?.streaks;
    const surfaces = Object.entries(data?.surfaces ?? {});
    const topTools = (data?.top_tools ?? []).slice(0, 10);

    return html`
      <div class="page-stack">
        <!-- Card 1: 全局趋势与历史汇总 -->
        <md-outlined-card class="trend-card">
          <div class="card-head">
            <div class="card-title-row">
              ${renderMdIcon('insights')}
              <h2 class="card-title">全局趋势与历史汇总</h2>
            </div>

            <md-chip-set class="range-chips" aria-label="统计时间范围">
              ${GLOBAL_RANGES.map(
                (r) => html`
                  <md-filter-chip
                    .label=${r.label}
                    .selected=${this.globalRange === r.key}
                    @click=${(e: Event) => this.handleRangeClick(e, r.key)}
                  ></md-filter-chip>
                `
              )}
            </md-chip-set>
          </div>

          <div class="kpi-grid">
            <div class="kpi-tile">
              <div class="kpi-label">总 Token</div>
              <div class="kpi-value">${fmtCompact(s?.total_tokens)}</div>
              <div class="kpi-sub">
                ${fmtNum(s?.total_turns)} turns · ${fmtNum(s?.total_sessions)} sess
              </div>
            </div>

            <div class="kpi-tile">
              <div class="kpi-label">缓存命中率</div>
              <div class="kpi-value ok">${fmtPct(s?.cache_hit_rate_pct)}</div>
              <div class="kpi-sub">
                节省 $${(c?.dollars_saved ?? 0).toFixed(2)} (-${(
                  c?.savings_pct ?? 0
                ).toFixed(1)}%)
              </div>
            </div>

            <div class="kpi-tile">
              <div class="kpi-label">TTFT / Stream</div>
              <div class="kpi-value accent">
                ${fmtSec(s?.avg_ttft_sec)} · ${fmtTps(s?.avg_stream_tps)}
              </div>
              <div class="kpi-sub">
                Peak ${fmtTps(s?.peak_stream_tps)} · E2E ${fmtTps(s?.avg_e2e_tps)}
              </div>
            </div>

            <div class="kpi-tile">
              <div class="kpi-label">连续活跃</div>
              <div class="kpi-value warn">${st?.current_streak ?? 0} 天</div>
              <div class="kpi-sub">
                最高 ${st?.longest_streak ?? 0} 天 · 工具
                ${s?.tool_success_rate_pct ?? 100}%
              </div>
            </div>
          </div>

          ${surfaces.length > 0
            ? html`
                <div class="chips-row" aria-label="来源端分布">
                  ${surfaces.map(
                    ([surf, info]) => html`
                      <span class="tonal-chip">
                        ${surf}: ${fmtNum(info.sessions)} sess (${fmtCompact(info.total)})
                      </span>
                    `
                  )}
                </div>
              `
            : nothing}
        </md-outlined-card>

        <!-- Card 2: 每日用量趋势 (近 24 天) + 近 20 周活动热力图 -->
        <md-outlined-card class="trend-card">
          <div class="card-head">
            <div class="card-title-row">
              ${renderMdIcon('trending_up')}
              <h2 class="card-title">每日用量趋势 (近 24 天)</h2>
            </div>

            <div class="legend-row" aria-label="图例">
              <span class="legend-item">
                <span
                  class="legend-swatch"
                  style="background:var(--tm-chart-0);"
                ></span>
                Cached
              </span>
              <span class="legend-item">
                <span
                  class="legend-swatch"
                  style="background:var(--tm-chart-1);"
                ></span>
                Fresh In
              </span>
              <span class="legend-item">
                <span
                  class="legend-swatch"
                  style="background:var(--tm-chart-2);"
                ></span>
                Output
              </span>
            </div>
          </div>

          ${this.renderDailyBars(data?.daily ?? [])}

          <md-divider class="section-divider"></md-divider>

          <div class="card-head" style="margin-bottom:8px;">
            <h3 class="sub-title">近 20 周活动热力图</h3>
            <span class="card-meta">${this.heatmapHoverText}</span>
          </div>

          <div class="heatmap-scroll">
            ${renderHeatmapGrid(data?.all_daily ?? [], 140, (info) =>
              this.handleHeatmapHover(info)
            )}
          </div>

          <div class="heatmap-footer" aria-hidden="true">
            <span>少</span>
            <span class="hm-scale-box" style="background:var(--tm-hm-0);"></span>
            <span class="hm-scale-box" style="background:var(--tm-hm-1);"></span>
            <span class="hm-scale-box" style="background:var(--tm-hm-2);"></span>
            <span class="hm-scale-box" style="background:var(--tm-hm-3);"></span>
            <span class="hm-scale-box" style="background:var(--tm-hm-4);"></span>
            <span>多</span>
          </div>
        </md-outlined-card>

        <!-- Card 3: 24 小时节律 & 高频工具 -->
        <md-outlined-card class="trend-card">
          <div class="card-head">
            <div class="card-title-row">
              ${renderMdIcon('build')}
              <h2 class="card-title">24 小时节律 &amp; 高频工具</h2>
            </div>
            <span class="card-meta">按本地活跃时段分布</span>
          </div>

          ${renderHourlyBars(data?.hourly ?? [], 92)}

          <div class="chips-row" aria-label="高频工具 Top 10">
            ${topTools.length > 0
              ? topTools.map(
                  (t) => html`
                    <span class="tonal-chip tool">
                      ${t.name}: ${fmtNum(t.count)}
                    </span>
                  `
                )
              : html`<span class="card-meta">暂无工具调用记录</span>`}
          </div>
        </md-outlined-card>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'global-trends-page': GlobalTrendsPage;
  }
}
