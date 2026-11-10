import { SceneKey, SceneDataPayload } from './SceneKey';
import { AnalyticsManager, StandardAnalyticsEvent } from '../analytics';

export type SceneChangeCallback = (currentScene: string, previousScene: string | null) => void;

/**
 * SceneManager orchestrates scene switches, modal push/pop stacks,
 * and publishes navigation lifecycle updates.
 */
export class SceneManager {
  private static instance: SceneManager | null = null;
  private currentSceneKey: string | null = null;
  private previousSceneKey: string | null = null;
  private sceneStack: string[] = [];
  private listeners: Set<SceneChangeCallback> = new Set();
  private gameInstance: Phaser.Game | null = null;

  private constructor() {}

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  public static resetInstance(): void {
    SceneManager.instance = null;
  }

  public setGame(game: Phaser.Game): void {
    this.gameInstance = game;
  }

  public getCurrentScene(): string | null {
    return this.currentSceneKey;
  }

  public getPreviousScene(): string | null {
    return this.previousSceneKey;
  }

  public getStackDepth(): number {
    return this.sceneStack.length;
  }

  /**
   * Switch to a new scene, closing the current active scene.
   */
  public navigateTo(targetScene: SceneKey | string, data?: SceneDataPayload): void {
    const prev = this.currentSceneKey;
    this.previousSceneKey = prev;
    this.currentSceneKey = targetScene;
    this.sceneStack = [targetScene];

    if (this.gameInstance) {
      this.gameInstance.scene.start(targetScene, data);
    }

    this.notifyListeners(targetScene, prev);
  }

  /**
   * Push an overlay / modal scene on top of current scene (e.g. Pause, Settings).
   */
  public pushScene(overlayScene: SceneKey | string, data?: SceneDataPayload): void {
    const current = this.currentSceneKey;
    this.sceneStack.push(overlayScene);
    this.previousSceneKey = current;
    this.currentSceneKey = overlayScene;

    if (this.gameInstance && current) {
      const activeScene = this.gameInstance.scene.getScene(current);
      if (activeScene) {
        activeScene.scene.launch(overlayScene, data);
        activeScene.scene.bringToTop(overlayScene);
      } else {
        this.gameInstance.scene.start(overlayScene, data);
      }
    }

    this.notifyListeners(overlayScene, this.previousSceneKey);
  }

  /**
   * Pop an overlay scene and resume the underlying scene.
   */
  public popScene(): string | null {
    if (this.sceneStack.length <= 1) {
      return null;
    }

    const popped = this.sceneStack.pop();
    const resumed = this.sceneStack[this.sceneStack.length - 1];

    if (this.gameInstance && popped) {
      this.gameInstance.scene.stop(popped);
      this.gameInstance.scene.resume(resumed);
    }

    const prev = this.currentSceneKey;
    this.previousSceneKey = prev;
    this.currentSceneKey = resumed;

    this.notifyListeners(resumed, prev);
    return resumed;
  }

  public onSceneChange(callback: SceneChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(current: string, previous: string | null): void {
    AnalyticsManager.getInstance().track(StandardAnalyticsEvent.SceneChange, {
      from: previous,
      to: current
    });

    for (const listener of this.listeners) {
      try {
        listener(current, previous);
      } catch (err) {
        console.error('Error in scene change listener:', err);
      }
    }
  }
}
