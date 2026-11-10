import { BaseScene } from './BaseScene';
import { SceneKey } from './SceneKey';

export class BootScene extends BaseScene {
  constructor() {
    super(SceneKey.Boot);
  }

  protected onPreload(): void {
    // Load minimal bootstrap assets if necessary (e.g. initial spinner / logo)
    this.load.image('logo', '/assets/logo.png');
  }

  protected onCreate(): void {
    // Proceed immediately to Preloader
    this.scene.start(SceneKey.Preloader);
  }
}
