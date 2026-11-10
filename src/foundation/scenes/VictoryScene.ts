import { BaseScene } from './BaseScene';
import { SceneKey, SceneDataPayload } from './SceneKey';

export class VictoryScene extends BaseScene {
  private level = 1;
  private moves = 0;

  constructor() {
    super(SceneKey.Victory);
  }

  protected onInit(data: SceneDataPayload): void {
    this.level = typeof data.level === 'number' ? data.level : 1;
    this.moves = typeof data.moves === 'number' ? data.moves : 0;
  }

  protected onCreate(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Overlay backdrop
    const overlay = this.add.graphics();
    overlay.fillStyle(0x020617, 0.8);
    overlay.fillRect(0, 0, width, height);

    const modalWidth = 380;
    const modalHeight = 360;
    const modalX = width / 2;
    const modalY = height / 2;

    const modalBox = this.add.graphics();
    modalBox.fillStyle(0x06111f, 0.95);
    modalBox.fillRoundedRect(
      modalX - modalWidth / 2,
      modalY - modalHeight / 2,
      modalWidth,
      modalHeight,
      12
    );
    modalBox.lineStyle(2, 0x10b981, 0.9);
    modalBox.strokeRoundedRect(
      modalX - modalWidth / 2,
      modalY - modalHeight / 2,
      modalWidth,
      modalHeight,
      12
    );

    // Title
    const title = this.add.text(modalX, modalY - 120, 'MAINFRAME BREACHED', {
      fontFamily: 'monospace',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#34d399'
    });
    title.setOrigin(0.5, 0.5);

    // Subtitle stats
    const statsText = this.add.text(
      modalX,
      modalY - 50,
      `SUBNET 0x0${this.level} COMPROMISED\nMOVES EXPENDED: ${this.moves}\nSTATUS: ROOT ACCESS GRANTED`,
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        align: 'center',
        color: '#a7f3d0'
      }
    );
    statsText.setOrigin(0.5, 0.5);

    // Star rating graphic (3 stars)
    const starContainer = this.add.container(modalX, modalY + 15);
    for (let i = -1; i <= 1; i++) {
      const star = this.add.text(i * 40, 0, '★', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#fbbf24'
      });
      star.setOrigin(0.5, 0.5);
      starContainer.add(star);
    }

    // Action buttons
    this.createActionButton(modalX, modalY + 80, 'NEXT SUBNET [ENTER]', 0x10b981, () => {
      this.closeOverlay();
      this.scene.get(SceneKey.Game).scene.restart({ level: this.level + 1 });
    });

    this.createActionButton(modalX, modalY + 130, 'MAIN MENU', 0x475569, () => {
      this.closeOverlay();
      this.scene.stop(SceneKey.Game);
      this.scene.start(SceneKey.MainMenu);
    });

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.closeOverlay();
      this.scene.get(SceneKey.Game).scene.restart({ level: this.level + 1 });
    });
  }

  private createActionButton(
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
