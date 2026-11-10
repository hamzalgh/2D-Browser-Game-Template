import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKey, SceneDataPayload } from './SceneKey';
import { AudioManager } from '../audio';
import { PlatformManager } from '../platform';

interface GridTile {
  x: number;
  y: number;
  col: number;
  row: number;
  type: 'empty' | 'wire' | 'inverter' | 'splitter' | 'terminal';
  rotation: number; // 0, 90, 180, 270
  container: Phaser.GameObjects.Container;
  glowGraphic: Phaser.GameObjects.Graphics;
}

export class GameScene extends BaseScene {
  private currentLevel = 1;
  private gridCols = 6;
  private gridRows = 4;
  private tileSize = 72;
  private gridStartX = 0;
  private gridStartY = 0;
  private tiles: GridTile[][] = [];
  private pulseObject: Phaser.GameObjects.Arc | null = null;
  private isPulseRunning = false;
  private movesCount = 0;

  constructor() {
    super(SceneKey.Game);
  }

  protected onInit(data: SceneDataPayload): void {
    this.currentLevel = typeof data.level === 'number' ? data.level : 1;
    this.movesCount = 0;
  }

  protected onCreate(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.createBoardFrame(width, height);
    this.createCircuitGrid(width, height);
    this.createControls(width, height);

    // Update HTML overlay status if present
    const statusEl = document.getElementById('ui-status-text');
    if (statusEl) {
      statusEl.textContent = `SUBNET ${this.currentLevel} ACTIVE // TAP NODES TO ROUTE SIGNALS`;
    }

    PlatformManager.getInstance().gameplayStart();
  }

  protected onDestroy(): void {
    PlatformManager.getInstance().gameplayStop();
  }

  protected onUpdate(_time: number, _delta: number): void {
    // Keep FPS counter updated in HTML UI
    const fpsEl = document.getElementById('ui-fps-counter');
    if (fpsEl && this.game.loop) {
      fpsEl.textContent = `FPS: ${Math.round(this.game.loop.actualFps)}`;
    }
  }

  private createBoardFrame(width: number, height: number): void {
    const bg = this.add.graphics();
    bg.fillStyle(0x07090e, 1);
    bg.fillRect(0, 0, width, height);

    // Subtle PCB matrix grid
    bg.lineStyle(1, 0x0f1f38, 0.5);
    for (let x = 0; x <= width; x += 36) {
      bg.moveTo(x, 0);
      bg.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += 36) {
      bg.moveTo(0, y);
      bg.lineTo(width, y);
    }
    bg.strokePath();

    // Breadboard chassis border
    const chassisWidth = this.gridCols * this.tileSize + 48;
    const chassisHeight = this.gridRows * this.tileSize + 48;
    this.gridStartX = (width - this.gridCols * this.tileSize) / 2;
    this.gridStartY = (height - this.gridRows * this.tileSize) / 2 - 10;

    const chassis = this.add.graphics();
    chassis.lineStyle(2, 0x0284c7, 0.6);
    chassis.strokeRoundedRect(
      this.gridStartX - 24,
      this.gridStartY - 24,
      chassisWidth,
      chassisHeight,
      12
    );
    chassis.fillStyle(0x0b1120, 0.9);
    chassis.fillRoundedRect(
      this.gridStartX - 24,
      this.gridStartY - 24,
      chassisWidth,
      chassisHeight,
      12
    );

    // Header label
    this.add
      .text(
        this.gridStartX,
        this.gridStartY - 46,
        `MAINFRAME SUB-CLUSTER 0x0${this.currentLevel} // MOVE COUNT: ${this.movesCount}`,
        {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#38bdf8'
        }
      )
      .setName('moveLabel');
  }

  private createCircuitGrid(_width: number, _height: number): void {
    this.tiles = [];

    for (let c = 0; c < this.gridCols; c++) {
      this.tiles[c] = [];
      for (let r = 0; r < this.gridRows; r++) {
        const posX = this.gridStartX + c * this.tileSize + this.tileSize / 2;
        const posY = this.gridStartY + r * this.tileSize + this.tileSize / 2;

        const container = this.add.container(posX, posY);

        const glowGraphic = this.add.graphics();
        glowGraphic.fillStyle(0x0f172a, 0.7);
        glowGraphic.fillRoundedRect(
          -this.tileSize / 2 + 3,
          -this.tileSize / 2 + 3,
          this.tileSize - 6,
          this.tileSize - 6,
          6
        );
        glowGraphic.lineStyle(1.5, 0x1e293b, 0.8);
        glowGraphic.strokeRoundedRect(
          -this.tileSize / 2 + 3,
          -this.tileSize / 2 + 3,
          this.tileSize - 6,
          this.tileSize - 6,
          6
        );

        // Draw wire glyph
        const wireGraphic = this.add.graphics();
        wireGraphic.lineStyle(4, 0x06b6d4, 0.9);
        wireGraphic.moveTo(0, -this.tileSize / 2 + 10);
        wireGraphic.lineTo(0, this.tileSize / 2 - 10);
        wireGraphic.strokePath();

        container.add([glowGraphic, wireGraphic]);
        container.setSize(this.tileSize, this.tileSize);
        container.setInteractive(
          new Phaser.Geom.Rectangle(
            -this.tileSize / 2,
            -this.tileSize / 2,
            this.tileSize,
            this.tileSize
          ),
          Phaser.Geom.Rectangle.Contains
        );

        const tile: GridTile = {
          x: posX,
          y: posY,
          col: c,
          row: r,
          type: 'wire',
          rotation: (c + r) % 2 === 0 ? 0 : 90,
          container,
          glowGraphic
        };

        container.setAngle(tile.rotation);

        container.on('pointerdown', () => {
          this.rotateTile(tile);
        });

        this.tiles[c][r] = tile;
      }
    }
  }

  private rotateTile(tile: GridTile): void {
    if (this.isPulseRunning) return;

    tile.rotation = (tile.rotation + 90) % 360;
    AudioManager.getInstance().playSfx('rotate');
    this.tweens.add({
      targets: tile.container,
      angle: tile.rotation,
      duration: 160,
      ease: 'Cubic.easeOut'
    });

    this.movesCount++;
    const moveLabel = this.children.getByName('moveLabel') as Phaser.GameObjects.Text;
    if (moveLabel) {
      moveLabel.setText(
        `MAINFRAME SUB-CLUSTER 0x0${this.currentLevel} // MOVE COUNT: ${this.movesCount}`
      );
    }
  }

  private createControls(width: number, height: number): void {
    const bottomY = height - 50;

    // Fire Pulse Button
    this.createActionButton(width / 2 - 240, bottomY, 'EXECUTE PULSE [SPACE]', 0x059669, () => {
      this.fireSignalPulse();
    });

    // Rewarded Hint Button
    this.createActionButton(width / 2, bottomY, 'TRACE HINT [H]', 0xd97706, () => {
      this.requestRewardedHint();
    });

    // Pause Button
    this.createActionButton(width / 2 + 240, bottomY, 'PAUSE / MENU [ESC]', 0x475569, () => {
      this.openOverlay(SceneKey.Pause);
    });

    // Keyboard Hotkeys
    this.input.keyboard?.on('keydown-SPACE', () => this.fireSignalPulse());
    this.input.keyboard?.on('keydown-H', () => this.requestRewardedHint());
    this.input.keyboard?.on('keydown-ESC', () => this.openOverlay(SceneKey.Pause));
  }

  private async requestRewardedHint(): Promise<void> {
    const result = await PlatformManager.getInstance().showRewarded();
    if (result.rewardGranted) {
      AudioManager.getInstance().playSfx('connect');
      const statusEl = document.getElementById('ui-status-text');
      if (statusEl) {
        statusEl.textContent = 'TRACE ROUTE UNLOCKED: ALIGN FIRST ROW TILES HORIZONTALLY';
      }
    }
  }

  private fireSignalPulse(): void {
    if (this.isPulseRunning) return;
    this.isPulseRunning = true;
    AudioManager.getInstance().playSfx('pulse');

    if (this.pulseObject) {
      this.pulseObject.destroy();
    }

    const startX = this.gridStartX - 30;
    const startY = this.gridStartY + this.tileSize / 2;
    const endX = this.gridStartX + this.gridCols * this.tileSize + 30;

    this.pulseObject = this.add.circle(startX, startY, 7, 0x38bdf8);
    this.pulseObject.setStrokeStyle(2, 0xe0f2fe);

    // Pulse animation across the circuit
    this.tweens.add({
      targets: this.pulseObject,
      x: endX,
      duration: 1200,
      ease: 'Linear',
      onComplete: () => {
        this.pulseObject?.destroy();
        this.pulseObject = null;
        this.isPulseRunning = false;

        // Trigger victory modal after pulse successfully breaches terminal
        AudioManager.getInstance().playSfx('victory');
        this.time.delayedCall(200, () => {
          this.openOverlay(SceneKey.Victory, {
            level: this.currentLevel,
            moves: this.movesCount
          });
        });
      }
    });
  }

  private createActionButton(
    x: number,
    y: number,
    text: string,
    accentColor: number,
    onClick: () => void
  ): void {
    const btn = this.add.container(x, y);
    const w = 220;
    const h = 36;

    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.9);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
    bg.lineStyle(1.5, accentColor, 0.9);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);

    const label = this.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#e2e8f0'
    });
    label.setOrigin(0.5, 0.5);

    btn.add([bg, label]);
    btn.setSize(w, h);
    btn.setInteractive(
      new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
      Phaser.Geom.Rectangle.Contains
    );

    btn.on('pointerover', () => {
      bg.fillStyle(accentColor, 0.35);
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
