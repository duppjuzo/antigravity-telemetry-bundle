import { css, html, nothing, type TemplateResult } from 'lit';
import {
  renderContextRing,
  renderHeatmapGrid,
  renderHourlyBars,
  renderPieChart,
  renderWaterfallBar,
  type PieSlice,
} from '../../components/charts';
import type { TelemetryStore } from '../../state/store';
import type {
  GlobalTrendsCardMode,
  HomeCardId,
  HomeScope,
  HourlyEntry,
  PageId,
  StatsResponse,
} from '../../types/telemetry';
import {
  fmtCompact,
  fmtNum,
  fmtPct,
  fmtSec,
  fmtTps,
  renderMdIcon,
  shortModel,
  type IconName,
} from '../../utils/format';

export interface HomeCardContext {
  store: TelemetryStore;
  data: StatsResponse | null;
  scope: HomeScope;
  todayHourly: HourlyEntry[];
  globalTrendsMode: GlobalTrendsCardMode;
  editMode: boolean;
}

export interface HomeCardDefinition {
  id: HomeCardId;
  title: string;
  description: string;
  icon: IconName;
  supportedScopes: readonly HomeScope[];
  targetPage?: PageId;
  renderHeaderActions?: (ctx: HomeCardContext) => TemplateResult | typeof nothing;
  renderContent: (ctx: HomeCardContext) => TemplateResult;
}

export const homeCardStyles = css`
  /* Default card: 3 core metrics */
  .metrics-trio {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .metric-tile {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 10px;
    border-radius: var(--tm-radius-sm, 12px);
    background: var(--md-sys-color-surface-container-low);
    border: 1px solid var(--md-sys-color-outline-variant);
    min-width: 0;
  }

  .metric-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .metric-value {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--md-sys-color-on-surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .metric-value.primary {
    color: var(--md-sys-color-primary);
  }

  /* Split visual + key-value rows (context, step, models) */
  .split-card-body {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .split-visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .visual-caption {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
  }

  .kv-rows {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .kv-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
  }

  .kv-key {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
    flex-shrink: 0;
  }

  .kv-val {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 13px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  /* Models legend */
  .model-legend {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .legend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
  }

  .legend-left {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    flex: 1;
  }

  .legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .legend-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .legend-turns {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface-variant);
    flex-shrink: 0;
  }

  /* Global trends card */
  .trends-header-actions {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .mode-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: var(--tm-radius-full, 9999px);
    font-size: 11px;
    font-weight: 600;
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    white-space: nowrap;
  }

  .trends-today-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 8px;
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
  }

  .trends-month-layout {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .trends-hm-box {
    flex-shrink: 0;
  }

  .trends-hm-box .tm-hm-grid {
    width: max-content;
    grid-auto-columns: 14px;
  }

  .trends-hm-legend {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    font-size: 10px;
    color: var(--md-sys-color-on-surface-variant);
  }

  .hm-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }

  .hm-swatch.l0 {
    background: var(--tm-hm-0);
  }
  .hm-swatch.l1 {
    background: var(--tm-hm-1);
  }
  .hm-swatch.l2 {
    background: var(--tm-hm-2);
  }
  .hm-swatch.l3 {
    background: var(--tm-hm-3);
  }
  .hm-swatch.l4 {
    background: var(--tm-hm-4);
  }

  .trends-data-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .compact-stat {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 10px;
    border-radius: var(--tm-radius-sm, 12px);
    background: var(--md-sys-color-surface-container-low);
    border: 1px solid var(--md-sys-color-outline-variant);
    min-width: 0;
  }

  .compact-stat-label {
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .compact-stat-val {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 14px;
    font-weight: 700;
    color: var(--md-sys-color-on-surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Extra stats & tools */
  .tools-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  }

  .tools-chips md-assist-chip {
    --md-assist-chip-container-height: 28px;
    --md-assist-chip-label-text-size: 12px;
  }

  .empty-hint {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
    padding: 6px 0;
  }

  @container (width < 360px) {
    .metric-tile {
      padding: 10px 8px;
    }

    .metric-value {
      font-size: 17px;
    }

    .split-card-body {
      gap: 12px;
    }
  }
`;

const TRENDS_MODE_LABEL: Record<GlobalTrendsCardMode, string> = {
  today: '当日',
  month: '本月',
  data: '数据',
};

function stopInteractionBubble(e: Event): void {
  e.stopPropagation();
}

function renderDefaultCard(ctx: HomeCardContext): TemplateResult {
  const { data, scope } = ctx;
  let cacheHitPct: number | null | undefined;
  let tps: number | null | undefined;
  let ttftSec: number | null | undefined;

  if (scope === 'latest_step') {
    const ls = data?.selected_session?.latest_step;
    cacheHitPct = ls?.cache_hit_rate_pct;
    tps = ls?.stream_tps;
    ttftSec = ls?.ttft_sec;
  } else if (scope === 'session') {
    const s = data?.selected_session;
    cacheHitPct = s?.cache_hit_rate_pct;
    tps = s?.avg_stream_tps;
    ttftSec = s?.avg_ttft_sec;
  } else {
    const sum = data?.summary;
    cacheHitPct = sum?.cache_hit_rate_pct;
    tps = sum?.avg_stream_tps;
    ttftSec = sum?.avg_ttft_sec;
  }

  return html`
    <div class="metrics-trio">
      <div class="metric-tile">
        <span class="metric-label">缓内</span>
        <span class="metric-value primary">${fmtPct(cacheHitPct)}</span>
      </div>
      <div class="metric-tile">
        <span class="metric-label">速率</span>
        <span class="metric-value">${fmtTps(tps)}</span>
      </div>
      <div class="metric-tile">
        <span class="metric-label">首字</span>
        <span class="metric-value">${fmtSec(ttftSec)}</span>
      </div>
    </div>
  `;
}

function renderContextCard(ctx: HomeCardContext): TemplateResult {
  const ctxInfo = ctx.data?.selected_session?.context;

  return html`
    <div class="split-card-body">
      <div class="split-visual">
        ${renderContextRing(ctxInfo?.used_pct, 68, 5)}
      </div>
      <div class="kv-rows">
        <div class="kv-row">
          <span class="kv-key">已用</span>
          <span class="kv-val" title=${fmtNum(ctxInfo?.used_tokens)}>
            ${fmtCompact(ctxInfo?.used_tokens)}
          </span>
        </div>
        <div class="kv-row">
          <span class="kv-key">空闲</span>
          <span class="kv-val" title=${fmtNum(ctxInfo?.free_tokens)}>
            ${fmtCompact(ctxInfo?.free_tokens)}
          </span>
        </div>
        <div class="kv-row">
          <span class="kv-key">上限</span>
          <span class="kv-val" title=${fmtNum(ctxInfo?.limit_tokens)}>
            ${fmtCompact(ctxInfo?.limit_tokens)}
          </span>
        </div>
      </div>
    </div>
  `;
}

function renderStepCard(ctx: HomeCardContext): TemplateResult {
  const session = ctx.data?.selected_session;
  const ls = session?.latest_step ?? null;
  const steps = session?.steps_detail ?? [];
  const maxDur = Math.max(
    0.1,
    ...steps.map((s) => (s.ttft_sec ?? 0) + (s.stream_sec ?? 0)),
    (ls?.ttft_sec ?? 0) + (ls?.stream_sec ?? 0)
  );

  return html`
    <div class="split-card-body">
      <div class="split-visual">
        ${renderWaterfallBar(ls?.ttft_sec, ls?.stream_sec, maxDur, 88)}
        <span class="visual-caption">
          ${fmtSec(ls?.ttft_sec)} + ${fmtSec(ls?.stream_sec)}
        </span>
      </div>
      <div class="kv-rows">
        <div class="kv-row">
          <span class="kv-key">模型</span>
          <span class="kv-val" title=${ls?.model ?? ''}>
            ${shortModel(ls?.model)}
          </span>
        </div>
        <div class="kv-row">
          <span class="kv-key">新增 Token</span>
          <span class="kv-val" title=${fmtNum(ls?.input_tokens)}>
            ${fmtCompact(ls?.input_tokens)}
          </span>
        </div>
        <div class="kv-row">
          <span class="kv-key">输出 / 思考</span>
          <span
            class="kv-val"
            title="${fmtNum(ls?.output_tokens)} / ${fmtNum(ls?.thinking_tokens)}"
          >
            ${fmtCompact(ls?.output_tokens)} / ${fmtCompact(ls?.thinking_tokens)}
          </span>
        </div>
      </div>
    </div>
  `;
}

function renderModelsCard(ctx: HomeCardContext): TemplateResult {
  const models =
    ctx.scope === 'global'
      ? ctx.data?.models_list ?? []
      : ctx.data?.selected_session?.models_list ?? [];

  const slices: PieSlice[] = models.map((m, idx) => ({
    label: shortModel(m.name),
    value: m.turns,
    colorVar: `var(--tm-chart-${idx % 8})`,
  }));

  return html`
    <div class="split-card-body">
      <div class="split-visual">${renderPieChart(slices, 88)}</div>
      <div class="model-legend">
        ${models.length === 0
          ? html`<div class="empty-hint">暂无模型步数记录</div>`
          : models.slice(0, 5).map(
              (m, idx) => html`
                <div class="legend-row">
                  <div class="legend-left">
                    <span
                      class="legend-swatch"
                      style="background:var(--tm-chart-${idx % 8});"
                    ></span>
                    <span class="legend-name" title=${m.name}>
                      ${shortModel(m.name)}
                    </span>
                  </div>
                  <span class="legend-turns">${fmtNum(m.turns)} 步</span>
                </div>
              `
            )}
        ${models.length > 5
          ? html`<div class="visual-caption">另有 ${models.length - 5} 个模型</div>`
          : nothing}
      </div>
    </div>
  `;
}

function renderGlobalTrendsHeaderActions(ctx: HomeCardContext): TemplateResult {
  const modeLabel = TRENDS_MODE_LABEL[ctx.globalTrendsMode];
  const onCycleClick = (e: Event): void => {
    e.stopPropagation();
    ctx.store.cycleGlobalTrendsCardMode();
  };
  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
    }
  };

  return html`
    <div class="trends-header-actions">
      <span class="mode-badge">${modeLabel}</span>
      <md-icon-button
        aria-label="切换模式"
        title="切换模式"
        @pointerdown=${stopInteractionBubble}
        @mousedown=${stopInteractionBubble}
        @keydown=${onKeyDown}
        @click=${onCycleClick}
      >
        ${renderMdIcon('swap_horiz')}
      </md-icon-button>
    </div>
  `;
}

function renderGlobalTrendsCard(ctx: HomeCardContext): TemplateResult {
  const { globalTrendsMode, todayHourly, data } = ctx;

  if (globalTrendsMode === 'today') {
    const todayTokens = todayHourly.reduce((acc, h) => acc + (h.tokens || 0), 0);
    const todayTurns = todayHourly.reduce((acc, h) => acc + (h.turns || 0), 0);
    return html`
      <div>
        ${renderHourlyBars(todayHourly, 72)}
        <div class="trends-today-meta">
          <span>今日 24 小时活跃</span>
          <span class="tm-mono">
            ${fmtCompact(todayTokens)} tok · ${fmtNum(todayTurns)} 步
          </span>
        </div>
      </div>
    `;
  }

  if (globalTrendsMode === 'month') {
    const allDaily = data?.all_daily ?? [];
    const recent28 = allDaily.slice(-28);
    const activeDays28 = recent28.filter((d) => d.total > 0).length;
    const total28 = recent28.reduce((acc, d) => acc + (d.total || 0), 0);

    return html`
      <div class="trends-month-layout">
        <div class="trends-hm-box">
          ${renderHeatmapGrid(allDaily, 28)}
        </div>
        <div class="kv-rows">
          <div class="kv-row">
            <span class="kv-key">近 28 天活跃</span>
            <span class="kv-val">${activeDays28} 天</span>
          </div>
          <div class="kv-row">
            <span class="kv-key">近 28 天用量</span>
            <span class="kv-val">${fmtCompact(total28)}</span>
          </div>
          <div class="trends-hm-legend" aria-hidden="true">
            <span>少</span>
            <span class="hm-swatch l0"></span>
            <span class="hm-swatch l1"></span>
            <span class="hm-swatch l2"></span>
            <span class="hm-swatch l3"></span>
            <span class="hm-swatch l4"></span>
            <span>多</span>
          </div>
        </div>
      </div>
    `;
  }

  const sum = data?.summary;
  const streak = data?.streaks?.current_streak;
  return html`
    <div class="trends-data-grid">
      <div class="compact-stat">
        <span class="compact-stat-label">总 Token</span>
        <span class="compact-stat-val" title=${fmtNum(sum?.total_tokens)}>
          ${fmtCompact(sum?.total_tokens)}
        </span>
      </div>
      <div class="compact-stat">
        <span class="compact-stat-label">缓存命中</span>
        <span class="compact-stat-val">
          ${fmtPct(sum?.cache_hit_rate_pct)}
        </span>
      </div>
      <div class="compact-stat">
        <span class="compact-stat-label">TTFT / 流式速率</span>
        <span class="compact-stat-val">
          ${fmtSec(sum?.avg_ttft_sec)} / ${fmtTps(sum?.avg_stream_tps)}
        </span>
      </div>
      <div class="compact-stat">
        <span class="compact-stat-label">连续活跃</span>
        <span class="compact-stat-val">
          ${streak == null ? '-' : `${fmtNum(streak)} 天`}
        </span>
      </div>
    </div>
  `;
}

function renderExtraStatsCard(ctx: HomeCardContext): TemplateResult {
  const isGlobal = ctx.scope === 'global';
  const session = ctx.data?.selected_session;
  const summary = ctx.data?.summary;

  const p50 = isGlobal ? summary?.p50_ttft_sec : session?.p50_ttft_sec;
  const p90 = isGlobal ? summary?.p90_ttft_sec : session?.p90_ttft_sec;
  const thinkTokens = isGlobal
    ? summary?.total_thinking_tokens
    : session?.thinking_tokens;
  const totalThinkSec = isGlobal
    ? summary?.total_think_sec
    : session?.total_think_sec;
  const avgThinkSec = isGlobal
    ? summary?.avg_think_sec
    : session?.avg_think_sec;
  const costs = isGlobal ? ctx.data?.costs : session?.costs;

  const savingsText =
    costs && costs.dollars_saved != null
      ? `$${costs.dollars_saved.toFixed(2)} (${fmtPct(costs.savings_pct)})`
      : '-';

  return html`
    <div class="kv-rows">
      <div class="kv-row">
        <span class="kv-key">TTFT P50 / P90</span>
        <span class="kv-val">${fmtSec(p50)} / ${fmtSec(p90)}</span>
      </div>
      <div class="kv-row">
        <span class="kv-key">思考开销</span>
        <span
          class="kv-val"
          title="${fmtNum(thinkTokens)} tokens · 总 ${fmtSec(totalThinkSec)} · 均 ${fmtSec(avgThinkSec)}"
        >
          ${fmtCompact(thinkTokens)} · ${fmtSec(totalThinkSec)} / 均 ${fmtSec(avgThinkSec)}
        </span>
      </div>
      <div class="kv-row">
        <span class="kv-key">缓存节省金额</span>
        <span class="kv-val">${savingsText}</span>
      </div>
    </div>
  `;
}

function renderToolsCard(ctx: HomeCardContext): TemplateResult {
  const isGlobal = ctx.scope === 'global';
  const session = ctx.data?.selected_session;
  const summary = ctx.data?.summary;

  const totalCalls = isGlobal
    ? summary?.total_tool_calls
    : session?.total_tool_calls;
  const successRate = isGlobal
    ? summary?.tool_success_rate_pct
    : session?.tool_success_rate_pct;
  const errors = isGlobal
    ? summary?.total_tool_errors
    : session?.tool_errors;
  const topTools = isGlobal
    ? ctx.data?.top_tools ?? []
    : session?.top_tools ?? [];

  return html`
    <div>
      <div class="metrics-trio">
        <div class="metric-tile">
          <span class="metric-label">调用次数</span>
          <span class="metric-value">${fmtNum(totalCalls)}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">成功率</span>
          <span class="metric-value primary">${fmtPct(successRate)}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">错误数</span>
          <span class="metric-value">${fmtNum(errors)}</span>
        </div>
      </div>
      ${topTools.length > 0
        ? html`
            <div class="tools-chips">
              ${topTools.slice(0, 6).map(
                (t) => html`
                  <md-assist-chip
                    @pointerdown=${stopInteractionBubble}
                    @click=${stopInteractionBubble}
                  >
                    ${t.name} · ${fmtNum(t.count)}
                  </md-assist-chip>
                `
              )}
            </div>
          `
        : html`<div class="empty-hint">暂无工具调用记录</div>`}
    </div>
  `;
}

export const HOME_CARD_REGISTRY: readonly HomeCardDefinition[] = [
  {
    id: 'default',
    title: '核心指标',
    description: '缓内命中率、流式速率与首字延迟',
    icon: 'insights',
    supportedScopes: ['latest_step', 'session', 'global'],
    targetPage: undefined,
    renderContent: renderDefaultCard,
  },
  {
    id: 'context',
    title: '上下文占用',
    description: '当前会话上下文环与已用/空闲/上限 Token',
    icon: 'donut_large',
    supportedScopes: ['latest_step', 'session'],
    targetPage: 'context',
    renderContent: renderContextCard,
  },
  {
    id: 'step',
    title: '单步',
    description: '最新一步耗时瀑布与模型 Token 详情',
    icon: 'waterfall_chart',
    supportedScopes: ['latest_step', 'session'],
    targetPage: 'steps',
    renderContent: renderStepCard,
  },
  {
    id: 'models',
    title: '模型',
    description: '按步数统计的模型分布饼图与图例',
    icon: 'pie_chart',
    supportedScopes: ['session', 'global'],
    targetPage: 'models',
    renderContent: renderModelsCard,
  },
  {
    id: 'global-trends',
    title: '全局趋势',
    description: '当日 24 小时、本月热力与全局摘要切换',
    icon: 'trending_up',
    supportedScopes: ['latest_step', 'session', 'global'],
    targetPage: 'global',
    renderHeaderActions: renderGlobalTrendsHeaderActions,
    renderContent: renderGlobalTrendsCard,
  },
  {
    id: 'extra-stats',
    title: '附加统计信息',
    description: 'TTFT P50/P90、思考开销与缓存节省金额',
    icon: 'auto_awesome',
    supportedScopes: ['session', 'global'],
    targetPage: undefined,
    renderContent: renderExtraStatsCard,
  },
  {
    id: 'tools',
    title: '工具调用',
    description: '工具调用次数、成功率、错误数与高频工具',
    icon: 'build',
    supportedScopes: ['session', 'global'],
    targetPage: undefined,
    renderContent: renderToolsCard,
  },
];

export const HOME_CARD_MAP = new Map<HomeCardId, HomeCardDefinition>(
  HOME_CARD_REGISTRY.map((card) => [card.id, card])
);

export function getHomeCard(id: HomeCardId): HomeCardDefinition | undefined {
  return HOME_CARD_MAP.get(id);
}

export function isCardSupportedInScope(
  card: HomeCardDefinition,
  scope: HomeScope
): boolean {
  return card.supportedScopes.includes(scope);
}

export function getScopeUnavailableMessage(scope: HomeScope): string {
  if (scope === 'global') return '全局模式下，该卡片不可用';
  if (scope === 'latest_step') return '最新一步模式下，该卡片不可用';
  return '';
}
