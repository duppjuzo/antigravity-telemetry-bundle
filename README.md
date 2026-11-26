# Antigravity Telemetry Bundle (`cache-monitor` 插件 + Web 仪表盘服务)

一套**零第三方依赖、完全自包含、全平台一键部署**的 Google Antigravity 用量与性能遥测套件，整合了：

1. **Web 实时监控面板服务**（默认 `http://127.0.0.1:8765/`）：实时读取 Antigravity SQLite WAL 对话库与 Transcript，展示当前会话或全局的总 Token、Prompt Cache 命中率与节省金额、TTFT 首字延迟、Stream/E2E TPS、思考耗时、原生上下文窗口占用率（`ctx%` 圆环图与分类目构成）、每日趋势/热力图、24 小时节律、分模型统计与单步瀑布流详情。
2. **自包含 Antigravity App 插件 (`cache-monitor` v1.2.0)**：专为 Antigravity App `aux_pane` 侧边栏打造（建议右击标签页 **Pin Tab** 固定）：
   - **顶部常驻摘要条**：自动跟踪最近活跃会话（支持搜索切换与一键切回最新），横向展示 `ctx%` SVG 圆环图、`TTFT`、`Cache Hit`、`Token/s`、`Total Tokens`。
   - **下方 5 类目选项卡**：`概览` / `上下文` / `单步瀑布` / `模型` / `全局趋势`，自适应侧栏窄屏；内置完整亮色/暗色双套主题，跟随 Antigravity 宿主 CSS Token、`userSettings.themeMode` / `contrast` 及系统偏好实时热切换。
   - **无自动 Hook 注入**：已移除 `hooks.json`（无 `PostInvocation` 等生命周期钩子），保留按需调用的 `cache-stats` Skill。

> **零外部依赖**：后端纯 Python 3.8+ 标准库（无需 `pip install`），前端纯原生 HTML/CSS/JS（无外网 CDN），Sidecar 纯 Node.js 标准库（Antigravity 内置 Node 直接运行）。

---

## 环境要求

- **Python 3.8+**（含标准库 `sqlite3`）—— 桌面/服务器直接部署必需
- **Docker**（可选）—— 容器化部署无需本机 Python
- **Node.js**（可选）—— 仅 Antigravity 内置 Sidecar 使用（Antigravity 本身已自带 Node）

---

## 一键部署指南（按平台选择）

### 1. Windows（10 / 11）

解压压缩包后，任选一种方式：

- **图形界面双击**：直接双击 [`install.bat`](./install.bat)
- **PowerShell 一键部署**：
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\install.ps1
  ```
- **部署完成后自动打开浏览器（需配合 `--standalone`）**：
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\install.ps1 --standalone --open
  ```

默认安装模式（**Sidecar 托管模式**）会自动完成：
1. 将自包含插件复制到 `%USERPROFILE%\.gemini\config\plugins\cache-monitor`（随 Antigravity 启动与退出，不常驻后台）
2. 自动清理旧版系统开机自启与独立后台 `pythonw.exe` 守护进程
3. 若当前未运行 Antigravity Sidecar，则临时拉起服务完成 `/api/health` 自检后**立即停止并清理**，不会残留需要手动杀掉的 Python 进程

> 如需在**关闭 Antigravity 后仍常驻系统后台**并开机自启，请追加 `--standalone` 参数：`.\install.ps1 --standalone`。

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
1. 将自包含插件复制到 `~/.gemini/config/plugins/cache-monitor`（由 Antigravity Sidecar 随宿主启停）
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
1. 将自包含插件复制到 `~/.gemini/config/plugins/cache-monitor`（由 Antigravity Sidecar 随宿主启停）
2. 清理旧版 `systemd --user` 单元及残留独立后台进程
3. 完成 `/api/health` 临时自检并立即清理测试进程；若需独立系统守护，请使用 `./install.sh --standalone`（自动检测 `systemd --user` 或降级为独立后台守护）

**远程 Linux 服务器 / 局域网访问示例**（监听 `0.0.0.0` 并仅部署服务）：
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

启动后访问：`http://127.0.0.1:8765/`（容器默认以**只读 `:ro`** 挂载宿主机 `~/.gemini`，并将缓存写入独立 Docker Volume `/cache`，绝对安全）。

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

默认安装已采用由 Antigravity Sidecar 托管的轻量模式（不注册开机自启，也不保留独立后台进程）；若连部署末端的临时 `/api/health` 自检也想跳过，可加 `--plugin-only`：

- 运行一键脚本并加 `--plugin-only`：
  ```bash
  # macOS / Linux
  ./install.sh --plugin-only

  # Windows PowerShell
  .\install.ps1 --plugin-only
  ```
- **或**直接将 `plugin/cache-monitor` 文件夹放入 `~/.gemini/config/plugins/cache-monitor` 即可！

---

### 6. Windows 跟随式悬浮胶囊条（HUD）

提供零第三方依赖的 Windows 桌面无边框 M3 Monet 悬浮胶囊条（基于 Python 标准库 `tkinter` 与 Win32 API，通过 `/api/hud` 实时拉取数据，可在 WebUI 设置页开关或同步主题）：

- **启动方式**：在 WebUI **设置 → 桌面悬浮窗** 一键开启，或直接双击根目录 / 插件目录下的 [`launch_hud.bat`](./launch_hud.bat)（也可运行 `pythonw plugin/cache-monitor/server/hud_overlay.py`）。
- **核心能力**：自动跟随并吸附在 Antigravity 窗口上方（最小化或切窗时自动隐藏），实时展示当前窗口对话的 **缓存命中率**、**TPS**、**TTFT**、**轮数/步数** 与 **总 Token / 原生上下文占比**；支持鼠标拖拽记忆位置、悬停展开详情卡片、点击/右键切换或锁定会话以及实时同步 WebUI 的 M3 Monet 动态色板与深/浅色主题。

---

## 通用 CLI 管理命令 (`deploy.py`)

所有桌面与服务器平台均可直接使用 `deploy.py` 进行精细控制：

```bash
python3 deploy.py status                           # 查看安装、自启与服务健康状态
python3 deploy.py status --json                    # 输出 JSON 状态
python3 deploy.py restart                          # 重启后台服务
python3 deploy.py stop                             # 停止后台服务
python3 deploy.py start --port 8765                # 启动后台服务
python3 deploy.py serve --host 0.0.0.0 --port 8765 # 前台运行（便于调试或配合 Supervisor）
python3 deploy.py serve --demo                     # 使用内置示例数据预览面板
python3 deploy.py install --standalone             # 安装插件并注册系统开机自启/常驻后台服务
python3 deploy.py install --standalone --no-autostart # 仅启动独立后台服务，不写入开机自启
python3 deploy.py install --gemini-home /path/.gemini --port 9000
python3 deploy.py uninstall --keep-plugin          # 仅移除服务与自启，保留插件
```

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

## 目录结构

```text
antigravity-telemetry-bundle/
├── deploy.py                    # 全平台统一部署与生命周期管理 CLI
├── install.sh / uninstall.sh    # macOS & Linux 一键部署/卸载脚本
├── install.ps1 / uninstall.ps1  # Windows PowerShell 一键部署/卸载脚本
├── install.bat / uninstall.bat  # Windows 双击一键部署/卸载入口
├── launch_hud.bat               # Windows 跟随式悬浮胶囊条启动脚本
├── Dockerfile                   # 多架构零依赖镜像
├── docker-compose.yml           # Docker Compose 一键编排
├── .env.example                 # Docker 环境变量模板
├── LICENSE                      # MIT License
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
            ├── server.py        # 多线程 HTTP 服务与 REST API（含 /api/hud）
            ├── ensure_server.py # 跨平台无窗口后台守护启动器
            ├── hud_overlay.py   # Windows M3 Monet 悬浮 HUD 胶囊窗
            └── web_dashboard.html # 零外网依赖自适应主题 aux_pane 面板
```
