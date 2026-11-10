import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SceneManager, SceneKey } from '../../src/foundation/scenes';

describe('Scene Lifecycle & SceneManager', () => {
  beforeEach(() => {
    SceneManager.resetInstance();
  });

  it('manages singleton instance correctly', () => {
    const instanceA = SceneManager.getInstance();
    const instanceB = SceneManager.getInstance();
    expect(instanceA).toBe(instanceB);
  });

  it('tracks scene transitions and stack depth', () => {
    const manager = SceneManager.getInstance();
    expect(manager.getCurrentScene()).toBeNull();
    expect(manager.getStackDepth()).toBe(0);

    manager.navigateTo(SceneKey.Boot);
    expect(manager.getCurrentScene()).toBe(SceneKey.Boot);
    expect(manager.getPreviousScene()).toBeNull();
    expect(manager.getStackDepth()).toBe(1);

    manager.navigateTo(SceneKey.MainMenu);
    expect(manager.getCurrentScene()).toBe(SceneKey.MainMenu);
    expect(manager.getPreviousScene()).toBe(SceneKey.Boot);
    expect(manager.getStackDepth()).toBe(1);
  });

  it('supports modal push and pop stack semantics', () => {
    const manager = SceneManager.getInstance();
    manager.navigateTo(SceneKey.Game);

    // Push Pause Modal
    manager.pushScene(SceneKey.Pause);
    expect(manager.getCurrentScene()).toBe(SceneKey.Pause);
    expect(manager.getPreviousScene()).toBe(SceneKey.Game);
    expect(manager.getStackDepth()).toBe(2);

    // Pop Pause Modal
    const resumed = manager.popScene();
    expect(resumed).toBe(SceneKey.Game);
    expect(manager.getCurrentScene()).toBe(SceneKey.Game);
    expect(manager.getStackDepth()).toBe(1);

    // Popping base scene returns null
    const invalidPop = manager.popScene();
    expect(invalidPop).toBeNull();
    expect(manager.getStackDepth()).toBe(1);
  });

  it('notifies listeners on scene transitions', () => {
    const manager = SceneManager.getInstance();
    const listener = vi.fn();

    const unsubscribe = manager.onSceneChange(listener);

    manager.navigateTo(SceneKey.Boot);
    expect(listener).toHaveBeenCalledWith(SceneKey.Boot, null);

    manager.navigateTo(SceneKey.Preloader);
    expect(listener).toHaveBeenCalledWith(SceneKey.Preloader, SceneKey.Boot);

    unsubscribe();
    manager.navigateTo(SceneKey.MainMenu);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
