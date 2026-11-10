import { InputAction, ActionCallback, InputContext } from './InputAction';
import { GamepadAdapter } from './GamepadAdapter';

export class InputManager {
  private static instance: InputManager | null = null;
  private actionListeners: Map<InputAction, Set<ActionCallback>> = new Map();
  private keyBindings: Map<string, InputAction> = new Map();
  private activeContext: InputContext;
  private gamepadAdapter: GamepadAdapter;

  private constructor() {
    this.gamepadAdapter = new GamepadAdapter();

    this.activeContext = {
      name: 'global',
      enabledActions: new Set(Object.values(InputAction))
    };

    this.setupDefaultKeybindings();
    this.setupDOMListeners();
  }

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  public static resetInstance(): void {
    InputManager.instance = null;
  }

  public setContext(contextName: string, allowedActions?: InputAction[]): void {
    this.activeContext = {
      name: contextName,
      enabledActions: new Set(allowedActions || Object.values(InputAction))
    };
  }

  public getContext(): string {
    return this.activeContext.name;
  }

  public onAction(action: InputAction, callback: ActionCallback): () => void {
    if (!this.actionListeners.has(action)) {
      this.actionListeners.set(action, new Set());
    }
    const listeners = this.actionListeners.get(action)!;
    listeners.add(callback);

    return () => {
      listeners.delete(callback);
    };
  }

  public triggerAction(action: InputAction, event?: Event | unknown): void {
    if (!this.activeContext.enabledActions.has(action)) {
      return;
    }

    const listeners = this.actionListeners.get(action);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(action, event);
        } catch (err) {
          console.error(`Error in InputAction listener (${action}):`, err);
        }
      }
    }
  }

  public bindKey(code: string, action: InputAction): void {
    this.keyBindings.set(code, action);
  }

  private setupDefaultKeybindings(): void {
    this.bindKey('Space', InputAction.Primary);
    this.bindKey('Enter', InputAction.Primary);
    this.bindKey('ShiftLeft', InputAction.Secondary);
    this.bindKey('ShiftRight', InputAction.Secondary);
    this.bindKey('Escape', InputAction.Pause);
    this.bindKey('KeyP', InputAction.Pause);
    this.bindKey('KeyR', InputAction.Rotate);

    // Navigation keys
    this.bindKey('ArrowUp', InputAction.MoveUp);
    this.bindKey('KeyW', InputAction.MoveUp);
    this.bindKey('ArrowDown', InputAction.MoveDown);
    this.bindKey('KeyS', InputAction.MoveDown);
    this.bindKey('ArrowLeft', InputAction.MoveLeft);
    this.bindKey('KeyA', InputAction.MoveLeft);
    this.bindKey('ArrowRight', InputAction.MoveRight);
    this.bindKey('KeyD', InputAction.MoveRight);
  }

  private setupDOMListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Don't intercept if user is typing into an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const action = this.keyBindings.get(e.code);
      if (action) {
        this.triggerAction(action, e);
      }
    });

    // Touch gesture handling
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchStartTime = Date.now();
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          // Two-finger tap triggers Secondary action
          this.triggerAction(InputAction.Secondary, e);
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'touchend',
      (e: TouchEvent) => {
        if (e.changedTouches.length === 1) {
          const duration = Date.now() - touchStartTime;
          const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
          const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);

          // Tap gesture: short duration and minimal displacement
          if (duration < 300 && deltaX < 15 && deltaY < 15) {
            this.triggerAction(InputAction.Primary, e);
          }
        }
      },
      { passive: true }
    );
  }

  public updateGamepad(): void {
    if (!this.gamepadAdapter.isConnected()) return;

    const { buttonsDown, axes } = this.gamepadAdapter.poll();

    // Map Standard Gamepad Buttons
    if (buttonsDown.includes(0)) this.triggerAction(InputAction.Primary); // A
    if (buttonsDown.includes(1)) this.triggerAction(InputAction.Secondary); // B
    if (buttonsDown.includes(9)) this.triggerAction(InputAction.Pause); // Start/Options
    if (buttonsDown.includes(2)) this.triggerAction(InputAction.Rotate); // X

    // D-pad or Analog Sticks
    if (axes.y < -0.5 || buttonsDown.includes(12)) this.triggerAction(InputAction.MoveUp);
    if (axes.y > 0.5 || buttonsDown.includes(13)) this.triggerAction(InputAction.MoveDown);
    if (axes.x < -0.5 || buttonsDown.includes(14)) this.triggerAction(InputAction.MoveLeft);
    if (axes.x > 0.5 || buttonsDown.includes(15)) this.triggerAction(InputAction.MoveRight);
  }
}
