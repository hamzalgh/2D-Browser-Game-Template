# Architectural Design Specification: Reusable 2D Browser Game Foundation

**Document Version:** 1.0.0  
**Target Runtimes:** Desktop Web & Mobile Web (CrazyGames & Y8)  
**Primary Engine:** Phaser 4 (latest API v4.2.1) + TypeScript (Strict)  
**Bundler / Styles:** Vite + Tailwind CSS v4

---

## 1. System Overview & Architectural Principles

The foundation is engineered as a decoupled, multi-game foundation for high-performance 2D web games. It provides reusable services for scene orchestration, cross-device responsive rendering, unified multi-input handling, versioned schema persistence, procedural WebAudio generation, platform portal abstractions, and telemetry analytics—while strictly keeping game-specific mechanics isolated in derived scenes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HTML UI Overlay (Tailwind CSS v4)              │
│  [Top System Bar]           [Modal / Dialog Slot]    [Bottom Status Bar]│
├────────────────────────────────────────────────────────────────────────┤
│                       Phaser 4 Rendering Canvas                        │
│               [Virtual Coordinates: 1280x720 (16:9)]                   │
│                                                                        │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│   │  BootScene   │───►│PreloaderScene│───►│MainMenuScene │             │
│   └──────────────┘    └──────────────┘    └──────┬───────┘             │
│                                                  │                     │
│                       ┌──────────────────────────┴──────────┐          │
│                       ▼                                     ▼          │
│               ┌──────────────┐     Overlay Modal     ┌──────────────┐  │
│               │  GameScene   │◄─────────────────────►│  PauseScene  │  │
│               └──────┬───────┘     (Push / Pop)      └──────────────┘  │
│                      │                                                 │
│                      ▼                                                 │
│               ┌──────────────┐                                         │
│               │ VictoryScene │                                         │
│               └──────────────┘                                         │
├────────────────────────────────────────────────────────────────────────┤
│                         Foundation Subsystems                          │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────┐ │
│ │  SceneManager  │ │ResponsiveMgr   │ │  InputManager  │ │StorageMgr │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └───────────┘ │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│ │  AudioManager  │ │  PlatformMgr   │ │  AnalyticsMgr  │               │
│ └────────────────┘ └────────────────┘ └────────────────┘               │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Design Principles

1. **Separation of Concerns:** Rendering and game entity logic reside in Phaser; HUD chrome, system modals, and responsive notifications reside in an accessible Tailwind CSS v4 overlay.
2. **Adapter & Facade Patterns:** All external boundaries (storage, audio hardware, portal SDKs, analytics endpoints) are wrapped behind strict TypeScript interfaces with functional local mocks.
3. **Zero-Account Local Development:** Developers can clone, test, and run full commercial gameplay loops (including ads and cloud saves) on `localhost` without platform developer accounts or network dependencies.
4. **Lightweight Asset Footprint:** Initial bundle is under **450 KB gzipped** (including Phaser 4, runtime engines, and procedural audio synthesis), ensuring instant mobile 4G loading.

---

## 2. Subsystem Directory Structure

```
src/
├── foundation/
│   ├── scenes/             # Scene lifecycle & navigation stack
│   │   ├── SceneKey.ts
│   │   ├── BaseScene.ts
│   │   ├── SceneManager.ts
│   │   ├── BootScene.ts
│   │   ├── PreloaderScene.ts
│   │   ├── MainMenuScene.ts
│   │   ├── GameScene.ts
│   │   ├── PauseScene.ts
│   │   └── VictoryScene.ts
│   ├── responsive/         # Cross-device canvas scaling & viewport
│   │   ├── Orientation.ts
│   │   ├── SafeArea.ts
│   │   └── ResponsiveManager.ts
│   ├── input/              # Unified Mouse, Touch, Keyboard & Gamepad
│   │   ├── InputAction.ts
│   │   ├── GamepadAdapter.ts
│   │   └── InputManager.ts
│   ├── storage/            # Versioned save schema & migration pipeline
│   │   ├── SaveSchema.ts
│   │   ├── StorageAdapter.ts
│   │   ├── LocalStorageAdapter.ts
│   │   ├── MemoryStorageAdapter.ts
│   │   ├── MigrationManager.ts
│   │   └── StorageManager.ts
│   ├── audio/              # Procedural WebAudio synth & sound management
│   │   ├── SynthAudioGenerator.ts
│   │   └── AudioManager.ts
│   ├── platform/           # Portal SDK adapters (CrazyGames, Y8, Mock)
│   │   ├── PlatformTypes.ts
│   │   ├── IPlatformAdapter.ts
│   │   ├── MockPlatformAdapter.ts
│   │   ├── CrazyGamesAdapter.ts
│   │   ├── Y8Adapter.ts
│   │   └── PlatformManager.ts
│   └── analytics/          # Universal telemetry & event tracking
│       ├── AnalyticsTypes.ts
│       ├── IAnalyticsAdapter.ts
│       ├── ConsoleAnalyticsAdapter.ts
│       ├── InMemoryAnalyticsAdapter.ts
│       └── AnalyticsManager.ts
├── style.css               # Tailwind CSS v4 imports & safe area rules
└── main.ts                 # Application entry point & service bootstrap
```

---

## 3. Subsystem Breakdown

### 1. Scene Lifecycle & Navigation Stack (`SceneManager`)

- **`BaseScene`:** Inherits from `Phaser.Scene` and provides standardized hooks: `onInit`, `onPreload`, `onCreate`, `onUpdate`, and `onDestroy`. Automatically manages camera fade transitions and event listener unbinding on shutdown.
- **Stack Semantics:** Supports modal scenes via `pushScene()` and `popScene()`. Launching a pause menu or settings modal suspends and darkens the underlying game scene without tearing down its entity state.

### 2. Responsive Canvas & Viewport Management (`ResponsiveManager`)

- **Virtual Resolution:** Fixed 1280×720 virtual coordinate system scaled via `Phaser.Scale.FIT` and `Phaser.Scale.CENTER_BOTH`.
- **Orientation Guard:** Detects device aspect ratio and displays a styled warning modal whenever mobile devices are held in portrait mode.
- **Safe Area Insets:** Automatically bridges CSS `env(safe-area-inset-*)` values to guarantee on-screen buttons remain clear of device notches and home indicator bars.

### 3. Unified Input Abstraction (`InputManager`)

- **Decoupled Actions:** Game logic binds to logical `InputAction` enums (`Primary`, `Secondary`, `Rotate`, `Pause`, `MoveUp`, etc.) rather than hardware keycodes.
- **Multi-Modal Support:** Unifies mouse clicks, single/double touch taps, two-finger secondary taps, keyboard keybindings, and physical Gamepad controllers with deadzone filtering.
- **Context Switching:** Allows switching input profiles (e.g., `menu`, `gameplay`, `modal`) so hotkeys do not bleed between screens.

### 4. Settings, Storage & Migration Pipeline (`StorageManager`)

- **Versioned Schema:** All player progress and preferences are serialized under an explicit schema version (`version: 1`).
- **Automatic Migration:** `MigrationManager` processes legacy saves through versioned pipeline transformers without corrupting existing progress.
- **Pluggable Adapters:** Standard `LocalStorageAdapter` for browser play; `MemoryStorageAdapter` for automated headless tests and private browsing sessions.

### 5. Audio Management & Procedural Synthesis (`AudioManager`)

- **Hierarchical Volume Control:** `effectiveVolume = masterVolume * channelVolume * (isMuted ? 0 : 1)`.
- **Procedural Synthesizer:** Built-in `SynthAudioGenerator` synthesizes 6 dynamic sound effects (click, rotate, pulse, connect, error, victory) directly using WebAudio oscillators, eliminating the need to package large audio assets.
- **Mobile Autoplay Unlock:** Automatically resumes suspended WebAudio contexts upon the player's first touch or pointer interaction.

### 6. Platform Integration & Local Mocks (`PlatformManager`)

- **Environment Auto-Detection:** Automatically switches between `CrazyGamesAdapter`, `Y8Adapter`, and `MockPlatformAdapter` based on URL hostnames or query parameters (`?platform=crazygames`).
- **Commercial Policy Enforcement:** Honors portal requirements, including CrazyGames' 3-minute ad-free introductory grace period and 180-second midroll throttling.
- **Local Simulation:** Displays interactive DOM mock modals for midroll and rewarded video ads during local testing.

### 7. Telemetry & Analytics Abstraction (`AnalyticsManager`)

- **Universal Event Dispatch:** Captures lifecycle, progression, monetization, and error events.
- **Automatic Metadata Enrichment:** Automatically appends session duration, viewport dimensions, device pixel ratio, and unique session IDs to every dispatched payload.
