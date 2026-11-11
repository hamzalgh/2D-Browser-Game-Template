import { BaseScene } from './BaseScene';
import { SceneKey } from './SceneKey';
import { AudioManager } from '../audio';

export class MainMenuScene extends BaseScene {
  constructor() {
    super(SceneKey.MainMenu);
  }

  protected onCreate(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background decorative grid
    this.createCyberBackground(width, height);

    // Title
    const titleText = this.add.text(width / 2, height * 0.28, '2D GAME STARTER', {
      fontFamily: 'monospace',
      fontSize: '44px',
      fontStyle: 'bold',
      color: '#38bdf8'
    });
    titleText.setOrigin(0.5, 0.5);
    titleText.setShadow(0, 0, '#06b6d4', 16, true, true);

    const subText = this.add.text(
      width / 2,
      height * 0.36,
      '// PRODUCTION-READY BROWSER GAME FOUNDATION',
      {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#94a3b8'
      }
    );
    subText.setOrigin(0.5, 0.5);

    // Primary Action Buttons
    this.createMenuButton(width / 2, height * 0.52, 'START GAME', () => {
      this.transitionTo(SceneKey.Game, { data: { level: 1 } });
    });

    this.createMenuButton(width / 2, height * 0.63, 'DAILY CHALLENGE', () => {
      this.transitionTo(SceneKey.Game, { data: { level: 'daily' } });
    });

    this.createMenuButton(width / 2, height * 0.74, 'SETTINGS', () => {
      this.openOverlay(SceneKey.Pause, { isSettingsOnly: true });
    });

    // Version Footer
    const verText = this.add.text(
      width / 2,
      height * 0.92,
      'v0.1.0 // CrazyGames & Y8 Ready',
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#475569'
      }
    );
    verText.setOrigin(0.5, 0.5);
  }

  private createMenuButton(x: number, y: number, text: string, onClick: () => void): void {
    const btnContainer = this.add.container(x, y);

    const btnWidth = 280;
    const btnHeight = 44;

    const bg = this.add.graphics();
    bg.lineStyle(1.5, 0x06b6d4, 0.8);
    bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);
    bg.fillStyle(0x0f172a, 0.85);
    bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);

    const label = this.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#e0f2fe'
    });
    label.setOrigin(0.5, 0.5);

    btnContainer.add([bg, label]);
    btnContainer.setSize(btnWidth, btnHeight);
    btnContainer.setInteractive({ useHandCursor: true });

    btnContainer.on('pointerover', () => {
      bg.clear();
      bg.lineStyle(2, 0x38bdf8, 1);
      bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);
      bg.fillStyle(0x0284c7, 0.4);
      bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);
      label.setColor('#ffffff');
    });

    btnContainer.on('pointerout', () => {
      bg.clear();
      bg.lineStyle(1.5, 0x06b6d4, 0.8);
      bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);
      bg.fillStyle(0x0f172a, 0.85);
      bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);
      label.setColor('#e0f2fe');
    });

    btnContainer.on('pointerdown', () => {
      AudioManager.getInstance().playSfx('click');
      onClick();
    });
  }

  private createCyberBackground(width: number, height: number): void {
    const gfx = this.add.graphics();
    gfx.lineStyle(1, 0x0f2942, 0.4);

    const gridSize = 40;
    for (let x = 0; x <= width; x += gridSize) {
      gfx.moveTo(x, 0);
      gfx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      gfx.moveTo(0, y);
      gfx.lineTo(width, y);
    }
    gfx.strokePath();
  }
}
