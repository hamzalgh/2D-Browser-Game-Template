export class GamepadAdapter {
  private connectedIndex: number | null = null;
  private deadzone = 0.2;
  private buttonStates: Map<number, boolean> = new Map();

  constructor() {
    this.initListeners();
  }

  private initListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('gamepadconnected', (e: Event) => {
      const gp = (e as GamepadEvent).gamepad;
      if (gp) {
        this.connectedIndex = gp.index;
        console.log(`[GamepadAdapter] Gamepad connected: ${gp.id} at index ${gp.index}`);
      }
    });

    window.addEventListener('gamepaddisconnected', (e: Event) => {
      const gp = (e as GamepadEvent).gamepad;
      if (gp && gp.index === this.connectedIndex) {
        this.connectedIndex = null;
        console.log(`[GamepadAdapter] Gamepad disconnected: ${gp.id}`);
      }
    });
  }

  public isConnected(): boolean {
    return this.connectedIndex !== null;
  }

  public poll(): { buttonsDown: number[]; axes: { x: number; y: number } } {
    if (
      this.connectedIndex === null ||
      typeof navigator === 'undefined' ||
      !navigator.getGamepads
    ) {
      return { buttonsDown: [], axes: { x: 0, y: 0 } };
    }

    const gamepads = navigator.getGamepads();
    const gp = gamepads[this.connectedIndex];
    if (!gp) {
      return { buttonsDown: [], axes: { x: 0, y: 0 } };
    }

    const buttonsDown: number[] = [];
    gp.buttons.forEach((btn, idx) => {
      const isPressed = btn.pressed || btn.value > 0.5;
      const wasPressed = this.buttonStates.get(idx) || false;
      if (isPressed && !wasPressed) {
        buttonsDown.push(idx);
      }
      this.buttonStates.set(idx, isPressed);
    });

    let axisX = gp.axes[0] || 0;
    let axisY = gp.axes[1] || 0;

    if (Math.abs(axisX) < this.deadzone) axisX = 0;
    if (Math.abs(axisY) < this.deadzone) axisY = 0;

    return { buttonsDown, axes: { x: axisX, y: axisY } };
  }
}
