import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InputManager, InputAction } from '../../src/foundation/input';

describe('InputManager Abstraction', () => {
  beforeEach(() => {
    InputManager.resetInstance();
  });

  it('triggers registered action listeners', () => {
    const input = InputManager.getInstance();
    const listener = vi.fn();

    const unsubscribe = input.onAction(InputAction.Primary, listener);

    input.triggerAction(InputAction.Primary, { test: 123 });
    expect(listener).toHaveBeenCalledWith(InputAction.Primary, { test: 123 });

    unsubscribe();
    input.triggerAction(InputAction.Primary);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('filters actions based on active input context', () => {
    const input = InputManager.getInstance();
    const primaryListener = vi.fn();
    const moveListener = vi.fn();

    input.onAction(InputAction.Primary, primaryListener);
    input.onAction(InputAction.MoveUp, moveListener);

    // Switch to modal context: allow only Primary and Pause, disallow MoveUp
    input.setContext('modal', [InputAction.Primary, InputAction.Pause]);

    input.triggerAction(InputAction.MoveUp);
    expect(moveListener).not.toHaveBeenCalled();

    input.triggerAction(InputAction.Primary);
    expect(primaryListener).toHaveBeenCalled();
  });

  it('allows binding custom keyboard codes to logical actions', () => {
    const input = InputManager.getInstance();
    const rotateListener = vi.fn();

    input.onAction(InputAction.Rotate, rotateListener);
    input.bindKey('KeyX', InputAction.Rotate);

    // Simulate keydown event on window
    const event = new KeyboardEvent('keydown', { code: 'KeyX' });
    window.dispatchEvent(event);

    expect(rotateListener).toHaveBeenCalled();
  });
});
