export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

export interface AnalyticsEvent {
  name: string;
  params: AnalyticsEventParams;
  timestamp: number;
  sessionId: string;
}

export enum StandardAnalyticsEvent {
  GameStart = 'game_start',
  SessionStart = 'session_start',
  SceneChange = 'scene_change',
  LevelStart = 'level_start',
  LevelComplete = 'level_complete',
  LevelFail = 'level_fail',
  LevelRestart = 'level_restart',
  AdRequested = 'ad_requested',
  AdCompleted = 'ad_completed',
  AdFailed = 'ad_failed',
  RageClick = 'rage_click_detected',
  ErrorLogged = 'error_logged'
}
