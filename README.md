# Antigravity Telemetry Bundle (`cache-monitor` 插件 + Web 仪表盘服务)

一套**零第三方依赖、完全自包含、全平台一键部署**的 Google Antigravity 用量与性能遥测套件，整合了：

1. **Web 实时监控面板服务**（默认 `http://127.0.0.1:8765/`）：实时读取 Antigravity SQLite WAL 对话库与 Transcript，展示总 Token、Prompt Cache 命中率与节省金额、TTFT 首字延迟、Stream/E2E TPS、思考耗时、每日趋势/热力图、24 小时节律、分模型统计与单步瀑布流详情。
2. **自包含 Antigravity 插件 (`cache-monitor`)**：内置 **Telemetry Dashboard 侧边栏 Sidecar**（在 Antigravity 内直接打开监控面板）以及按需调用的 `cache-stats` Skill。

> **零外部依赖**：后端纯 Python 3.8+ 标准库（无需 `pip install`），前端纯原生 HTML/CSS/JS（无外网 CDN），Sidecar 纯 Node.js 标准库（Antigravity 内置 Node 直接运行）。

---

## 环境要求

- **Python 3.8+**（含标准库 `sqlite3`）—— 桌面/服务器直接部署必需
- **Docker**（可选）—— 容器化部署无需本机 Python
- **Node.js**（可选）—— 仅 Antigravity 内置 Sidecar 使用（Antigravity 本身已自带 Node）

---

## 一键部署指南（按平台选择）

### 0. 从 GitHub 直接一键拉取并部署（最快）

```bash
# macOS / Linux / WSL2
git clone https://github.com/duppjuzo/antigravity-telemetry-bundle.git && cd antigravity-telemetry-bundle && ./install.sh
```

```powershell
# Windows (PowerShell)
git clone https://github.com/duppjuzo/antigravity-telemetry-bundle.git; Set-Location antigravity-telemetry-bundle; .\install.ps1
```

> 或直接从 [Releases 页面](https://github.com/duppjuzo/antigravity-telemetry-bundle/releases/latest) 下载对应平台的 `.zip` / `.tar.gz` 压缩包离线解压部署。

---

### 1. Windows（10 / 11）

解压压缩包后，任选一种方式：

- **图形界面双击**：直接双击 [`install.bat`](./install.bat)
- **PowerShell 一键部署**：
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\install.ps1
  ```
- **部署完成后自动打开浏览器**：
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\install.ps1 --open
  ```

安装脚本会自动完成：
1. 将自包含插件复制到 `%USERPROFILE%\.gemini\config\plugins\cache-monitor`
2. 写入当前用户开机自启（`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`，无黑框后台运行 `pythonw.exe`）
3. 启动并健康检查 `http://127.0.0.1:8765/`

**卸载**：双击 [`uninstall.bat`](./uninstall.bat) 或运行 `powershell -ExecutionPolicy Bypass -File .\uninstall.ps1`。

---

### 2. macOS（Apple Silicon / Intel）

解压压缩包并在终端进入目录后执行：

```bash
chmod +x install.sh uninstall.sh
./install.sh
```

> 若使用 `.tar.gz` 解压，脚本已自带可执行权限，可直接运行 `./install.sh`。

安装脚本会自动完成：
1. 将自包含插件复制到 `~/.gemini/config/plugins/cache-monitor`
2. 注册并加载原生 `launchd` 用户代理（`~/Library/LaunchAgents/com.antigravity.telemetry.plist`），开机自动后台守护
3. 启动并健康检查 `http://127.0.0.1:8765/`

**卸载**：`./uninstall.sh`

---

### 3. Linux（Ubuntu / Debian / Fedora / Arch / WSL2 / 远程服务器）

```bash
tar -xzf antigravity-telemetry-bundle-v1.1.1.tar.gz
cd antigravity-telemetry-bundle
./install.sh
```

安装脚本会自动完成：
1. 将自包含插件复制到 `~/.gemini/config/plugins/cache-monitor`
2. 自动检测 `systemd --user`：
   - 若可用：注册并启用 `~/.config/systemd/user/antigravity-telemetry.service`（开机自启 + 异常自动拉起）
   - 若不可用（如未启用 systemd 的 WSL2 / 精简容器）：自动降级为独立后台守护进程（带 PID/日志管理）
3. 启动并健康检查 `http://127.0.0.1:8765/`

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

### 5. 仅安装 Antigravity 插件（无独立系统常驻进程）

如果你只想在 Antigravity 内部使用侧边栏面板和 `cache-stats` Skill（开启 Antigravity 时由 Sidecar 自动拉起 `http://127.0.0.1:8765/`）：

- 运行一键脚本并加 `--plugin-only`：
  ```bash
  # macOS / Linux
  ./install.sh --plugin-only

  # Windows PowerShell
  .\install.ps1 --plugin-only
  ```
- **或**直接将 `plugin/cache-monitor` 文件夹（或 `dist/cache-monitor-plugin-v1.1.1.zip` 解压后）放入 `~/.gemini/config/plugins/cache-monitor` 即可！

---

### 6. Windows 跟随式悬浮胶囊条（HUD）

提供零第三方依赖的 Windows 桌面无边框悬浮小条（基于 Python 标准库 `tkinter` 与 Win32 API，通过 `/api/hud` 实时拉取数据）：

- **启动方式**：直接双击根目录或插件目录下的 [`launch_hud.bat`](./launch_hud.bat)（或运行 `pythonw plugin/cache-monitor/server/hud_overlay.py`）。
- **核心能力**：自动跟随并吸附在 Antigravity 窗口上方（最小化或切窗时自动隐藏），实时展示当前窗口对话的 **缓存命中率**、**TPS**、**TTFT**、**轮数/步数** 与 **总 Token / 原生上下文占比**；支持鼠标拖拽记忆位置、悬停展开详情卡片、点击/右键切换或锁定会话以及深/浅色主题切换。

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
python3 deploy.py install --no-autostart           # 仅安装并启动，不写入系统开机自启
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
| `ANTIGRAVITY_TELEMETRY_PYTHON` | 自动探测 | 指定 Sidecar/Hook 使用的 Python 3.8+ 可执行文件路径 |
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
        ├── hooks.json           # 跨平台 Hook 配置（默认关闭）
        ├── launch_hud.bat       # 插件内悬浮窗快捷启动入口
        ├── run_hook.mjs         # 跨平台 Hook/CLI 启动器
        ├── cache_hook.py        # 会话缓存与遥测摘要脚本
        ├── assets/logo.svg      # 插件图标
        ├── skills/cache-stats/  # 按需查询 Skill
        ├── sidecars/telemetry/  # 跨平台 Sidecar 启动器与清单
        └── server/              # 内嵌 Telemetry 服务核心
            ├── collector.py     # SQLite Protobuf/WAL 遥测采集引擎
            ├── server.py        # 多线程 HTTP 服务与 REST API（含 /api/hud）
            ├── ensure_server.py # 跨平台无窗口后台守护启动器
            ├── hud_overlay.py   # Windows 悬浮 HUD 胶囊窗
            └── web_dashboard.html # 零外网依赖暗色主题交互面板
```
