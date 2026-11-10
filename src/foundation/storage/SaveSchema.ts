export interface GameSettings {
  masterVolume: number; // 0.0 to 1.0
  sfxVolume: number; // 0.0 to 1.0
  musicVolume: number; // 0.0 to 1.0
  sfxMuted: boolean;
  musicMuted: boolean;
  highContrast: boolean;
  screenShake: boolean;
  touchVibration: boolean;
}

export interface PlayerProgress {
  currentLevel: number;
  highestUnlockedLevel: number;
  levelStars: Record<number, number>; // levelId -> stars (1-3)
  levelScores: Record<number, number>; // levelId -> moves or score
  dailyStreak: number;
  lastDailyDate: string | null;
  achievements: string[];
}

export interface SaveDataV1 {
  version: 1;
  timestamp: number;
  settings: GameSettings;
  progress: PlayerProgress;
}

export type CurrentSaveData = SaveDataV1;
export const CURRENT_SAVE_VERSION = 1;

export const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.8,
  sfxVolume: 1.0,
  musicVolume: 0.7,
  sfxMuted: false,
  musicMuted: false,
  highContrast: false,
  screenShake: true,
  touchVibration: true
};

export const DEFAULT_PROGRESS: PlayerProgress = {
  currentLevel: 1,
  highestUnlockedLevel: 1,
  levelStars: {},
  levelScores: {},
  dailyStreak: 0,
  lastDailyDate: null,
  achievements: []
};

export const DEFAULT_SAVE_DATA: CurrentSaveData = {
  version: CURRENT_SAVE_VERSION,
  timestamp: Date.now(),
  settings: DEFAULT_SETTINGS,
  progress: DEFAULT_PROGRESS
};
