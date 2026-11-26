import { css, html, svg, type TemplateResult } from 'lit';
import type { AllDailyEntry, HourlyEntry } from '../types/telemetry';
import { ctxToneVar, fmtCompact, fmtNum, fmtSec, localDateKey } from '../utils/format';

/* M3-WEB-PLACEHOLDER: Data Visualization Charts (not provided by @material/web@2.5.0) */

export interface PieSlice {
  label: string;
  value: number;
  colorVar: string;
}

export interface StackedSegment {
  label: string;
  value: number;
  colorVar: string;
}

export const chartStyles = css`
  .tm-ring-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .tm-ring-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--tm-font-mono);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    pointer-events: none;
  }

  .tm-wf-bar {
    display: inline-flex;
    align-items: center;
    height: 10px;
    border-radius: 9999px;
    overflow: hidden;
    background: var(--md-sys-color-surface-container-highest);
    vertical-align: middle;
  }

  .tm-wf-ttft {
    height: 100%;
    background: var(--tm-chart-2);
    min-width: 2px;
  }

  .tm-wf-stream {
    height: 100%;
    background: var(--tm-chart-0);
    min-width: 2px;
  }

  .tm-pie-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .tm-hourly-bars {
    display: grid;
    grid-template-columns: repeat(24, minmax(0, 1fr));
    align-items: end;
    gap: 3px;
    width: 100%;
  }

  .tm-hr-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    gap: 4px;
    min-width: 0;
  }

  .tm-hr-bar-track {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
    min-height: 0;
  }

  .tm-hr-bar {
    width: 100%;
    border-radius: 3px 3px 1px 1px;
    background: var(--tm-chart-0);
    transition: height 0.2s ease, background-color 0.2s ease;
  }

  .tm-hr-bar.empty {
    background: var(--md-sys-color-surface-container-highest);
  }

  .tm-hr-lbl {
    font-family: var(--tm-font-mono);
    font-size: 10px;
    line-height: 1;
    color: var(--md-sys-color-on-surface-variant);
    height: 11px;
  }

  .tm-hm-grid {
    display: grid;
    grid-template-rows: repeat(7, 1fr);
    grid-auto-flow: column;
    grid-auto-columns: minmax(10px, 1fr);
    gap: 3px;
    width: 100%;
  }

  .tm-hm-cell {
    aspect-ratio: 1;
    border-radius: 3px;
    background: var(--tm-hm-0);
    border: 1px solid transparent;
    cursor: default;
    transition: transform 0.12s ease;
  }

  .tm-hm-cell:hover {
    transform: scale(1.12);
    border-color: var(--md-sys-color-outline);
  }

  .tm-hm-cell.today {
    border-color: var(--md-sys-color-primary);
  }

  .tm-hm-cell.l1 {
    background: var(--tm-hm-1);
  }
  .tm-hm-cell.l2 {
    background: var(--tm-hm-2);
  }
  .tm-hm-cell.l3 {
    background: var(--tm-hm-3);
  }
  .tm-hm-cell.l4 {
    background: var(--tm-hm-4);
  }

  .tm-stack-bar {
    display: flex;
    width: 100%;
    height: 10px;
    border-radius: 9999px;
    overflow: hidden;
    gap: 2px;
    background: var(--md-sys-color-surface-container-highest);
  }

  .tm-stack-seg {
    height: 100%;
    min-width: 2px;
    transition: width 0.25s ease;
  }
`;

export function renderContextRing(
  pct: number | null | undefined,
  size = 44,
  strokeWidth = 4
): TemplateResult {
  const half = size / 2;
  const r = Math.max(2, half - strokeWidth);
  const c = 2 * Math.PI * r;
  const clamped =
    pct == null || Number.isNaN(Number(pct))
      ? 0
      : Math.max(0, Math.min(100, Number(pct)));
  const offset = c * (1 - clamped / 100);
  const strokeColor = ctxToneVar(pct);
  const pctLabel =
    pct == null || Number.isNaN(Number(pct)) ? '-' : `${Math.round(clamped)}%`;
  const fontSize = Math.max(10, Math.round(size * 0.24));

  return html`
    <div
      class="tm-ring-wrap"
      style="width:${size}px;height:${size}px;"
      aria-label="Context usage ${pctLabel}"
    >
      ${svg`
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true" style="transform:rotate(-90deg);">
          <circle
            cx="${half}"
            cy="${half}"
            r="${r}"
            fill="none"
            stroke="var(--md-sys-color-surface-container-highest)"
            stroke-width="${strokeWidth}"
          ></circle>
          <circle
            cx="${half}"
            cy="${half}"
            r="${r}"
            fill="none"
            stroke="${strokeColor}"
            stroke-width="${strokeWidth}"
            stroke-linecap="round"
            stroke-dasharray="${c}"
            stroke-dashoffset="${offset}"
          ></circle>
        </svg>
      `}
      <span
        class="tm-ring-label"
        style="font-size:${fontSize}px;color:${strokeColor};"
      >
        ${pctLabel}
      </span>
    </div>
  `;
}

export function renderWaterfallBar(
  ttftSec: number | null | undefined,
  streamSec: number | null | undefined,
  maxDur: number,
  widthPx = 96
): TemplateResult {
  const safeMax = Math.max(0.1, maxDur);
  const ttft = Math.max(0, ttftSec ?? 0);
  const stream = Math.max(0, streamSec ?? 0);
  const ttftPct = Math.min(100, (ttft / safeMax) * 100);
  const streamPct = Math.min(100 - ttftPct, (stream / safeMax) * 100);
  const title = `TTFT ${fmtSec(ttftSec)} + Stream ${fmtSec(streamSec)}`;

  return html`
    <span
      class="tm-wf-bar"
      style="width:${widthPx}px;"
      title=${title}
    >
      ${ttft > 0
        ? html`<span class="tm-wf-ttft" style="width:${ttftPct.toFixed(1)}%"></span>`
        : ''}
      ${stream > 0
        ? html`<span class="tm-wf-stream" style="width:${streamPct.toFixed(1)}%"></span>`
        : ''}
    </span>
  `;
}

export function renderPieChart(
  slices: PieSlice[],
  size = 120
): TemplateResult {
  const valid = slices.filter((s) => s.value > 0);
  const total = valid.reduce((acc, s) => acc + s.value, 0);
  const half = size / 2;
  const r = Math.max(8, half * 0.72);
  const strokeWidth = Math.max(8, half * 0.36);
  const c = 2 * Math.PI * r;

  if (total <= 0) {
    return html`
      <div class="tm-pie-wrap" style="width:${size}px;height:${size}px;">
        ${svg`
          <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
            <circle
              cx="${half}"
              cy="${half}"
              r="${r}"
              fill="none"
              stroke="var(--md-sys-color-surface-container-highest)"
              stroke-width="${strokeWidth}"
            ></circle>
          </svg>
        `}
      </div>
    `;
  }

  let accLength = 0;
  return html`
    <div class="tm-pie-wrap" style="width:${size}px;height:${size}px;">
      ${svg`
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="transform:rotate(-90deg);" role="img" aria-label="Distribution chart">
          ${valid.map((s) => {
            const segLen = (s.value / total) * c;
            const dashArray = `${segLen} ${Math.max(0, c - segLen)}`;
            const dashOffset = -accLength;
            accLength += segLen;
            return svg`
              <circle
                cx="${half}"
                cy="${half}"
                r="${r}"
                fill="none"
                stroke="${s.colorVar}"
                stroke-width="${strokeWidth}"
                stroke-dasharray="${dashArray}"
                stroke-dashoffset="${dashOffset}"
              >
                <title>${s.label}: ${fmtCompact(s.value)} (${((s.value / total) * 100).toFixed(1)}%)</title>
              </circle>
            `;
          })}
        </svg>
      `}
    </div>
  `;
}

export function renderHourlyBars(
  hourly: HourlyEntry[],
  heightPx = 72
): TemplateResult {
  const byHour = new Map<number, HourlyEntry>();
  for (const h of hourly || []) {
    byHour.set(h.hour, h);
  }
  const slots: HourlyEntry[] = [];
  for (let hr = 0; hr < 24; hr++) {
    slots.push(byHour.get(hr) ?? { hour: hr, sessions: 0, turns: 0, tokens: 0 });
  }
  const maxTokens = Math.max(1, ...slots.map((s) => s.tokens || 0));

  return html`
    <div
      class="tm-hourly-bars"
      style="height:${heightPx}px;"
      role="img"
      aria-label="24-hour activity distribution"
    >
      ${slots.map((h) => {
        const hasActivity = h.tokens > 0;
        const pct = hasActivity
          ? Math.max(6, Math.round((h.tokens / maxTokens) * 100))
          : 4;
        const label = `${String(h.hour).padStart(2, '0')}:00 — ${fmtCompact(
          h.tokens
        )} tok (${fmtNum(h.turns)} turns)`;
        return html`
          <div class="tm-hr-col" title=${label}>
            <div class="tm-hr-bar-track">
              <div
                class="tm-hr-bar ${hasActivity ? '' : 'empty'}"
                style="height:${pct}%;"
              ></div>
            </div>
            <span class="tm-hr-lbl">${h.hour % 3 === 0 ? h.hour : ''}</span>
          </div>
        `;
      })}
    </div>
  `;
}

export function renderHeatmapGrid(
  allDaily: AllDailyEntry[],
  daysCount: number,
  onHover?: (info: { date: string; entry: AllDailyEntry | null }) => void
): TemplateResult {
  const dMap = new Map<string, AllDailyEntry>(
    (allDaily || []).map((d) => [d.date, d])
  );
  const today = new Date();
  const todayKey = localDateKey(today);

  const start = new Date(today);
  start.setDate(start.getDate() - Math.max(1, daysCount));
  // Align to Monday so rows always represent Mon-Sun
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

  const maxTotal = Math.max(1, ...(allDaily || []).map((d) => d.total || 0));
  const cells: Array<{
    key: string;
    entry: AllDailyEntry | null;
    levelClass: string;
    isToday: boolean;
  }> = [];

  for (
    const cursor = new Date(start);
    cursor <= today;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const key = localDateKey(cursor);
    const entry = dMap.get(key) ?? null;
    let levelClass = '';
    if (entry && entry.total > 0) {
      const ratio = entry.total / maxTotal;
      if (ratio > 0.65) levelClass = 'l4';
      else if (ratio > 0.35) levelClass = 'l3';
      else if (ratio > 0.12) levelClass = 'l2';
      else levelClass = 'l1';
    }
    cells.push({
      key,
      entry,
      levelClass,
      isToday: key === todayKey,
    });
  }

  return html`
    <div class="tm-hm-grid" role="grid" aria-label="Activity heatmap">
      ${cells.map((c) => {
        const title = c.entry
          ? `${c.key}: ${fmtCompact(c.entry.total)} tok · ${fmtNum(
              c.entry.turns
            )} turns`
          : `${c.key}: 0 tokens`;
        return html`
          <div
            class="tm-hm-cell ${c.levelClass} ${c.isToday ? 'today' : ''}"
            title=${title}
            @mouseenter=${() => onHover?.({ date: c.key, entry: c.entry })}
          ></div>
        `;
      })}
    </div>
  `;
}

export function renderStackedBar(segments: StackedSegment[]): TemplateResult {
  const valid = segments.filter((s) => s.value > 0);
  const total = valid.reduce((acc, s) => acc + s.value, 0);

  if (total <= 0) {
    return html`<div class="tm-stack-bar" aria-hidden="true"></div>`;
  }

  return html`
    <div class="tm-stack-bar" role="img" aria-label="Token breakdown bar">
      ${valid.map((s) => {
        const pct = Math.max(1, (s.value / total) * 100);
        return html`
          <div
            class="tm-stack-seg"
            style="width:${pct.toFixed(2)}%;background:${s.colorVar};"
            title="${s.label}: ${fmtNum(s.value)} (${((s.value / total) * 100).toFixed(1)}%)"
          ></div>
        `;
      })}
    </div>
  `;
}
