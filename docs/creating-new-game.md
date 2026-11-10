# Creating a New Game with the Foundation: Step-by-Step Developer Guide

**Document Version:** 1.0.0  
**Estimated Setup Time:** Under 15 Minutes

---

## 1. Quick Start & Setup

### Step 1: Clone the Template

```bash
git clone https://github.com/your-org/neon-circuit-hacker-foundation.git my-new-game
cd my-new-game
pnpm install
```

### Step 2: Configure Project Metadata

Update `package.json` with your game's identity:

```json
{
  "name": "my-cyber-puzzle",
  "version": "1.0.0",
  "description": "My awesome new 2D puzzle game"
}
```

Update `index.html` title and header branding:

```html
<title>My Cyber Puzzle</title>
<!-- Inside #html-ui-overlay -->
<span id="ui-game-title" class="font-bold tracking-wider text-cyan-300"> MY CYBER PUZZLE </span>
```

---

## 2. Implementing Your Game Scene

All scenes inherit from `BaseScene` to gain automatic lifecycle handling, responsive layout callbacks, and camera transitions:

```typescript
// src/game/MyGameScene.ts
import { BaseScene } from '../foundation/scenes/BaseScene';
import { SceneDataPayload } from '../foundation/scenes/SceneKey';
import { AudioManager } from '../foundation/audio';
import { StorageManager } from '../foundation/storage';
import { PlatformManager } from '../foundation/platform';

export class MyGameScene extends BaseScene {
  private score = 0;

  constructor() {
    super('MyGameScene');
  }

  protected onInit(data: SceneDataPayload): void {
    console.log('Scene initialized with payload:', data);
    this.score = 0;
  }

  protected onPreload(): void {
    // Load game-specific assets here
    // this.load.image('player', '/assets/player.png');
  }

  protected onCreate(data: SceneDataPayload): void {
    const { width, height } = this.cameras.main;

    // 1. Notify platform SDK that gameplay has started
    PlatformManager.getInstance().gameplayStart();

    // 2. Play audio feedback
    AudioManager.getInstance().playSfx('connect');

    // 3. Render your game objects
    const title = this.add
      .text(width / 2, height / 2, 'CLICK TO SCORE', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#38bdf8'
      })
      .setOrigin(0.5);

    title.setInteractive({ useHandCursor: true });
    title.on('pointerdown', () => {
      this.score += 10;
      title.setText(`SCORE: ${this.score}`);
      AudioManager.getInstance().playSfx('click');

      if (this.score >= 50) {
        this.completeLevel();
      }
    });
  }

  private async completeLevel(): Promise<void> {
    // Save progress
    await StorageManager.getInstance().markLevelCompleted(1, this.score, 3);

    // Play victory sound
    AudioManager.getInstance().playSfx('victory');

    // Show midroll interstitial between levels
    await PlatformManager.getInstance().showMidroll();

    // Transition back to main menu
    this.transitionTo('MainMenuScene');
  }

  protected onDestroy(): void {
    // Notify platform SDK that gameplay has paused/stopped
    PlatformManager.getInstance().gameplayStop();
  }
}
```

---

## 3. Registering Your Scene in `src/main.ts`

Add your scene to `gameConfig.scene`:

```typescript
// src/main.ts
import { MyGameScene } from './game/MyGameScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  // ... base configuration
  scene: [
    BootScene,
    PreloaderScene,
    MainMenuScene,
    MyGameScene, // <-- Add your scene here
    PauseScene,
    VictoryScene
  ]
};
```

---

## 4. Binding Custom Input Actions

You can bind physical hardware inputs to logical game actions:

```typescript
import { InputManager, InputAction } from './foundation/input';

const input = InputManager.getInstance();

// Bind a custom key to an existing action
input.bindKey('KeyZ', InputAction.Primary);

// Listen for action triggers
input.onAction(InputAction.Primary, () => {
  console.log('Player executed Primary Action!');
});
```

---

## 5. Testing & Building for Production

### Verify Your Changes

```bash
# Run unit tests
pnpm test

# Run multi-viewport responsive Playwright tests
pnpm test:e2e

# Run linter and typecheck
pnpm lint && pnpm typecheck
```

### Build for Portals (CrazyGames / Y8)

```bash
pnpm build
```

The compiled output is located in `dist/`. Zip the contents of `dist/` and upload directly to CrazyGames or Y8 Developer Portals.
