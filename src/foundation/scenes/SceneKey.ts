/**
 * Enumeration of standardized scene keys for the foundation lifecycle.
 */
export enum SceneKey {
  Boot = 'BootScene',
  Preloader = 'PreloaderScene',
  MainMenu = 'MainMenuScene',
  Game = 'GameScene',
  Pause = 'PauseScene',
  Victory = 'VictoryScene',
  GameOver = 'GameOverScene'
}

export type SceneDataPayload = Record<string, unknown>;
