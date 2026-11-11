import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKey } from './SceneKey';

export class PreloaderScene extends BaseScene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private percentText!: Phaser.GameObjects.Text;
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKey.Preloader);
  }

  protected onPreload(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background glow
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x050608, 0x050608, 0x0a101f, 0x0a101f, 1);
    bg.fillRect(0, 0, width, height);

    // Progress bar bounding box
    this.progressBox = this.add.graphics();
    this.progressBox.lineStyle(2, 0x06b6d4, 0.8);
    this.progressBox.strokeRect(width / 2 - 160, height / 2 - 15, 320, 30);
    this.progressBox.fillStyle(0x0f172a, 0.7);
    this.progressBox.fillRect(width / 2 - 158, height / 2 - 13, 316, 26);

    // Progress bar fill
    this.progressBar = this.add.graphics();

    // Loading title
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'INITIALIZING SYSTEM...', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#38bdf8'
    });
    this.loadingText.setOrigin(0.5, 0.5);

    // Percentage text
    this.percentText = this.add.text(width / 2, height / 2, '0%', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#e0f2fe'
    });
    this.percentText.setOrigin(0.5, 0.5);

    // Load assets
    this.load.image('bg', '/assets/bg.png');

    // Hook loader events
    this.load.on('progress', (value: number) => {
      this.percentText.setText(`${Math.round(value * 100)}%`);
      this.progressBar.clear();
      this.progressBar.fillStyle(0x06b6d4, 1);
      this.progressBar.fillRect(width / 2 - 156, height / 2 - 11, 312 * value, 22);
    });

    this.load.on('complete', () => {
      this.loadingText.setText('KERNEL READY // LAUNCHING');
    });
  }

  protected onCreate(): void {
    // Brief delay to appreciate complete bar, then transition smoothly
    this.time.delayedCall(300, () => {
      this.transitionTo(SceneKey.MainMenu, { duration: 300 });
    });
  }
}
