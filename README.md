# 2D Game Starter Release v0.1.0 — Reusable 2D Browser Game Foundation

A production-ready, modular 2D browser game foundation engineered with **Phaser 4**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **pnpm**. Designed specifically for publishing high-performance HTML5 games to major web portals including **CrazyGames** and **Y8**, supporting both desktop and mobile viewports with zero third-party UI framework bloat (no React, no Bootstrap, no backend required).

---

## 🌟 Key Features

1. **Phaser 4 + Modern Tooling**: Built on Phaser 4.2.1, Vite 6, and TypeScript 5 in strict mode.
2. **Hybrid UI Architecture**: Phaser handles hardware-accelerated 2D canvas gameplay, while Tailwind CSS v4 powers crisp, responsive HTML overlays (HUD, modals, orientation warnings).
3. **Multi-Platform Ready**: Seamless runtime adapter switching between **CrazyGames SDK v3**, **Y8 adBreak / ID SDK**, and an interactive zero-account **MockPlatformAdapter**.
4. **Unified Input Abstraction**: Digital virtual action mapping supporting Keyboard, Mouse, Touch, and Gamepad.
5. **Responsive & Mobile Guarded**: Virtual 16:9 canvas scaling, dynamic safe area bridging (`env(safe-area-inset-*)`), and mobile portrait rotation locks with auto-pause.
6. **Robust Save & Migration System**: Type-safe schema versioning, schema migration pipelines, and automated fallback between LocalStorage, Memory, and Cloud storage.
7. **Procedural WebAudio Synthesis**: Zero-asset procedural SFX generator (clicks, rotations, pulses, connections, errors, victory arpeggios) with volume hierarchy and mobile auto-unlock.
8. **Universal Analytics**: Lifecycle and custom event dispatcher with Console and In-Memory buffering adapters.
9. **Dual-Tier Automated Testing**: Vitest unit test suite (with headless 2D canvas simulation) + Playwright responsive E2E matrix testing 4 distinct device form factors.

---

## 📁 Repository Structure

```
├── .github/workflows/ci.yml       # GitHub Actions CI matrix pipeline
├── docs/                          # Comprehensive technical documentation
│   ├── architecture.md            # Subsystem architecture & design patterns
│   ├── responsive-design.md       # Viewport scaling, safe areas & mobile guards
│   ├── platform-integration.md    # CrazyGames, Y8 & Mock platform integration
│   ├── testing.md                 # Unit & responsive Playwright test strategy
│   ├── creating-new-game.md       # Step-by-step developer guide for new games
│   └── research/                  # Market & competitor research
├── public/                        # Static assets (favicons, icons, manifest)
├── src/
│   ├── foundation/                # Reusable platform & engine subsystems
│   │   ├── analytics/             # Event tracking, buffering & platform dispatch
│   │   ├── audio/                 # Procedural WebAudio synth & volume hierarchy
│   │   ├── input/                 # Virtual action mapper & multi-input listener
│   │   ├── platform/              # CrazyGames, Y8 & Mock SDK adapters
│   │   ├── responsive/            # Canvas scaling, safe areas & orientation guard
│   │   ├── scenes/                # Scene manager, lifecycle hooks & modal stack
│   │   └── storage/               # Save schemas, migrations & storage adapters
│   ├── index.html                 # App shell, meta tags, and HTML overlay containers
│   ├── main.ts                    # Application bootstrap & foundation wiring
│   └── style.css                  # Tailwind CSS v4 configuration
└── tests/
    ├── e2e/                       # Playwright responsive matrix E2E tests
    ├── setup.ts                   # Headless canvas mock for Vitest
    └── unit/                      # Unit test suites for all foundation subsystems
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0 (enforced via `.npmrc`)

### Installation & Development

```bash
# Install dependencies
pnpm install

# Start local development server with Mock Platform Adapter
pnpm dev

# Build production bundle
pnpm build

# Preview production build locally
pnpm preview
```

### URL Query Parameters

You can test specific platform adapters locally without modifying code:

- **Mock Adapter (Default)**: `http://localhost:3000/?mock=true`
- **CrazyGames Adapter**: `http://localhost:3000/?platform=crazygames`
- **Y8 Adapter**: `http://localhost:3000/?platform=y8`

---

## 🧪 Testing & Quality Assurance

```bash
# Run unit test suite (Vitest with Headless Canvas)
pnpm test

# Run unit tests with code coverage
pnpm test:coverage

# Run responsive E2E test suite (Playwright across 4 viewports)
pnpm test:e2e

# Run TypeScript typecheck
pnpm typecheck

# Run ESLint check
pnpm lint

# Format codebase with Prettier
pnpm format
```

---

## 📚 Documentation Index

For in-depth guides and architectural references, review the documentation in `docs/`:

- [System Architecture](docs/architecture.md) — Subsystem lifecycles, dependency injection, and decoupled design.
- [Responsive Design & Mobile Handling](docs/responsive-design.md) — 16:9 virtual canvas scaling, safe areas, and gesture protection.
- [Platform Integration Guide](docs/platform-integration.md) — CrazyGames SDK v3, Y8 adBreak API, and MockPlatformAdapter behavior.
- [Testing & Quality Assurance Guide](docs/testing.md) — Headless canvas unit testing, Playwright responsive matrix, and CI setup.
- [Creating a New Game Guide](docs/creating-new-game.md) — 15-minute quickstart to clone this foundation into a new standalone game.
