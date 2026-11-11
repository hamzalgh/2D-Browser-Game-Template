import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKey, SceneDataPayload } from './SceneKey';
import { AudioManager } from '../audio';
import { PlatformManager } from '../platform';

interface GridTile {
  col: number;
  row: number;
  active: boolean;
  background: Phaser.GameObjects.Graphics;
  icon: Phaser.GameObjects.Text;
}

export class GameScene extends BaseScene {
  private currentLevel = 1;
  private readonly gridCols = 5;
  private readonly gridRows = 4;
  private readonly tileSize = 84;
  private readonly tileGap = 12;
  private gridStartX = 0;
  private gridStartY = 0;
  private tiles: GridTile[][] = [];
  private score = 0;
  private targetScore = 20;
  private movesCount = 0;
  private isProcessing = false;

  constructor() {
    super(SceneKey.Game);
  }

  protected onInit(data: SceneDataPayload): void {
    this.currentLevel = typeof data.level === 'number' ? data.level : 1;
    this.movesCount = 0;
    this.score = 0;
    this.targetScore = this.gridCols * this.gridRows; // 20 tiles to clear/activate
    this.isProcessing = false;
  }

  protected onCreate(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.createBoardFrame(width, height);
    this.createTileGrid(width, height);
    this.createControls(width, height);

    this.updateHUD();

    PlatformManager.getInstance().gameplayStart();
  }

  protected onDestroy(): void {
    PlatformManager.getInstance().gameplayStop();
  }

  protected onUpdate(_time: number, _delta: number): void {
    const fpsEl = document.getElementById('ui-fps-counter');
    if (fpsEl && this.game.loop) {
      fpsEl.textContent = `FPS: ${Math.round(this.game.loop.actualFps)}`;
    }
  }

  private createBoardFrame(width: number, height: number): void {
    const bg = this.add.graphics();
    bg.fillStyle(0x07090e, 1);
    bg.fillRect(0, 0, width, height);

    // Subtle background grid
    bg.lineStyle(1, 0x0f1f38, 0.4);
    for (let x = 0; x <= width; x += 40) {
      bg.moveTo(x, 0);
      bg.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += 40) {
      bg.moveTo(0, y);
      bg.lineTo(width, y);
    }
    bg.strokePath();

    const totalGridWidth = this.gridCols * this.tileSize + (this.gridCols - 1) * this.tileGap;
    const totalGridHeight = this.gridRows * this.tileSize + (this.gridRows - 1) * this.tileGap;
    this.gridStartX = (width - totalGridWidth) / 2;
    this.gridStartY = (height - totalGridHeight) / 2 - 20;

    // Outer frame card
    const frame = this.add.graphics();
    frame.fillStyle(0x0b1120, 0.95);
    frame.fillRoundedRect(
      this.gridStartX - 24,
      this.gridStartY - 24,
      totalGridWidth + 48,
      totalGridHeight + 48,
      12
    );
    frame.lineStyle(2, 0x0284c7, 0.6);
    frame.strokeRoundedRect(
      this.gridStartX - 24,
      this.gridStartY - 24,
      totalGridWidth + 48,
      totalGridHeight + 48,
      12
    );

    // Top status line in scene
    this.add
      .text(
        this.gridStartX,
        this.gridStartY - 48,
        `LEVEL ${this.currentLevel}  |  MOVES: 0  |  ACTIVE: 0 / ${this.targetScore}`,
        {
          fontFamily: 'monospace',
          fontSize: '14px',
          fontStyle: 'bold',
          color: '#38bdf8'
        }
      )
      .setName('hudLabel');
  }

  private createTileGrid(_width: number, _height: number): void {
    this.tiles = [];

    for (let c = 0; c < this.gridCols; c++) {
      this.tiles[c] = [];
      for (let r = 0; r < this.gridRows; r++) {
        const posX = this.gridStartX + c * (this.tileSize + this.tileGap);
        const posY = this.gridStartY + r * (this.tileSize + this.tileGap);

        // Graphics background for visual feedback
        const bg = this.add.graphics();
        this.drawTileGraphic(bg, posX, posY, false, false);

        // Text icon in center of tile
        const icon = this.add.text(
          posX + this.tileSize / 2,
          posY + this.tileSize / 2,
          '◈',
          {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#64748b'
          }
        );
        icon.setOrigin(0.5, 0.5);

        // Invisible precise zone for input hit-testing
        // Origin (0,0) makes it match posX, posY directly with exact dimensions
        const zone = this.add.zone(posX, posY, this.tileSize, this.tileSize);
        zone.setOrigin(0, 0);
        zone.setInteractive({ useHandCursor: true });

        const tile: GridTile = {
          col: c,
          row: r,
          active: false,
          background: bg,
          icon
        };

        zone.on('pointerover', () => {
          this.drawTileGraphic(tile.background, posX, posY, tile.active, true);
        });

        zone.on('pointerout', () => {
          this.drawTileGraphic(tile.background, posX, posY, tile.active, false);
        });

        zone.on('pointerdown', () => {
          this.onTileClicked(tile, posX, posY);
        });

        this.tiles[c][r] = tile;
      }
    }
  }

  private drawTileGraphic(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    active: boolean,
    hovered: boolean
  ): void {
    g.clear();
    const radius = 8;

    if (active) {
      g.fillStyle(hovered ? 0x0284c7 : 0x0369a1, 0.85);
      g.fillRoundedRect(x, y, this.tileSize, this.tileSize, radius);
      g.lineStyle(2, 0x38bdf8, 1);
      g.strokeRoundedRect(x, y, this.tileSize, this.tileSize, radius);
    } else {
      g.fillStyle(hovered ? 0x1e293b : 0x0f172a, 0.75);
      g.fillRoundedRect(x, y, this.tileSize, this.tileSize, radius);
      g.lineStyle(1.5, hovered ? 0x38bdf8 : 0x1e293b, 0.85);
      g.strokeRoundedRect(x, y, this.tileSize, this.tileSize, radius);
    }
  }

  private onTileClicked(tile: GridTile, x: number, y: number): void {
    if (this.isProcessing) return;

    tile.active = !tile.active;
    this.movesCount++;

    if (tile.active) {
      AudioManager.getInstance().playSfx('connect');
      tile.icon.setText('✦');
      tile.icon.setColor('#f0fdf4');
      this.score++;
    } else {
      AudioManager.getInstance().playSfx('rotate');
      tile.icon.setText('◈');
      tile.icon.setColor('#64748b');
      this.score = Math.max(0, this.score - 1);
    }

    this.drawTileGraphic(tile.background, x, y, tile.active, true);

    // Subtle scale pop on click: reset scale and kill existing tween so rapid double clicks always bounce
    this.tweens.killTweensOf(tile.icon);
    tile.icon.setScale(1);
    this.tweens.add({
      targets: tile.icon,
      scaleX: 1.3,
      scaleY: 1.3,
      yoyo: true,
      duration: 120,
      ease: 'Back.easeOut',
      onComplete: () => {
        tile.icon.setScale(1);
      }
    });

    this.updateHUD();

    if (this.score >= this.targetScore) {
      this.triggerVictory();
    }
  }

  private updateHUD(): void {
    const hudLabel = this.children.getByName('hudLabel') as Phaser.GameObjects.Text;
    if (hudLabel) {
      hudLabel.setText(
        `LEVEL ${this.currentLevel}  |  MOVES: ${this.movesCount}  |  ACTIVE: ${this.score} / ${this.targetScore}`
      );
    }

    const statusEl = document.getElementById('ui-status-text');
    if (statusEl) {
      statusEl.textContent = `LEVEL ${this.currentLevel} // ACTIVATE ALL TILES TO WIN (${this.score}/${this.targetScore})`;
    }
  }

  private triggerVictory(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;

    AudioManager.getInstance().playSfx('victory');

    this.time.delayedCall(400, () => {
      this.openOverlay(SceneKey.Victory, {
        level: this.currentLevel,
        moves: this.movesCount
      });
    });
  }

  private createControls(width: number, height: number): void {
    const bottomY = height - 52;

    // Hint Button (Rewarded Ad flow)
    this.createActionButton(width / 2 - 240, bottomY, 'REWARDED HINT [H]', 0xd97706, () => {
      this.requestRewardedHint();
    });

    // Auto-Solve / Reset Button
    this.createActionButton(width / 2, bottomY, 'AUTO-SOLVE [SPACE]', 0x059669, () => {
      this.solveBoard();
    });

    // Pause / Settings Button
    this.createActionButton(width / 2 + 240, bottomY, 'PAUSE / MENU [ESC]', 0x475569, () => {
      this.openOverlay(SceneKey.Pause);
    });

    // Keyboard Hotkeys
    this.input.keyboard?.on('keydown-SPACE', () => this.solveBoard());
    this.input.keyboard?.on('keydown-H', () => this.requestRewardedHint());
    this.input.keyboard?.on('keydown-ESC', () => this.openOverlay(SceneKey.Pause));
  }

  private solveBoard(): void {
    if (this.isProcessing) return;

    for (let c = 0; c < this.gridCols; c++) {
      for (let r = 0; r < this.gridRows; r++) {
        const tile = this.tiles[c][r];
        if (!tile.active) {
          tile.active = true;
          tile.icon.setText('✦');
          tile.icon.setColor('#f0fdf4');
          const posX = this.gridStartX + c * (this.tileSize + this.tileGap);
          const posY = this.gridStartY + r * (this.tileSize + this.tileGap);
          this.drawTileGraphic(tile.background, posX, posY, true, false);
        }
      }
    }

    this.score = this.targetScore;
    this.movesCount++;
    this.updateHUD();
    this.triggerVictory();
  }

  private async requestRewardedHint(): Promise<void> {
    const result = await PlatformManager.getInstance().showRewarded();
    if (result.rewardGranted) {
      AudioManager.getInstance().playSfx('connect');

      // Activate up to 4 remaining tiles as hint reward
      let activated = 0;
      for (let c = 0; c < this.gridCols && activated < 4; c++) {
        for (let r = 0; r < this.gridRows && activated < 4; r++) {
          const tile = this.tiles[c][r];
          if (!tile.active) {
            tile.active = true;
            tile.icon.setText('✦');
            tile.icon.setColor('#f0fdf4');
            const posX = this.gridStartX + c * (this.tileSize + this.tileGap);
            const posY = this.gridStartY + r * (this.tileSize + this.tileGap);
            this.drawTileGraphic(tile.background, posX, posY, true, false);
            this.score++;
            activated++;
          }
        }
      }

      this.updateHUD();

      const statusEl = document.getElementById('ui-status-text');
      if (statusEl) {
        statusEl.textContent = `HINT APPLIED: ${activated} TILES ACTIVATED!`;
      }

      if (this.score >= this.targetScore) {
        this.triggerVictory();
      }
    }
  }

  private createActionButton(
    x: number,
    y: number,
    text: string,
    accentColor: number,
    onClick: () => void
  ): void {
    const w = 220;
    const h = 40;

    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.9);
    bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 6);
    bg.lineStyle(1.5, accentColor, 0.9);
    bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 6);

    const label = this.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#e2e8f0'
    });
    label.setOrigin(0.5, 0.5);

    const zone = this.add.zone(x - w / 2, y - h / 2, w, h);
    zone.setOrigin(0, 0);
    zone.setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(accentColor, 0.35);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 6);
      bg.lineStyle(1.5, accentColor, 1);
      bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 6);
    });

    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x0f172a, 0.9);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 6);
      bg.lineStyle(1.5, accentColor, 0.9);
      bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 6);
    });

    zone.on('pointerdown', () => {
      onClick();
    });
  }
}
