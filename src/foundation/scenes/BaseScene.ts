import Phaser, { Scene } from 'phaser';
import { SceneKey, SceneDataPayload } from './SceneKey';

export interface TransitionOptions {
  duration?: number;
  data?: SceneDataPayload;
  fadeColor?: number;
}

/**
 * BaseScene provides lifecycle orchestration, type-safe navigation,
 * automatic cleanup, and responsive layout propagation.
 */
export abstract class BaseScene extends Scene {
  protected scenePayload: SceneDataPayload = {};
  protected isTransitioning = false;

  constructor(key: SceneKey | string) {
    super(key);
  }

  /**
   * Standard Phaser init lifecycle wrapper.
   */
  public init(data?: SceneDataPayload): void {
    this.scenePayload = data || {};
    this.isTransitioning = false;

    // Listen for scene shutdown to clean up resources automatically
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.handleDestroy, this);

    this.onInit(this.scenePayload);
  }

  /**
   * Standard Phaser preload lifecycle wrapper.
   */
  public preload(): void {
    this.onPreload();
  }

  /**
   * Standard Phaser create lifecycle wrapper.
   */
  public create(data?: SceneDataPayload): void {
    this.scenePayload = data || this.scenePayload;
    this.setupCamera();
    this.onCreate(this.scenePayload);

    // Fade in camera smoothly
    this.cameras.main.fadeIn(250, 5, 6, 8);
  }

  /**
   * Standard Phaser update lifecycle wrapper.
   */
  public update(time: number, delta: number): void {
    this.onUpdate(time, delta);
  }

  /**
   * Smoothly transitions to another scene with a camera fade.
   */
  public transitionTo(targetScene: SceneKey | string, options: TransitionOptions = {}): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const duration = options.duration ?? 250;
    const fadeColor = options.fadeColor ?? 0x050608;

    this.cameras.main.fadeOut(
      duration,
      (fadeColor >> 16) & 0xff,
      (fadeColor >> 8) & 0xff,
      fadeColor & 0xff
    );

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(targetScene, options.data);
    });
  }

  /**
   * Overlay / Modal scene opening without stopping current scene.
   */
  public openOverlay(overlayScene: SceneKey | string, data?: SceneDataPayload): void {
    this.scene.launch(overlayScene, data);
    this.scene.bringToTop(overlayScene);
  }

  /**
   * Close this overlay scene and return focus to underlying scene.
   */
  public closeOverlay(): void {
    this.scene.stop();
  }

  /**
   * Called when viewport dimensions change.
   */
  public handleResize(width: number, height: number): void {
    this.onResize(width, height);
  }

  protected setupCamera(): void {
    this.cameras.main.setBackgroundColor(0x050608);
  }

  private handleShutdown(): void {
    this.onDestroy();
  }

  private handleDestroy(): void {
    this.onDestroy();
  }

  // Lifecycle hooks for derived game scenes
  protected onInit(_data: SceneDataPayload): void {}
  protected onPreload(): void {}
  protected abstract onCreate(data: SceneDataPayload): void;
  protected onUpdate(_time: number, _delta: number): void {}
  protected onDestroy(): void {}
  protected onResize(_width: number, _height: number): void {}
}
