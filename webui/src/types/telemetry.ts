import type {
  MonetSpecVersion,
  MonetVariantId,
  ThemeMode,
} from '../theme/monet-engine';

export interface HostTheme {
  theme_mode: string;
  scheme: string;
  contrast: string;
  high_contrast: boolean;
}

export interface ContextItem {
  name: string;
  tokens: number;
}

export interface ContextCategory {
  name: string;
  category_id: number;
  is_system: boolean;
  tokens: number;
  pct_of_limit: number;
  pct_of_used: number;
  item_count: number;
  items: ContextItem[];
}

export interface ContextInfo {
  used_tokens: number;
  limit_tokens: number;
  free_tokens: number;
  used_pct: number | null;
  free_pct: number | null;
  api_prompt_tokens: number;
  system_tokens: number;
  chat_tokens: number;
  compacted: boolean;
  source: string;
  categories: ContextCategory[];
}

export interface StepDetail {
  idx: number;
  timestamp: number;
  date?: string;
  time_str?: string;
  convo_id?: string;
  session_title?: string;
  project?: string;
  model: string;
  input_tokens: number;
  cached_tokens: number;
  cache_hit_rate_pct: number;
  output_tokens: number;
  text_tokens?: number;
  thinking_tokens: number;
  total_tokens: number;
  ttft_sec: number | null;
  stream_sec: number | null;
  e2e_sec: number | null;
  think_sec: number | null;
  stream_out?: number;
  stream_dur?: number;
  e2e_out?: number;
  e2e_dur?: number;
  stream_tps: number | null;
  e2e_tps: number | null;
  ctx_used: number | null;
  ctx_limit: number | null;
  ctx_pct: number | null;
}

export interface ModelEntry {
  name: string;
  total: number;
  input: number;
  cached: number;
  output: number;
  thinking: number;
  turns: number;
  sessions: number;
  share_pct: number;
  cache_hit_rate_pct: number;
  avg_ttft_sec: number | null;
  p50_ttft_sec: number | null;
  avg_stream_tps: number | null;
  peak_stream_tps: number | null;
  avg_e2e_tps: number | null;
  avg_think_sec: number | null;
}

export interface CostsInfo {
  est_spend: number;
  cost_without_cache: number;
  dollars_saved: number;
  savings_pct: number;
}

export interface ToolCount {
  name: string;
  count: number;
}

export interface SelectedSession {
  convo_id: string;
  title: string;
  project: string;
  workspace_path: string;
  surface: string;
  is_active: boolean;
  is_recent: boolean;
  date: string;
  created_at: string;
  last_active_at: string;
  mtime: number;
  duration_sec: number;
  model: string;
  turn_count: number;
  input_tokens: number;
  cached_tokens: number;
  cache_hit_rate_pct: number;
  output_tokens: number;
  thinking_tokens: number;
  total_tokens: number;
  avg_ttft_sec: number | null;
  p50_ttft_sec: number | null;
  p90_ttft_sec: number | null;
  min_ttft_sec: number | null;
  max_ttft_sec: number | null;
  avg_stream_tps: number | null;
  p50_stream_tps: number | null;
  peak_stream_tps: number | null;
  avg_e2e_tps: number | null;
  avg_think_sec: number | null;
  total_think_sec: number;
  think_steps: number;
  costs: CostsInfo;
  context: ContextInfo;
  latest_step: StepDetail | null;
  steps_detail: StepDetail[];
  models_list: ModelEntry[];
  tool_counts: Record<string, number>;
  tool_errors: number;
  total_tool_calls: number;
  tool_success_rate_pct: number;
  top_tools: ToolCount[];
}

export interface SessionIndexItem {
  convo_id: string;
  title: string;
  project: string;
  surface: string;
  model: string;
  mtime: number;
  created_at: string;
  last_active_at: string;
  turn_count: number;
  total_tokens: number;
  cache_hit_rate_pct: number;
  avg_ttft_sec: number | null;
  avg_stream_tps: number | null;
  is_active: boolean;
  is_recent: boolean;
  ctx_used_pct: number | null;
  ctx_used_tokens: number;
  ctx_limit_tokens: number;
}

export interface RecentSession {
  convo_id: string;
  title: string;
  project: string;
  workspace_path: string;
  surface: string;
  is_active: boolean;
  is_recent: boolean;
  date: string;
  created_at: string;
  last_active_at: string;
  mtime: number;
  duration_sec: number;
  turn_count: number;
  total_tokens: number;
  input_tokens: number;
  cached_tokens: number;
  cache_hit_rate_pct: number;
  output_tokens: number;
  thinking_tokens: number;
  avg_ttft_sec: number | null;
  p50_ttft_sec: number | null;
  p90_ttft_sec: number | null;
  avg_stream_tps: number | null;
  peak_stream_tps: number | null;
  avg_e2e_tps: number | null;
  avg_think_sec: number | null;
  total_think_sec: number;
  ctx_used_pct: number | null;
  steps_detail: StepDetail[];
  tool_counts: Record<string, number>;
  tool_errors: number;
  model: string;
}

export interface SummaryInfo {
  total_tokens: number;
  total_input_tokens: number;
  total_cached_tokens: number;
  total_output_tokens: number;
  total_thinking_tokens: number;
  total_sessions: number;
  total_turns: number;
  cache_hit_rate_pct: number;
  total_tool_calls: number;
  total_tool_errors: number;
  tool_success_rate_pct: number;
  avg_ttft_sec: number | null;
  p50_ttft_sec: number | null;
  p90_ttft_sec: number | null;
  min_ttft_sec: number | null;
  max_ttft_sec: number | null;
  avg_stream_tps: number | null;
  p50_stream_tps: number | null;
  peak_stream_tps: number | null;
  avg_e2e_tps: number | null;
  avg_think_sec: number | null;
  total_think_sec: number;
}

export interface StreaksInfo {
  active_days: number;
  current_streak: number;
  longest_streak: number;
}

export interface DailyEntry {
  date: string;
  input: number;
  cached: number;
  output: number;
  thinking: number;
  total: number;
  sessions: number;
  turns: number;
  cache_hit_rate_pct: number;
  avg_ttft_sec: number | null;
  avg_stream_tps: number | null;
  avg_e2e_tps: number | null;
}

export interface AllDailyEntry {
  date: string;
  input: number;
  cached: number;
  output: number;
  thinking: number;
  total: number;
  sessions: number;
  turns: number;
}

export interface HourlyEntry {
  hour: number;
  sessions: number;
  turns: number;
  tokens: number;
}

export interface SurfaceInfo {
  total: number;
  sessions: number;
  input: number;
  cached: number;
  output: number;
}

export interface ProjectEntry {
  name: string;
  input: number;
  cached: number;
  output: number;
  thinking: number;
  total: number;
  sessions: number;
  turns: number;
}

export interface QuotaFamilyInfo {
  tokens: number;
  turns: number;
  sessions: number;
  limit_tokens: number;
  pct: number;
  active_model: string;
}

export interface QuotaInfo {
  rolling_window_hours: number;
  window_tokens: number;
  window_turns: number;
  window_sessions: number;
  seconds_to_reset: number;
  reset_countdown: string;
  is_active: boolean;
  is_recent: boolean;
  active_model: string;
  status: string;
  gemini: QuotaFamilyInfo;
  claude: QuotaFamilyInfo;
}

export interface StatsResponse {
  generated_at?: string;
  range?: string;
  version?: string;
  host_theme?: HostTheme;
  time_range: {
    start: string;
    end: string;
  };
  auto_latest_id: string | null;
  selection_mode: 'auto' | 'pinned' | string;
  sessions_index: SessionIndexItem[];
  selected_session: SelectedSession | null;
  latest_step: StepDetail | null;
  summary: SummaryInfo;
  costs: CostsInfo;
  streaks: StreaksInfo;
  quota: QuotaInfo;
  hourly: HourlyEntry[];
  daily: DailyEntry[];
  all_daily: AllDailyEntry[];
  models: Record<string, ModelEntry>;
  models_list: ModelEntry[];
  surfaces: Record<string, SurfaceInfo>;
  projects: ProjectEntry[];
  top_tools: ToolCount[];
  recent_sessions: RecentSession[];
}

export type PageId =
  | 'home'
  | 'context'
  | 'steps'
  | 'models'
  | 'global'
  | 'sessions'
  | 'settings';

export type HomeScope = 'latest_step' | 'session' | 'global';

export type HomeCardId =
  | 'default'
  | 'context'
  | 'step'
  | 'models'
  | 'global-trends'
  | 'extra-stats'
  | 'tools';

export type GlobalTrendsCardMode = 'today' | 'month' | 'data';

export type GlobalRange = 'since18' | 'today' | '7d' | '30d' | 'all';

export type ModelScope = 'session' | 'global';

export type SeedSourceMode = 'manual' | 'system-accent' | 'wallpaper';

export type WallpaperMonitorMode = 'follow-window' | 'primary' | string;

export interface SystemAccentInfo {
  supported: boolean;
  hex: string | null;
  source: string | null;
  reason: string;
}

export interface WallpaperCrop {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WallpaperMonitorInfo {
  id: string;
  index: number;
  label: string;
  is_primary: boolean;
  is_active_window: boolean;
  rect: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  } | null;
  has_image: boolean;
  solid_color: string | null;
  crop: WallpaperCrop | null;
  signature: string;
}

export interface SystemWallpaperInfo {
  supported: boolean;
  follow_window_supported: boolean;
  active_window_monitor_id: string | null;
  position: string;
  solid_color: string | null;
  monitors: WallpaperMonitorInfo[];
  reason: string;
}

export interface SystemThemeInfo {
  platform: string;
  desktop_env: string;
  accent: SystemAccentInfo;
  wallpaper: SystemWallpaperInfo;
}

export interface UserSettings {
  themeMode: ThemeMode;
  variant: MonetVariantId;
  specVersion: MonetSpecVersion;
  seedSource: SeedSourceMode;
  manualSeedHex: string;
  wallpaperMonitor: WallpaperMonitorMode;
  wallpaperColorIndex: number;
  homeScope: HomeScope;
  sessionMode: 'auto' | 'pinned';
  pinnedConvoId: string | null;
  liveEnabled: boolean;
  globalTrendsCardMode: GlobalTrendsCardMode;
  homeCards: HomeCardId[];
}

export interface HudStatus {
  supported: boolean;
  reason?: string;
  platform?: string;
  capabilities?: {
    always_on_top?: boolean;
    reset_position?: boolean;
  };
  running: boolean;
  pid?: number | null;
  always_on_top: boolean;
  theme?: 'dark' | 'light';
  has_monet_palette?: boolean;
  error?: string;
}

export interface GnomeExtensionStatus {
  supported: boolean;
  reason?: string;
  is_gnome?: boolean;
  is_wayland?: boolean;
  gnome_shell_version?: string;
  uuid: string;
  installed: boolean;
  enabled: boolean;
  loaded_in_shell?: boolean;
  shell_state?: string;
  needs_relogin?: boolean;
  install_path?: string;
  source_available?: boolean;
  error?: string;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  themeMode: 'follow-gui',
  variant: 'tonal_spot',
  specVersion: '2025',
  seedSource: 'manual',
  manualSeedHex: '#ADD8E6',
  wallpaperMonitor: 'follow-window',
  wallpaperColorIndex: 0,
  homeScope: 'session',
  sessionMode: 'auto',
  pinnedConvoId: null,
  liveEnabled: true,
  globalTrendsCardMode: 'today',
  homeCards: ['default'],
};
