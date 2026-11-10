import './style.css';
import Phaser from 'phaser';
import {
  BootScene,
  PreloaderScene,
  MainMenuScene,
  GameScene,
  PauseScene,
  VictoryScene,
  SceneManager,
  SceneKey
} from './foundation/scenes';
import { ResponsiveManager } from './foundation/responsive';
import { InputManager } from './foundation/input';
import { StorageManager } from './foundation/storage';
import { PlatformManager } from './foundation/platform';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#050608',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [BootScene, PreloaderScene, MainMenuScene, GameScene, PauseScene, VictoryScene]
};

export async function initGame(): Promise<Phaser.Game> {
  // Initialize Foundation Managers
  await StorageManager.getInstance().initialize();
  await PlatformManager.getInstance().initialize();

  const game = new Phaser.Game(gameConfig);
  SceneManager.getInstance().setGame(game);
  ResponsiveManager.getInstance().setGame(game);

  // Wire HTML UI Buttons
  setupHTMLUIControls();

  // Hook Gamepad polling into the Phaser game step
  game.events.on(Phaser.Core.Events.STEP, () => {
    InputManager.getInstance().updateGamepad();
  });

  return game;
}

function setupHTMLUIControls(): void {
  if (typeof document === 'undefined') return;

  const fullscreenBtn = document.getElementById('ui-fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      ResponsiveManager.getInstance().toggleFullscreen();
    });
  }

  const settingsBtn = document.getElementById('ui-settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      SceneManager.getInstance().pushScene(SceneKey.Pause, { isSettingsOnly: true });
    });
  }
}

// Start game automatically when DOM is ready in browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initGame().catch(err => console.error('Failed to init game:', err));
  });
}
