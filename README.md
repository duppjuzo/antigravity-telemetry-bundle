# Antigravity Telemetry Bundle (`cache-monitor` 插件 + Web 仪表盘服务)

一套**零第三方运行时依赖、完全自包含、全平台一键部署**的 Google Antigravity 用量与性能遥测套件（`v1.2.0`），整合了全新的 **Material 3 (M3) Monet 动态主题 WebUI**、**跨平台系统取色引擎**、**Windows 跟随式悬浮胶囊条（HUD）** 与 **自包含 Antigravity App 插件**。

---

## 核心特性

1. **全新 M3 Monet 动态主题 Web 监控面板**（默认 `http://127.0.0.1:8765/`）
   - 基于 `Lit` + `@material/web` + `@material/material-color-utilities` 构建，并内联打包为单文件 `web_dashboard.html`（**运行时零外网 CDN、零外部依赖**）。
   - **7 个交互式视图与可编辑布局**：
     - **首页（Home）**：支持编辑模式与自定义扩展的 7 张核心指标卡片、FAB 快捷操作菜单，实时跟踪当前或最近活跃会话（支持搜索切换与一键切回最新）。
     - **上下文（Context）**：原生上下文窗口占用率（`ctx%` 圆环图）及 `gen_metadata` 分类目构成明细。
     - **单步瀑布（Steps）**：单步 TTFT、Stream/E2E TPS、思考耗时与 Token 瀑布流详情。
     - **模型（Models）**：分模型 Token 占比、缓存命中率与吞吐延迟对比。
     - **近期会话（Recent Sessions）**：全历史会话检索、筛选与指标对比。
     - **全局趋势（Global Trends）**：每日趋势、活动热力图与 24 小时使用节律。
     - **设置（Settings）**：主题模式、动态种子色源、对比度及桌面悬浮窗（HUD）集中控制。

2. **跨平台系统取色引擎 (`system_theme.py`)**
   - 纯 Python 3.8+ 标准库实现：
     - **Windows**：读取 DWM / Explorer 注册表强调色，并通过 COM `IDesktopWallpaper` 提取多显示器当前壁纸（支持纯色背景、`TranscodedWallpaper` 回退、跨屏裁剪与当前 Antigravity 所在屏幕匹配）。
     - **Linux**：支持 XDG Desktop Portal v2、KDE `kdeglobals`、GNOME `gsettings` 强调色与 GNOME / KDE Plasma 多屏壁纸解析。
   - 自动跟随 Antigravity 宿主 CSS Token、`userSettings.themeMode` / `contrast` 及系统浅/深色偏好实时热切换。

3. **Windows 跟随式 M3 Monet 悬浮胶囊条（HUD）**
   - 基于 Python 标准库 `tkinter` + Win32 API 的无边框圆角置顶胶囊条（不抢占输入框焦点，切出或最小化 Antigravity 时自动隐藏）。
   - 通过 `/api/hud` 结合 `conversation_summaries.db` 实时匹配当前 Antigravity 窗口标题对应会话，常驻展示 **缓存命中率**、**TPS**、**TTFT**、**轮数/步数** 与 **总 Token / 原生上下文占比**。
   - 支持鼠标拖拽记忆相对偏移、悬停展开详情卡片、点击/右键切换或锁定会话、多显示器 DPI 与工作区边界自适应，并可直接在 WebUI **设置**页一键启停与同步 Monet 动态色板。

4. **自包含 Antigravity App 插件 (`cache-monitor` v1.2.0)**
   - 专为 Antigravity App `aux_pane` 侧边栏打造（建议右击标签页 **Pin Tab** 固定）。
   - **默认 Sidecar 托管模式**：随 Antigravity 启动和退出，不残留独立后台进程（也支持 `--standalone` 独立后台常驻）。
   - **无自动 Hook 注入**：已移除 `hooks.json`，保留按需调用的 `cache-stats` Skill。

> **零外部依赖**：后端纯 Python 3.8+ 标准库（无需 `pip install`），运行时前端单文件 `web_dashboard.html` 无外网 CDN，Sidecar 纯 Node.js 标准库（Antigravity 内置 Node 直接运行）。

---

## 环境要求

- **Python 3.8+**（含标准库 `sqlite3`；Windows 悬浮窗需要内置 `tkinter`）—— 桌面/服务器直接部署必需
- **Docker**（可选）—— 容器化部署无需本机 Python
- **Node.js**（可选）—— 运行时 Sidecar 使用 Antigravity 内置 Node；仅修改 `webui/` 前端源码重新打包时需要 `Node.js + npm`

---

## 一键部署指南（按平台选择）

### 0. 从 GitHub 直接拉取并部署

```bash
# macOS / Linux / WSL2
git clone https://github.com/duppjuzo/antigravity-telemetry-bundle.git && cd antigravity-telemetry-bundle && ./install.sh
```

```powershell
# Windows (PowerShell)
git clone https://github.com/duppjuzo/antigravity-telemetry-bundle.git; Set-Location antigravity-telemetry-bundle; .\install.ps1
```

> 或直接从 [Releases 页面](https://github.com/duppjuzo/antigravity-telemetry-bundle/releases/latest) 下载 `v1.2.0` 的 `.zip` / `.tar.gz` 压缩包离线解压部署。

---

### 1. Windows（10 / 11）

解压压缩包后，任选一种方式：

- **图形界面双击**：直接双击 [`install.bat`](./install.bat)
- **PowerShell 一键部署**：
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\install.ps1
  ```
- **独立常驻后台 + 部署后打开浏览器**：
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\install.ps1 --standalone --open
  ```

默认安装模式（**Sidecar 托管模式**）会自动完成：
1. 将自包含插件就地同步到 `%USERPROFILE%\.gemini\config\plugins\cache-monitor`（随 Antigravity 宿主启停）
2. 清理旧版系统开机自启与独立后台 `pythonw.exe` 守护进程
3. 若当前未运行 Antigravity Sidecar，则临时拉起服务完成 `/api/health` 自检后**立即停止并清理**，不残留多余进程

> 如需在**关闭 Antigravity 后仍常驻系统后台**并写入开机自启（`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`），请追加 `--standalone`。

**卸载**：双击 [`uninstall.bat`](./uninstall.bat) 或运行 `powershell -ExecutionPolicy Bypass -File .\uninstall.ps1`。

---

### 2. macOS（Apple Silicon / Intel）

解压压缩包并在终端进入目录后执行：

```bash
chmod +x install.sh uninstall.sh
./install.sh
```

> 若使用 `.tar.gz` 解压，脚本已自带可执行权限，可直接运行 `./install.sh`。

默认安装模式（**Sidecar 托管模式**）会自动完成：
1. 将自包含插件部署到 `~/.gemini/config/plugins/cache-monitor`（由 Antigravity Sidecar 随宿主启停）
2. 清理旧版 `launchd` 代理及残留独立后台进程
3. 完成 `/api/health` 临时自检并立即清理测试进程；若需独立系统守护，请使用 `./install.sh --standalone`（注册 `~/Library/LaunchAgents/com.antigravity.telemetry.plist`）

**卸载**：`./uninstall.sh`

---

### 3. Linux（Ubuntu / Debian / Fedora / Arch / WSL2 / 远程服务器）

```bash
tar -xzf antigravity-telemetry-bundle-v1.2.0.tar.gz
cd antigravity-telemetry-bundle
./install.sh
```

默认安装模式会自动完成：
1. 将自包含插件部署到 `~/.gemini/config/plugins/cache-monitor`（由 Antigravity Sidecar 随宿主启停）
2. 清理旧版 `systemd --user` 单元及残留独立后台进程
3. 完成 `/api/health` 临时自检并立即清理测试进程；若需独立系统守护，请使用 `./install.sh --standalone`（自动检测 `systemd --user` 或降级为独立后台守护）

**远程 Linux 服务器 / 局域网访问示例**（监听 `0.0.0.0` 并仅部署独立服务）：
```bash
./install.sh --service-only --host 0.0.0.0 --port 8765
```

**卸载**：`./uninstall.sh`

---

### 4. Docker / Docker Compose（NAS / 云主机 / 跨平台容器）

```bash
# 可选：自定义端口、时区或 GEMINI_HOME 路径
cp .env.example .env

# 一键构建并后台启动
docker compose up -d
```

启动后访问：`http://127.0.0.1:8765/`（容器默认以**只读 `:ro`** 挂载宿主机 `~/.gemini`，并将缓存写入独立 Docker Volume `/cache`，不修改本地对话库）。

**单条 `docker run` 示例**：
```bash
docker build -t antigravity-telemetry .
docker run -d --name antigravity-telemetry \
  -p 127.0.0.1:8765:8765 \
  -e TZ=Asia/Shanghai \
  -v "$HOME/.gemini:/data/gemini:ro" \
  antigravity-telemetry
```

**停止并移除**：`docker compose down`

---

### 5. 仅安装 Antigravity 插件（跳过临时自检）

如果只需要安装插件本身（跳过部署末尾的临时 `/api/health` 自检）：

- 运行一键脚本并加 `--plugin-only`：
  ```bash
  # macOS / Linux
  ./install.sh --plugin-only

  # Windows PowerShell
  .\install.ps1 --plugin-only
  ```
- **或**直接将 `plugin/cache-monitor` 文件夹（或 `cache-monitor-plugin-v1.2.0.zip` 解压后）放入 `~/.gemini/config/plugins/cache-monitor` 即可。

---

### 6. Windows 跟随式悬浮胶囊条（HUD）

- **启动方式**：
  - 在 WebUI **设置**页一键开关桌面悬浮窗；
  - 或直接双击根目录 / 插件目录下的 [`launch_hud.bat`](./launch_hud.bat)（也可运行 `pythonw plugin/cache-monitor/server/hud_overlay.py`）。
- **常用命令行参数（`hud_overlay.py`）**：
  - `--host` / `--port`：指定后端服务地址与端口（默认 `127.0.0.1:8765`）
  - `--convo-id <id>`：启动时直接锁定指定会话
  - `--parent-pid <pid>`：随父进程（如 Sidecar）退出自动关闭
  - `--demo`：使用演示数据预览
  - `--check [--window-title "..."]`：无界面自检并输出 JSON 预览结果

---

## 通用 CLI 管理命令 (`deploy.py`)

所有桌面与服务器平台均可直接使用 `deploy.py` 进行精细控制：

```bash
python3 deploy.py status                              # 查看安装、自启与服务健康状态
python3 deploy.py status --json                       # 输出 JSON 状态
python3 deploy.py restart                             # 重启后台服务
python3 deploy.py stop                                # 停止后台服务
python3 deploy.py start --port 8765                   # 启动后台服务
python3 deploy.py serve --host 0.0.0.0 --port 8765    # 前台运行（便于调试或配合 Supervisor）
python3 deploy.py serve --demo                        # 使用内置示例数据预览面板
python3 deploy.py install --standalone                # 安装插件并注册系统开机自启/常驻后台服务
python3 deploy.py install --standalone --no-autostart # 仅启动独立后台服务，不写入开机自启
python3 deploy.py install --gemini-home /path/.gemini --port 9000
python3 deploy.py uninstall --keep-plugin             # 仅移除服务与自启，保留插件
```

---

## HTTP API 概览

| 接口路径 | 方法 | 说明 |
| :--- | :--- | :--- |
| `/api/health` | `GET` | 服务版本、监听端口、宿主主题设置与运行状态检查 |
| `/api/stats` | `GET` | 完整遥测分析数据（支持 `range`、`start`、`end`、`convo_id`、`force`、`demo`） |
| `/api/hud` | `GET` | 悬浮窗轻量快照（支持按 `window_title` 匹配当前窗口或 `convo_id` 锁定） |
| `/api/hud/status` | `GET` | 获取当前 HUD 进程状态与配置 |
| `/api/hud/control` | `POST` | 启动 / 停止 / 重启桌面悬浮窗 |
| `/api/hud/config` | `POST` | 更新悬浮窗配置（位置偏移、主题、置顶、锁定会话） |
| `/api/hud/theme` | `POST` | 同步 WebUI 的 M3 Monet 调色板与亮暗模式到 HUD |
| `/api/theme/system` | `GET` | 获取操作系统强调色与多屏壁纸信息 |
| `/api/theme/wallpaper` | `GET` | 读取白名单校验后的系统壁纸图像用于前端 Monet 取色 |

---

## 环境变量说明

| 变量名 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `TELEMETRY_HOST` | `127.0.0.1` | HTTP 监听地址（Docker 默认 `0.0.0.0`） |
| `TELEMETRY_PORT` | `8765` | HTTP 主监听端口（Sidecar 模式下由 `ANTIGRAVITY_SIDECAR_WEB_PORT` 接管） |
| `TELEMETRY_SECONDARY_PORT` | Sidecar=`8765` / 独立=`0` | 额外监听端口，设为 `0` 可关闭 |
| `GEMINI_HOME` | `~/.gemini` | Antigravity 数据根目录（扫描 `antigravity` / `antigravity-ide` / `antigravity-cli`） |
| `ANTIGRAVITY_CACHE_FILE` | `<GEMINI_HOME>/antigravity/antigravity_stats_cache.json` | 增量解析缓存文件路径（若只读会自动回退至系统临时目录） |
| `ANTIGRAVITY_TELEMETRY_PYTHON` | 自动探测 | 指定 Sidecar / CLI 脚本使用的 Python 3.8+ 可执行文件路径 |
| `TELEMETRY_DEMO` | `0` | 设为 `1` 时启用内置演示数据 |

---

## 前端二次开发 (`webui/`)

仓库已包含完整的前端源码（`webui/`），平时运行与部署无需安装 Node/npm；若需要修改前端界面并重新生成单文件 `plugin/cache-monitor/server/web_dashboard.html`：

```bash
cd webui
npm install
npm run build
```

---

## 目录结构

```text
antigravity-telemetry-bundle/
├── .github/workflows/           # CI 验证与 tag 自动发布工作流
│   ├── ci.yml
│   └── release.yml
├── scripts/
│   └── package_release.py       # 版本一致性校验与多格式打包脚本
├── VERSION                      # 当前版本号 (1.2.0)
├── deploy.py                    # 全平台统一部署与生命周期管理 CLI
├── install.sh / uninstall.sh    # macOS & Linux 一键部署/卸载脚本
├── install.ps1 / uninstall.ps1  # Windows PowerShell 一键部署/卸载脚本
├── install.bat / uninstall.bat  # Windows 双击一键部署/卸载入口
├── launch_hud.bat               # Windows 跟随式悬浮胶囊条启动脚本
├── Dockerfile                   # 多架构零依赖镜像
├── docker-compose.yml           # Docker Compose 一键编排
├── .env.example                 # Docker 环境变量模板
├── LICENSE                      # MIT License
├── webui/                       # M3 Monet 前端源码（Lit + Vite + TypeScript）
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
└── plugin/
    └── cache-monitor/           # 完全自包含的 Antigravity 插件
        ├── plugin.json          # 插件清单
        ├── launch_hud.bat       # 插件内悬浮窗快捷启动入口
        ├── run_hook.mjs         # 跨平台 CLI 摘要启动器
        ├── cache_hook.py        # 会话缓存与遥测摘要脚本
        ├── assets/logo.svg      # 插件图标
        ├── skills/cache-stats/  # 按需查询 Skill
        ├── sidecars/telemetry/  # 跨平台 Sidecar 启动器与清单
        └── server/              # 内嵌 Telemetry 服务核心
            ├── collector.py     # SQLite Protobuf/WAL 遥测与上下文采集引擎
            ├── server.py        # 多线程 HTTP 服务与 REST API（含 /api/hud、/api/theme/*）
            ├── ensure_server.py # 跨平台无窗口后台守护启动器
            ├── system_theme.py  # 跨平台 OS 强调色与多显示器壁纸取色引擎
            ├── hud_overlay.py   # Windows M3 Monet 悬浮 HUD 胶囊窗
            └── web_dashboard.html # 零外网依赖 M3 Monet 单文件面板
```
