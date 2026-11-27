// SPDX-License-Identifier: MIT
// Antigravity Telemetry HUD — GNOME Shell 46-51 Extension

import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Soup from 'gi://Soup?version=3.0';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const HUD_API_BASE = 'http://127.0.0.1:8765';
const POLL_INTERVAL_SEC = 1.5;

function _formatNum(val, decimals = 1, fallback = '--') {
    if (typeof val !== 'number' || !Number.isFinite(val))
        return fallback;
    return val.toFixed(decimals);
}

function _formatInt(val, fallback = '-') {
    if (typeof val !== 'number' || !Number.isFinite(val))
        return fallback;
    return String(Math.round(val));
}

function _formatTokens(val) {
    if (typeof val !== 'number' || !Number.isFinite(val))
        return '--';
    if (val >= 1_000_000)
        return `${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000)
        return `${(val / 1_000).toFixed(1)}K`;
    return String(Math.round(val));
}

function _isAntigravityWindow(win) {
    if (!win)
        return false;
    const wmClass = (win.get_wm_class?.() || '').toLowerCase();
    const wmInstance = (win.get_wm_class_instance?.() || '').toLowerCase();
    const title = (win.get_title?.() || '').toLowerCase();
    return (
        wmClass.includes('antigravity') ||
        wmInstance.includes('antigravity') ||
        title.includes('antigravity')
    );
}

const AntigravityHudIndicator = GObject.registerClass(
class AntigravityHudIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.5, 'Antigravity Telemetry HUD', false);
        this.add_style_class_name('agy-hud-button');

        this._http = new Soup.Session({timeout: 2});
        this._pollSourceId = 0;
        this._inFlight = false;
        this._pinnedConvoId = null;
        this._lastPayload = null;
        this._antigravityOpen = false;
        this._focusedTitle = '';

        // Floating pill container inside panel
        this._pill = new St.BoxLayout({
            style_class: 'agy-hud-pill',
            vertical: false,
            y_align: Clutter.ActorAlign.CENTER,
        });

        this._dot = new St.Widget({
            style_class: 'agy-hud-dot agy-hud-dot-offline',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._pill.add_child(this._dot);

        this._label = new St.Label({
            style_class: 'agy-hud-text',
            text: 'AGY --',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._pill.add_child(this._label);

        this.add_child(this._pill);

        this._buildMenu();
        this._connectWindowSignals();
        this._updateAntigravityPresence();
    }

    _buildMenu() {
        this._headerItem = new PopupMenu.PopupMenuItem('Antigravity Telemetry', {
            reactive: false,
        });
        this._headerItem.label.add_style_class_name('agy-hud-menu-header');
        this.menu.addMenuItem(this._headerItem);

        this._subHeaderItem = new PopupMenu.PopupMenuItem('等待连接...', {
            reactive: false,
        });
        this._subHeaderItem.label.add_style_class_name('agy-hud-menu-sub');
        this.menu.addMenuItem(this._subHeaderItem);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        this._metricsItem = new PopupMenu.PopupMenuItem('暂无会话数据', {
            reactive: false,
        });
        this._metricsItem.label.add_style_class_name('agy-hud-menu-kv');
        this.menu.addMenuItem(this._metricsItem);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        this._sessionsSubMenu = new PopupMenu.PopupSubMenuMenuItem('切换监控会话 (自动跟随最新)');
        this.menu.addMenuItem(this._sessionsSubMenu);

        const openDashItem = new PopupMenu.PopupMenuItem('打开 Web 仪表盘');
        openDashItem.connect('activate', () => {
            try {
                Gio.AppInfo.launch_default_for_uri(`${HUD_API_BASE}/`, null);
            } catch (e) {
                console.error(`[AntigravityHUD] Failed to open dashboard: ${e}`);
            }
        });
        this.menu.addMenuItem(openDashItem);

        const refreshItem = new PopupMenu.PopupMenuItem('立即刷新');
        refreshItem.connect('activate', () => {
            this._fetchHud();
        });
        this.menu.addMenuItem(refreshItem);
    }

    _connectWindowSignals() {
        this._windowSignals = [];

        const display = global.display;
        this._windowSignals.push([
            display,
            display.connect('window-created', () => this._updateAntigravityPresence()),
        ]);
        this._windowSignals.push([
            display,
            display.connect('notify::focus-window', () => this._updateAntigravityPresence()),
        ]);

        const wm = global.workspace_manager;
        this._windowSignals.push([
            wm,
            wm.connect('active-workspace-changed', () => this._updateAntigravityPresence()),
        ]);
    }

    _updateAntigravityPresence() {
        const windows = global.display.get_tab_list(Meta.TabList.NORMAL_ALL, null);
        let found = false;
        let focusedTitle = '';

        const focusWin = global.display.focus_window;
        if (_isAntigravityWindow(focusWin)) {
            found = true;
            focusedTitle = focusWin.get_title?.() || '';
        } else {
            for (const w of windows) {
                if (_isAntigravityWindow(w)) {
                    found = true;
                    if (!focusedTitle)
                        focusedTitle = w.get_title?.() || '';
                    break;
                }
            }
        }

        this._focusedTitle = focusedTitle;
        this._antigravityOpen = found;
        this.visible = found;

        if (found) {
            this._startPolling();
        } else {
            this._stopPolling();
        }
    }

    _startPolling() {
        if (this._pollSourceId)
            return;
        this._fetchHud();
        this._pollSourceId = GLib.timeout_add(
            GLib.PRIORITY_DEFAULT,
            Math.round(POLL_INTERVAL_SEC * 1000),
            () => {
                if (!this._antigravityOpen) {
                    this._pollSourceId = 0;
                    return GLib.SOURCE_REMOVE;
                }
                this._updateAntigravityPresence();
                this._fetchHud();
                return GLib.SOURCE_CONTINUE;
            }
        );
    }

    _stopPolling() {
        if (this._pollSourceId) {
            GLib.Source.remove(this._pollSourceId);
            this._pollSourceId = 0;
        }
    }

    _fetchHud() {
        if (this._inFlight)
            return;
        this._inFlight = true;

        const params = [];
        if (this._pinnedConvoId)
            params.push(`convo_id=${encodeURIComponent(this._pinnedConvoId)}`);
        else if (this._focusedTitle)
            params.push(`window_title=${encodeURIComponent(this._focusedTitle)}`);

        const url = `${HUD_API_BASE}/api/hud${params.length ? `?${params.join('&')}` : ''}`;
        const msg = Soup.Message.new('GET', url);

        this._http.send_and_read_async(msg, GLib.PRIORITY_DEFAULT, null, (session, res) => {
            this._inFlight = false;
            try {
                const bytes = session.send_and_read_finish(res);
                if (!bytes || msg.get_status() !== Soup.Status.OK) {
                    this._renderOffline();
                    return;
                }
                const text = new TextDecoder('utf-8').decode(bytes.get_data());
                const data = JSON.parse(text);
                this._lastPayload = data;
                this._renderData(data);
            } catch (_e) {
                this._renderOffline();
            }
        });
    }

    _renderOffline() {
        this._pill.remove_style_class_name('agy-hud-pill-running');
        this._dot.set_style_class_name('agy-hud-dot agy-hud-dot-offline');
        this._label.set_text('AGY 离线');
        this._headerItem.label.set_text('Antigravity Telemetry (未连接)');
        this._subHeaderItem.label.set_text('未检测到 http://127.0.0.1:8765 服务');
    }

    _renderData(data) {
        const active = data?.active;
        if (!active) {
            this._pill.remove_style_class_name('agy-hud-pill-running');
            this._dot.set_style_class_name('agy-hud-dot agy-hud-dot-offline');
            this._label.set_text('AGY 无对话');
            this._headerItem.label.set_text('暂无活跃对话');
            this._subHeaderItem.label.set_text('请在 Antigravity 中开始对话');
            this._metricsItem.label.set_text('等待数据...');
            return;
        }

        const isRunning = Boolean(active.is_running);
        if (isRunning) {
            this._pill.add_style_class_name('agy-hud-pill-running');
            this._dot.set_style_class_name('agy-hud-dot agy-hud-dot-running');
        } else {
            this._pill.remove_style_class_name('agy-hud-pill-running');
            this._dot.set_style_class_name('agy-hud-dot');
        }

        const tps = _formatNum(active.stream_tps ?? active.avg_stream_tps, 1);
        const ttft = _formatNum(active.ttft_sec ?? active.avg_ttft_sec, 1);
        const hit = _formatNum(active.cache_hit_rate_pct, 1);
        const steps = _formatInt(active.step_count);
        const turns = _formatInt(active.user_turns);

        this._label.set_text(
            `TPS ${tps}  TTFT ${ttft}s  命中 ${hit}%  ${steps}/${turns}`
        );

        const title = active.title || active.convo_id || '当前对话';
        const model = active.model || 'Unknown Model';
        const project = active.project || 'General';
        const statusTag = isRunning ? '● 生成中' : '○ 空闲';

        this._headerItem.label.set_text(`${statusTag}  ${title}`);
        this._subHeaderItem.label.set_text(`${model} · ${project}`);

        const ctxPct = _formatNum(active.ctx_pct, 1);
        const totalTok = _formatTokens(active.total_tokens);
        const avgTps = _formatNum(active.avg_stream_tps, 1);
        const e2eTps = _formatNum(active.e2e_tps, 1);
        const avgTtft = _formatNum(active.avg_ttft_sec, 2);
        const lastHit = _formatNum(active.last_cache_hit_rate_pct, 1);

        this._metricsItem.label.set_text(
            `TPS: ${tps}/s (均 ${avgTps}/s · E2E ${e2eTps}/s)\n` +
            `TTFT: ${_formatNum(active.ttft_sec, 2)}s (均 ${avgTtft}s)\n` +
            `缓存命中: ${hit}% (末步 ${lastHit}%)\n` +
            `步数/轮数: ${steps} 步 / ${turns} 轮\n` +
            `上下文: ${ctxPct}%  ·  总 Token: ${totalTok}`
        );

        this._rebuildSessionsMenu(data?.sessions || [], active.convo_id);
    }

    _rebuildSessionsMenu(sessions, activeConvoId) {
        this._sessionsSubMenu.menu.removeAll();

        const autoItem = new PopupMenu.PopupMenuItem(
            `${this._pinnedConvoId ? '  ' : '✓ '}自动跟随最新活跃对话`
        );
        autoItem.connect('activate', () => {
            this._pinnedConvoId = null;
            this._sessionsSubMenu.label.set_text('切换监控会话 (自动跟随最新)');
            this._fetchHud();
        });
        this._sessionsSubMenu.menu.addMenuItem(autoItem);

        if (sessions.length > 0)
            this._sessionsSubMenu.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        for (const s of sessions.slice(0, 8)) {
            const cid = s.convo_id;
            const isPinned = this._pinnedConvoId === cid;
            const isCurrent = activeConvoId === cid;
            const prefix = isPinned ? '📌 ' : (isCurrent ? '● ' : '   ');
            const label = `${prefix}${s.title || cid} (${_formatNum(s.cache_hit_rate_pct, 0)}%)`;
            const item = new PopupMenu.PopupMenuItem(label);
            item.connect('activate', () => {
                this._pinnedConvoId = cid;
                this._sessionsSubMenu.label.set_text(`已锁定: ${s.title || cid}`);
                this._fetchHud();
            });
            this._sessionsSubMenu.menu.addMenuItem(item);
        }
    }

    destroy() {
        this._stopPolling();
        if (this._windowSignals) {
            for (const [obj, id] of this._windowSignals) {
                try {
                    obj.disconnect(id);
                } catch (_e) {
                    // ignore
                }
            }
            this._windowSignals = [];
        }
        if (this._http) {
            this._http.abort();
            this._http = null;
        }
        super.destroy();
    }
});

export default class AntigravityTelemetryHudExtension extends Extension {
    enable() {
        this._indicator = new AntigravityHudIndicator();
        // Place in 'right' box at index 0 so it sits visibly near the right/status area on dash-to-panel
        Main.panel.addToStatusArea(this.uuid, this._indicator, 0, 'right');
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}
