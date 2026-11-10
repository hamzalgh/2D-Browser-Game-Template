# Testing Strategy & Quality Assurance Guide

**Document Version:** 1.0.0  
**Test Frameworks:** Vitest 3 (Unit/Integration) & Playwright (End-to-End Responsive)  
**CI Pipeline:** GitHub Actions

---

## 1. Testing Pyramid Overview

The foundation enforces a strict testing pyramid to ensure zero runtime regressions across web portals:

```
                  ┌───────────────────────────────┐
                  │       Playwright E2E Tests    │
                  │   (Multi-Viewport Responsive) │
                  ├───────────────────────────────┤
                  │     Vitest Integration Tests  │
                  │   (Scene, Storage, Platform)  │
                  ├───────────────────────────────┤
                  │       Vitest Unit Tests       │
                  │ (Audio, Migrations, Inputs)   │
                  └───────────────────────────────┘
```

---

## 2. Unit & Integration Testing (Vitest)

Unit tests run in a headless `jsdom` environment configured in `vite.config.ts`.

### Headless Canvas Mocking (`tests/setup.ts`)

Phaser's core initializes internal WebGL and 2D canvas contexts during startup. Because `jsdom` lacks native HTML5 Canvas support, `tests/setup.ts` injects a lightweight 2D context mock:

```typescript
// tests/setup.ts
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = ((type: string) => {
    if (type === '2d') {
      return {
        fillStyle: '',
        fillRect: () => {},
        getImageData: () => ({ data: new Uint8ClampedArray(4) }),
        putImageData: () => {}
        // ... additional canvas 2d primitives
      };
    }
    return null;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
```

### Key Test Suites

- **`sceneLifecycle.test.ts`:** Verifies `SceneManager` navigation, modal push/pop stacks, and subscriber callbacks.
- **`responsive.test.ts`:** Verifies dimensions tracking, orientation detection, and safe-area calculations.
- **`input.test.ts`:** Verifies keybindings, input context switching, and gesture event dispatching.
- **`storage.test.ts`:** Verifies versioned save persistence, schema migrations, corrupt data recovery, and JSON import/export.
- **`audio.test.ts`:** Verifies volume hierarchy, mute toggling, and procedural WebAudio synthesis safety.
- **`platform.test.ts`:** Verifies mock ad simulations, rewarded callbacks, and portal adapter fallbacks.
- **`analytics.test.ts`:** Verifies session ID generation, metadata enrichment, and standard event taxonomies.

---

## 3. End-to-End Responsive Testing (Playwright)

Playwright tests the game inside real Chromium browser instances across desktop and mobile form factors:

### Active Test Projects (`playwright.config.ts`)

1. **Desktop Chrome 16:9 (1280×720):** Primary reference layout.
2. **Desktop 4:3 Legacy (1024×768):** Verifies letterboxing and HUD visibility.
3. **Mobile Chrome Landscape (915×412):** Validates touch controls and mobile scaling.
4. **Mobile Chrome Portrait (412×915):** Proves `#orientation-warning` triggers and obscures gameplay.

### Running Test Commands

```bash
# Run all unit tests
pnpm test

# Run unit tests in interactive watch mode
pnpm test:watch

# Run Playwright E2E tests across all responsive viewports
pnpm test:e2e

# Run tests with code coverage report
pnpm test:coverage
```

---

## 4. Continuous Integration Pipeline (GitHub Actions)

The `.github/workflows/ci.yml` pipeline runs on every push and pull request to `main`:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with: { node-version: 22 }
  - uses: pnpm/action-setup@v4
  - run: pnpm install --frozen-lockfile
  - run: pnpm format:check # Prettier code style
  - run: pnpm lint # ESLint v9 static analysis
  - run: pnpm typecheck # TypeScript compiler validation
  - run: pnpm test # Vitest unit test suite
  - run: pnpm build # Vite production bundle build
```

A pull request cannot merge unless all verification gates pass with zero errors.
