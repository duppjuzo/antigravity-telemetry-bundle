import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  chartStyles,
  renderContextRing,
  renderStackedBar,
  type StackedSegment,
} from '../components/charts';
import { telemetryStore } from '../state/store';
import type { ContextCategory, SelectedSession } from '../types/telemetry';
import {
  ctxToneVar,
  fmtCompact,
  fmtNum,
  fmtPct,
  renderMdIcon,
} from '../utils/format';

const CATEGORY_COLOR_MAP: Record<string, string> = {
  'Chat Messages': 'var(--tm-chart-0)',
  Tools: 'var(--tm-chart-1)',
  'System Prompt': 'var(--tm-chart-2)',
  Skills: 'var(--tm-chart-3)',
  Subagents: 'var(--tm-chart-4)',
  Rules: 'var(--tm-chart-5)',
  Plugins: 'var(--tm-chart-6)',
  'Mcp Tools': 'var(--tm-chart-7)',
};

function getCategoryColor(name: string, index: number): string {
  return CATEGORY_COLOR_MAP[name] ?? `var(--tm-chart-${index % 8})`;
}

@customElement('context-page')
export class ContextPage extends LitElement {
  static styles = [
    chartStyles,
    css`
      :host {
        display: block;
        container-type: inline-size;
      }

      .page-stack {
        display: flex;
        flex-direction: column;
        gap: 16px;
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
      }

      .card-meta {
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .badges-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 11px;
        font-weight: 600;
        line-height: 1.3;
      }

      .badge.ok {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
      }

      .badge.warn {
        background: var(--md-sys-color-tertiary-container);
        color: var(--md-sys-color-on-tertiary-container);
      }

      .badge.info {
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      .ctx-hero {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 18px;
        margin-bottom: 14px;
      }

      .ring-stack {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      .ring-caption {
        font-size: 11px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface-variant);
        font-variant-numeric: tabular-nums;
      }

      .hero-stats {
        flex: 1;
        min-width: 220px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .mini-kpi {
        padding: 10px 12px;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-surface-container);
        border: 1px solid var(--md-sys-color-outline-variant);
        min-width: 0;
      }

      .mini-kpi-k {
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mini-kpi-v {
        font-family: var(--tm-font-mono);
        font-variant-numeric: tabular-nums;
        font-size: 14px;
        font-weight: 700;
        color: var(--md-sys-color-on-surface);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .stack-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        margin-top: 10px;
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }

      .swatch {
        width: 10px;
        height: 10px;
        border-radius: 3px;
        flex-shrink: 0;
      }

      .cat-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .cat-row {
        border-radius: var(--tm-radius-sm, 12px);
        border: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface-container);
        overflow: hidden;
      }

      .cat-header {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        padding: 12px 14px;
        border: none;
        margin: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
      }

      button.cat-header.interactive {
        cursor: pointer;
        transition: background-color 0.15s ease;
      }

      button.cat-header.interactive:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .cat-top {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 6px 12px;
      }

      .cat-name-group {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .sys-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 7px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 10px;
        font-weight: 600;
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      .item-count {
        font-size: 12px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant);
      }

      .cat-right {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
      }

      .cat-val {
        font-family: var(--tm-font-mono);
        font-variant-numeric: tabular-nums;
        font-size: 12px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .expand-icon {
        display: inline-flex;
        align-items: center;
        color: var(--md-sys-color-on-surface-variant);
        transition: transform 0.2s ease;
        --md-icon-size: 18px;
      }

      .expand-icon.open {
        transform: rotate(180deg);
      }

      .cat-progress {
        width: 100%;
        --md-linear-progress-track-height: 6px;
        --md-linear-progress-active-indicator-height: 6px;
        --md-linear-progress-track-shape: var(--tm-radius-full, 9999px);
        --md-linear-progress-track-color: var(
          --md-sys-color-surface-container-highest
        );
      }

      .cat-items {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px 14px 12px;
        background: var(--md-sys-color-surface-container-low);
      }

      .cat-subitem {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        font-size: 12px;
        padding: 2px 0;
      }

      .cat-subitem-name {
        color: var(--md-sys-color-on-surface);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }

      .cat-subitem-tokens {
        font-family: var(--tm-font-mono);
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant);
        flex-shrink: 0;
      }

      .trunc-note {
        margin-top: 4px;
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .empty-box {
        padding: 24px 16px;
        text-align: center;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-surface-container);
        color: var(--md-sys-color-on-surface-variant);
        font-size: 13px;
      }

      @container (width < 520px) {
        .hero-stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .ctx-hero {
          justify-content: center;
        }
      }

      @container (width < 320px) {
        .hero-stats {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  @state() private selectedSession: SelectedSession | null =
    telemetryStore.data?.selected_session ?? null;

  private openCats = new Set<string>();
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
  }

  private toggleCategory(name: string): void {
    if (this.openCats.has(name)) {
      this.openCats.delete(name);
    } else {
      this.openCats.add(name);
    }
    this.requestUpdate();
  }

  private renderHeroStats(sel: SelectedSession) {
    const ctx = sel.context;
    const stats = [
      {
        label: '已用 Context',
        value: fmtNum(ctx.used_tokens),
        color: ctxToneVar(ctx.used_pct),
      },
      {
        label: '剩余空闲 Free',
        value: fmtNum(ctx.free_tokens),
        color: 'var(--tm-status-ok)',
      },
      {
        label: '模型上限 Limit',
        value: fmtNum(ctx.limit_tokens),
        color: 'var(--md-sys-color-on-surface)',
      },
      {
        label: '最近步 Prompt',
        value: fmtNum(ctx.api_prompt_tokens),
        color: 'var(--tm-chart-0)',
      },
      {
        label: '系统占比 System',
        value: fmtCompact(ctx.system_tokens),
        color: 'var(--tm-chart-1)',
      },
      {
        label: '对话占比 Chat',
        value: fmtCompact(ctx.chat_tokens),
        color: 'var(--md-sys-color-on-surface)',
      },
    ];

    return html`
      <div class="hero-stats">
        ${stats.map(
          (item) => html`
            <div class="mini-kpi">
              <div class="mini-kpi-k">${item.label}</div>
              <div class="mini-kpi-v" style="color:${item.color};">
                ${item.value}
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  private renderCategoryRow(cat: ContextCategory, idx: number) {
    const color = getCategoryColor(cat.name, idx);
    const items = cat.items ?? [];
    const hasItems = items.length > 0;
    const isOpen = hasItems && this.openCats.has(cat.name);
    const progressValue = Math.min(
      1,
      Math.max(0.015, (cat.pct_of_used || 0) / 100)
    );

    const headerBody = html`
      <div class="cat-top">
        <span class="cat-name-group">
          <span class="swatch" style="background:${color};"></span>
          <span>${cat.name}</span>
          ${cat.is_system ? html`<span class="sys-badge">Sys</span>` : nothing}
          ${cat.item_count > 0
            ? html`<span class="item-count">(${cat.item_count})</span>`
            : nothing}
        </span>
        <span class="cat-right">
          <span class="cat-val">
            ${fmtNum(cat.tokens)} · ${cat.pct_of_limit}% 窗口
          </span>
          ${hasItems
            ? html`
                <span class="expand-icon ${isOpen ? 'open' : ''}">
                  ${renderMdIcon('expand_more')}
                </span>
              `
            : nothing}
        </span>
      </div>
      <md-linear-progress
        class="cat-progress"
        style=${`--md-linear-progress-active-indicator-color:${color};`}
        .value=${progressValue}
        aria-label="${cat.name} 占比"
      ></md-linear-progress>
    `;

    return html`
      <div class="cat-row">
        ${hasItems
          ? html`
              <button
                type="button"
                class="cat-header interactive"
                aria-expanded=${isOpen ? 'true' : 'false'}
                @click=${() => this.toggleCategory(cat.name)}
              >
                <md-ripple></md-ripple>
                ${headerBody}
              </button>
            `
          : html`<div class="cat-header">${headerBody}</div>`}
        ${isOpen
          ? html`
              <md-divider></md-divider>
              <div class="cat-items">
                ${items.map(
                  (it) => html`
                    <div class="cat-subitem">
                      <span class="cat-subitem-name" title=${it.name}>
                        ${it.name}
                      </span>
                      <span class="cat-subitem-tokens">
                        ${fmtNum(it.tokens)}
                      </span>
                    </div>
                  `
                )}
                ${cat.item_count > items.length
                  ? html`
                      <div class="trunc-note">
                        ... 共 ${cat.item_count} 项（已按 Token 降序展示前
                        ${items.length} 项）
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  render() {
    const sel = this.selectedSession;
    const ctx = sel?.context ?? null;

    if (!sel || !ctx) {
      return html`
        <div class="page-stack">
          <md-elevated-card class="card">
            <div class="card-head">
              <h2 class="card-title">上下文窗口占用 (Context Window)</h2>
            </div>
            <div class="empty-box">暂无上下文统计</div>
          </md-elevated-card>
        </div>
      `;
    }

    const cats = ctx.categories ?? [];
    const segments: StackedSegment[] = cats
      .filter((c) => c.tokens > 0)
      .map((c, idx) => ({
        label: c.name,
        value: c.tokens,
        colorVar: getCategoryColor(c.name, idx),
      }));

    if (ctx.free_tokens > 0) {
      segments.push({
        label: 'Free Space',
        value: ctx.free_tokens,
        colorVar:
          'color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent)',
      });
    }

    return html`
      <div class="page-stack">
        <md-elevated-card class="card">
          <div class="card-head">
            <h2 class="card-title">上下文窗口占用 (Context Window)</h2>
            <div class="badges-wrap">
              <span
                class="badge ${ctx.source === 'db_native' ? 'ok' : 'warn'}"
              >
                ${ctx.source === 'db_native' ? 'DB 原生明细' : 'Prompt 估算'}
              </span>
              ${ctx.compacted
                ? html`<span class="badge info">已压缩历史 (Compacted)</span>`
                : nothing}
            </div>
          </div>

          <div class="ctx-hero">
            <div class="ring-stack">
              ${renderContextRing(ctx.used_pct, 84, 7)}
              <span class="ring-caption">
                已占用 ${ctx.used_pct != null ? fmtPct(ctx.used_pct) : '-'}
              </span>
            </div>
            ${this.renderHeroStats(sel)}
          </div>

          ${renderStackedBar(segments)}
          ${cats.length > 0
            ? html`
                <div class="stack-legend">
                  ${cats
                    .filter((c) => c.tokens > 0)
                    .map(
                      (c, idx) => html`
                        <span class="legend-item">
                          <span
                            class="swatch"
                            style="background:${getCategoryColor(c.name, idx)};"
                          ></span>
                          <span>${c.name}</span>
                        </span>
                      `
                    )}
                </div>
              `
            : nothing}
        </md-elevated-card>

        <md-elevated-card class="card">
          <div class="card-head">
            <h2 class="card-title">按类目拆分明细</h2>
            <span class="card-meta">
              ${cats.length > 0
                ? `${cats.length} 个类目 · 占已用 ${fmtCompact(ctx.used_tokens)}`
                : '点击类目展开子项'}
            </span>
          </div>

          ${cats.length > 0
            ? html`
                <div class="cat-list">
                  ${cats.map((cat, idx) => this.renderCategoryRow(cat, idx))}
                </div>
              `
            : html`
                <div class="empty-box">
                  当前会话数据库未记录细分类目（仅提供基于最新步 Prompt
                  的总占用估算）
                </div>
              `}
        </md-elevated-card>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'context-page': ContextPage;
  }
}
