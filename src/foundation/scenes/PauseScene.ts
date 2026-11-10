import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKey, SceneDataPayload } from './SceneKey';

export class PauseScene extends BaseScene {
  private isSettingsOnly = false;

  constructor() {
    super(SceneKey.Pause);
  }

  protected onInit(data: SceneDataPayload): void {
    this.isSettingsOnly = Boolean(data.isSettingsOnly);
  }

  protected onCreate(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Semi-transparent backdrop overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x020617, 0.75);
    overlay.fillRect(0, 0, width, height);

    // Modal dialog card
    const modalWidth = 340;
    const modalHeight = this.isSettingsOnly ? 280 : 340;
    const modalX = width / 2;
    const modalY = height / 2;

    const modalBox = this.add.graphics();
    modalBox.fillStyle(0x0b1120, 0.95);
    modalBox.fillRoundedRect(
      modalX - modalWidth / 2,
      modalY - modalHeight / 2,
      modalWidth,
      modalHeight,
      10
    );
    modalBox.lineStyle(2, 0x0ea5e9, 0.8);
    modalBox.strokeRoundedRect(
      modalX - modalWidth / 2,
      modalY - modalHeight / 2,
      modalWidth,
      modalHeight,
      10
    );

    // Header title
    const headerTitle = this.isSettingsOnly ? 'SYSTEM CONFIGURATION' : 'SYSTEM PAUSED';
    const title = this.add.text(modalX, modalY - modalHeight / 2 + 36, headerTitle, {
      fontFamily: 'monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#38bdf8'
    });
    title.setOrigin(0.5, 0.5);

    let currentY = modalY - 40;
    const spacing = 50;

    if (!this.isSettingsOnly) {
      this.createModalButton(modalX, currentY, 'RESUME RUN [ESC]', 0x0284c7, () => {
        this.closeOverlay();
      });
      currentY += spacing;

      this.createModalButton(modalX, currentY, 'RESTART LEVEL', 0x0369a1, () => {
        this.closeOverlay();
        this.scene.get(SceneKey.Game).scene.restart();
      });
      currentY += spacing;
    }

    this.createModalButton(modalX, currentY, 'RETURN TO MAINFRAME', 0xe11d48, () => {
      this.closeOverlay();
      this.scene.stop(SceneKey.Game);
      this.scene.start(SceneKey.MainMenu);
    });

    // Close button (X) in corner
    const closeBtn = this.add.text(
      modalX + modalWidth / 2 - 28,
      modalY - modalHeight / 2 + 20,
      '✕',
      {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#94a3b8'
      }
    );
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.closeOverlay());

    // ESC key listener to resume
    this.input.keyboard?.once('keydown-ESC', () => this.closeOverlay());
  }

  private createModalButton(
    x: number,
    y: number,
    text: string,
    color: number,
    onClick: () => void
  ): void {
    const btn = this.add.container(x, y);
    const w = 260;
    const h = 38;

    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.9);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
    bg.lineStyle(1.5, color, 0.8);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);

    const label = this.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#f8fafc'
    });
    label.setOrigin(0.5, 0.5);

    btn.add([bg, label]);
    btn.setSize(w, h);
    btn.setInteractive(
      new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
      Phaser.Geom.Rectangle.Contains
    );

    btn.on('pointerover', () => {
      bg.fillStyle(color, 0.4);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
      this.input.setDefaultCursor('pointer');
    });

    btn.on('pointerout', () => {
      bg.fillStyle(0x0f172a, 0.9);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
      this.input.setDefaultCursor('default');
    });

    btn.on('pointerdown', () => {
      this.input.setDefaultCursor('default');
      onClick();
    });
  }
}
