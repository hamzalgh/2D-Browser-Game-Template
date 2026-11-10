# Responsive Design & Cross-Device Engineering Guide

**Document Version:** 1.0.0  
**Target Matrix:** Desktop HD, Ultrawide, Legacy 4:3 Monitors, Tablets, and Mobile Smartphones (iOS Safari / Android Chrome)

---

## 1. Responsive Viewport Strategy

Browser game portals feature extreme device diversity: players access games on 4K desktop monitors, 1366×768 Chromebooks, iPads, and high-DPI smartphones with notches and dynamic islands.

```
[Virtual Viewport Coordinate Mapping]

Native Window / Screen (Any Aspect Ratio)
┌────────────────────────────────────────────────────────┐
│ Black Margin                                           │
│       ┌────────────────────────────────────────┐       │
│       │ 1280 x 720 Virtual Phaser Coordinate    │       │
│       │ Space (16:9 Aspect Ratio)              │       │
│       │                                        │       │
│       │   [Game Grid]      [HUD Action Bar]    │       │
│       └────────────────────────────────────────┘       │
│                                           Black Margin │
└────────────────────────────────────────────────────────┘
```

### The 16:9 Virtual Coordinate System

Rather than designing fluid canvas layouts where gameplay physics change based on window width, the foundation locks internal gameplay rendering to a **1280×720 (16:9)** coordinate system:

- **`mode: Phaser.Scale.FIT`:** Automatically fits the game inside the parent container while preserving the 16:9 aspect ratio.
- **`autoCenter: Phaser.Scale.CENTER_BOTH`:** Perfectly centers the canvas horizontally and vertically.
- **Benefits:** Game logic, circuit grid dimensions, and pulse trajectories remain 100% deterministic across all screens.

---

## 2. Mobile Browser Chrome & Gesture Mitigation

Mobile browsers (especially Mobile Safari on iOS and Chrome on Android) present several destructive default behaviors:

1. **Involuntary Pull-to-Refresh & Page Scrolling:** Swiping down to move a puzzle piece can accidentally trigger page reload or scroll the viewport away.
2. **Double-Tap Zoom & Magnification:** Rapidly clicking a circuit tile can trigger browser pinch-zoom.
3. **Address Bar Height Jumps:** Scrolling triggers URL bar collapse, suddenly changing `window.innerHeight`.

### Applied Solutions

The foundation eliminates these bugs through layered CSS and event policies:

```css
/* src/style.css */
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none; /* Disables browser swipe-navigation & pull-to-refresh */
  user-select: none; /* Prevents text/image selection highlight boxes */
  -webkit-touch-callout: none; /* Disables long-press context menus */
  -webkit-tap-highlight-color: transparent; /* Removes blue tap flash on Android */
}
```

In `ResponsiveManager.ts`, a passive-false touch listener intercepts gestures on `#game-container`:

```typescript
window.addEventListener(
  'touchmove',
  event => {
    if ((event.target as HTMLElement)?.closest('#game-container')) {
      event.preventDefault();
    }
  },
  { passive: false }
);
```

---

## 3. Safe Area Insets & Notch Handling

Modern mobile devices feature camera cutouts, rounded corners, and home indicator bars. Placing interactive buttons at absolute screen edges (`top: 0`, `bottom: 0`) results in unclickable UI.

### CSS Environment Bridging

The HTML root defines dynamic CSS variables bound to device hardware safe areas:

```css
:root {
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-left: env(safe-area-inset-left, 0px);
  --safe-area-right: env(safe-area-inset-right, 0px);
}
```

The HTML UI overlay (`#html-ui-overlay`) automatically inherits this padding:

```html
<div
  id="html-ui-overlay"
  style="
  padding-top: var(--safe-area-top);
  padding-bottom: var(--safe-area-bottom);
  padding-left: var(--safe-area-left);
  padding-right: var(--safe-area-right);
"
></div>
```

Interactive elements (settings gear, fullscreen button, status footer) remain comfortably accessible within safe touch boundaries.

---

## 4. Mobile Orientation Enforcement

Circuit logic puzzles require horizontal real estate for signal routing. When played vertically in mobile portrait mode, game tiles shrink below the minimum comfortable touch threshold (44×44px).

### The Orientation Warning Overlay

`ResponsiveManager` continuously monitors screen aspect ratio:

```typescript
const orientation = width >= height ? DeviceOrientation.Landscape : DeviceOrientation.Portrait;
```

If a mobile user holds their device in portrait orientation, `#orientation-warning` is displayed with a high z-index (`z-50`), dimming the game and instructing the player:

```
           [DEVICE ROTATION PROMPT]
              ┌──────────────┐
              │      ▲       │
              │   ROTATE     │
              │  FOR OPTIMAL │
              │   GAMEPLAY   │
              │      ▼       │
              └──────────────┘
```

As soon as the player rotates their device to landscape, the overlay is hidden and full gameplay resumes seamlessly.

---

## 5. Viewport Test Matrix (Playwright Automated Testing)

Every pull request and build is automatically validated against 4 distinct hardware profiles:

| Profile Name                  | Viewport Dimensions | Aspect Ratio   | Target Verification                                         |
| :---------------------------- | :------------------ | :------------- | :---------------------------------------------------------- |
| **Desktop Chrome 16:9**       | 1280 × 720          | 16:9           | Native pixel-perfect alignment; full HTML UI display.       |
| **Desktop 4:3 (Legacy)**      | 1024 × 768          | 4:3 (1.33:1)   | Letterboxing padding; HUD remains fully visible.            |
| **Mobile Chrome (Landscape)** | 915 × 412           | ~20:9 (2.22:1) | Notch avoidance; touch hitboxes align without clipping.     |
| **Mobile Chrome (Portrait)**  | 412 × 915           | 9:20           | `#orientation-warning` triggers; canvas interaction paused. |
