# AGENTS.md

> **AI Agent Instructions & Architecture Guide**  
> **Project:** 2D Game Starter Release v0.1.0  
> **Type:** Production-Ready Reusable 2D Browser Game Foundation / Template

---

## 📌 Context for AI Agents & Developers

This repository is an **already complete, production-ready, reusable 2D browser game foundation/template** built with **Phaser 4**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **pnpm**.

When you are asked to build, modify, or extend a game on top of this repository:

- **DO NOT rebuild the core infrastructure.** Reuse the existing foundation managers under `src/foundation/`.
- **DO NOT install redundant UI frameworks** (like React, Vue, or Bootstrap). The hybrid architecture uses Phaser 4 for canvas rendering and vanilla Tailwind CSS v4 HTML overlays for HUD/modals.
- **Maintain platform neutrality**: Keep platform-specific logic inside `PlatformManager` / adapter classes (`CrazyGamesAdapter`, `Y8Adapter`, `MockPlatformAdapter`).

---

## 🏗️ Architecture & Subsystems Map

```
src/
├── foundation/               # Core reusable game engine foundation
│   ├── analytics/            # Event tracking, buffering, Console & In-Memory adapters
│   │   ├── AnalyticsManager.ts
│   │   └── AnalyticsTypes.ts
│   ├── audio/                # Procedural WebAudio synth (SFX) & volume hierarchy
│   │   ├── AudioManager.ts
│   │   └── SynthAudioGenerator.ts
│   ├── input/                # Unified virtual action mapper (Keyboard, Mouse, Touch, Gamepad)
│   │   ├── InputManager.ts
│   │   └── InputAction.ts
│   ├── platform/             # CrazyGames SDK v3, Y8 adBreak/ID SDK & local MockPlatformAdapter
│   │   ├── PlatformManager.ts
│   │   ├── CrazyGamesAdapter.ts
│   │   ├── Y8Adapter.ts
│   │   └── MockPlatformAdapter.ts
│   ├── responsive/           # 16:9 canvas scaling, safe areas (`env(safe-area-*)`), orientation locks
│   │   ├── ResponsiveManager.ts
│   │   └── SafeArea.ts
│   ├── scenes/               # Scene lifecycle, modal stack, transition fading
│   │   ├── BaseScene.ts      # Base class for all scenes (provides modal & transition helpers)
│   │   ├── SceneManager.ts   # Scene director & modal stack controller
│   │   ├── SceneKey.ts       # Enum for scene keys and payload types
│   │   ├── BootScene.ts      # Initial bootstrap
│   │   ├── PreloaderScene.ts # Asset loading & progress bar
│   │   ├── MainMenuScene.ts  # Title & primary menu
│   │   ├── GameScene.ts      # Active gameplay loop & interaction
│   │   ├── PauseScene.ts     # Modal overlay for pause & settings
│   │   └── VictoryScene.ts   # Modal overlay for level win & interstitial flow
│   └── storage/              # Versioned save schemas, migrations, LocalStorage/Memory/Cloud fallback
│       ├── StorageManager.ts
│       ├── MigrationManager.ts
│       └── SaveSchema.ts
├── main.ts                   # Game entry point, manager initialization & Phaser Game config
└── style.css                 # Tailwind CSS v4 styles & safe-area CSS custom properties
```

---

## 🎯 Critical Conventions & Patterns

### 1. Interactive Objects & Hit-Testing in Phaser 4

- Phaser 4 Containers calculate `displayOriginX / displayOriginY` as `width * 0.5` and `height * 0.5`. **Never** use negative offset hit areas like `new Phaser.Geom.Rectangle(-w/2, -h/2, w, h)` on scaled containers, as it causes inaccurate hit testing under canvas `FIT` mode.
- **Recommended practice for hit-testing**:
  - Use `scene.add.zone(x, y, w, h).setOrigin(0, 0).setInteractive({ useHandCursor: true })` for precise, pixel-exact clickable regions.
  - Or use standard GameObjects (e.g. `Rectangle`, `Image`, `Sprite`) with built-in origin alignments and `{ useHandCursor: true }`.
  - When re-animating objects on rapid clicks/double-clicks, kill in-flight tweens (`this.tweens.killTweensOf(target)`) and reset scale (`setScale(1)`) so animations never freeze.

### 2. Scene Lifecycle & Modals

- Extend [`BaseScene`](file:///src/foundation/scenes/BaseScene.ts) for all game scenes.
- Use `this.transitionTo(SceneKey.Target, { data })` for smooth camera fade transitions.
- Use `this.openOverlay(SceneKey.Pause, { data })` and `this.closeOverlay()` for non-destructive modal stack layers (pause, settings, rewards, victory).

### 3. Ads & Portal Monetization

- **Midroll (Interstitials)**: Call `await PlatformManager.getInstance().showMidroll()`.
- **Rewarded Ads**: Call `const result = await PlatformManager.getInstance().showRewarded(); if (result.rewardGranted) { ... }`.
- **Gameplay Tracking**: Ensure `gameplayStart()` and `gameplayStop()` are called on level enter/exit.

### 4. Audio

- Use `AudioManager.getInstance().playSfx('click' | 'rotate' | 'pulse' | 'connect' | 'error' | 'victory')`.
- Procedural audio is generated via `SynthAudioGenerator` (WebAudio oscillators) without needing external audio files.

---

## 🛠️ Verification & Quality Gates

Always verify after making code changes:

```bash
# Typecheck
pnpm typecheck

# Unit tests (Vitest with headless DOM canvas mock)
pnpm test

# Responsive E2E tests (Playwright across 4 viewports)
pnpm test:e2e

# Production bundle
pnpm build
```

---

## 🌐 Local Dev Server Ports & Parameters

- **Dev Server**: `http://localhost:3000`
- **Platform Mock Query Param**: `http://localhost:3000/?mock=true`
- **CrazyGames Mode**: `http://localhost:3000/?platform=crazygames`
- **Y8 Mode**: `http://localhost:3000/?platform=y8`
