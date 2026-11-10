export enum InputAction {
  Primary = 'Primary', // Left Click, Tap, Space, Enter, Gamepad A
  Secondary = 'Secondary', // Right Click, Two-finger Tap, Shift, Gamepad B
  Pause = 'Pause', // Escape, Gamepad Start/Menu
  Rotate = 'Rotate', // R key, Scroll Wheel, Tap on Tile
  MoveUp = 'MoveUp', // ArrowUp, W, Gamepad D-pad Up
  MoveDown = 'MoveDown', // ArrowDown, S, Gamepad D-pad Down
  MoveLeft = 'MoveLeft', // ArrowLeft, A, Gamepad D-pad Left
  MoveRight = 'MoveRight' // ArrowRight, D, Gamepad D-pad Right
}

export interface InputContext {
  name: string;
  enabledActions: Set<InputAction>;
}

export type ActionCallback = (action: InputAction, event?: Event | unknown) => void;
