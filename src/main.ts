import './style.css';
import Phaser from 'phaser';
import {
  BootScene,
  PreloaderScene,
  MainMenuScene,
  GameScene,
  PauseScene,
  VictoryScene,
  SceneManager
} from './foundation/scenes';

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

export function initGame(): Phaser.Game {
  const game = new Phaser.Game(gameConfig);
  SceneManager.getInstance().setGame(game);
  return game;
}

// Start game automatically when DOM is ready in browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initGame();
  });
}
