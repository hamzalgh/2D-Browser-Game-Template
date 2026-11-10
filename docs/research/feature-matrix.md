# Competitor Feature Matrix & Capability Comparison

**Project:** Neon Circuit Hacker  
**Document Version:** 1.0.0  
**Date:** November 10, 2026  
**Audience:** Game Designers, Technical Architects, Commercial Leads

---

## 1. High-Density Competitor Comparison Matrix

The following matrix contrasts the 8 primary competitors and 1 adjacent benchmark against the proposed specification for **Neon Circuit Hacker**.

| Feature / Dimension        | Spark Path        | Neon Lights      | Connector     | Power Light    | Pipe Puzzle     | Pipe            | Circuit Master    | Wire Connect     | Laser Ricochet _(Ref)_ | **Neon Circuit Hacker (Proposed)**  |
| :------------------------- | :---------------- | :--------------- | :------------ | :------------- | :-------------- | :-------------- | :---------------- | :--------------- | :--------------------- | :---------------------------------- |
| **Primary Portal**         | Y8                | Y8               | Y8 (GD)       | Y8 (GD)        | CrazyGames      | Y8 (Silver)     | CrazyGames        | Y8 (GD)          | CrazyGames             | **CrazyGames & Y8**                 |
| **Engine / Runtime**       | HTML5 Canvas      | DOM Sprites      | HTML5 (Dead)  | Construct 3    | Unity 5.6       | Construct 2     | HTML5 Canvas      | Construct 3      | Unity 2022             | **Phaser 3 / PixiJS (HTML5)**       |
| **Build Size**             | ~1.8 MB           | ~1.2 MB          | N/A           | ~4.5 MB        | 13.1 MB         | ~2.1 MB         | 8.26 MB           | ~5.8 MB          | ~18 MB                 | **< 6.0 MB**                        |
| **Native Aspect Ratio**    | 7:4 (700×400)     | 5:3 (800×480)    | 4:3           | 9:16 (515×915) | 16:9 Desktop    | 9:16 (515×915)  | 16:9 Landscape    | Dynamic (16:9)   | 16:9 / Auto            | **16:9 Native (Responsive)**        |
| **Cross-Platform UX**      | Desktop & Mobile  | Desktop & Mobile | Broken        | Portrait Only  | Desktop Only    | Portrait Only   | Desktop & Mobile  | Desktop & Mobile | Desktop & Mobile       | **Unified Desktop + Mobile**        |
| **Core Input Style**       | Tap to Rotate     | Tap to Rotate    | Tap to Rotate | Tap to Rotate  | Drag-and-Drop   | Tap to Rotate   | Inventory-to-Grid | Freeform Draw    | Tap to Rotate          | **Click-to-Cycle + Drag Palette**   |
| **Circuit Mechanics**      |
| • Static Continuity        | Yes (Instant)     | Yes (Instant)    | Yes (Instant) | Yes (Instant)  | Yes (Instant)   | Yes (Instant)   | Yes (Instant)     | Yes (Instant)    | No (Continuous Laser)  | **No (Dynamic Signal Stream)**      |
| • Traveling Pulses         | No                | No               | No            | No             | No              | No              | No                | No               | Yes (Laser Beam)       | **Yes (Real-time Pulses)**          |
| • Module Transform         | No                | No               | No            | No             | No              | No              | No (Passive Load) | No               | Yes (Prism split)      | **Yes (Gates, Filters, Inverters)** |
| • Signal Colors/Freq       | 2 Colors          | 1 Color          | 1 Color       | 1 Color        | 1 Flow (Water)  | 1 Flow (Water)  | 1 Current         | 1 Current        | 1 Color                | **Multi-Frequency / Bit-Width**     |
| • Short-Circuit Rule       | Yes (Color mix)   | No               | No            | No             | No              | No              | No                | Yes (Hazards)    | No                     | **Yes (Overload & Firewalls)**      |
| • Fixed Obstacles          | Bolted Tiles      | None             | None          | None           | Locked Pipes    | None            | Fixed Terminals   | Static Hazards   | Fixed Walls            | **Encrypted Nodes / ICs**           |
| **Progression & Content**  |
| • Total Levels             | ~40 (4 Ch.)       | 15 Levels        | Unknown       | 40 Levels      | 100 Levels      | ~30 Levels      | 50+ Levels        | 40+ Levels       | 100+ Endless           | **50 Curated + Daily Seed**         |
| • Move Par System          | Yes (Tracked)     | No               | No            | No             | No              | No              | No                | No               | No                     | **Yes (Optimization Rating)**       |
| • Timer Pressure           | Relaxed           | Relaxed          | Relaxed       | Strict Stars   | Relaxed         | Relaxed         | Relaxed           | Relaxed          | Real-time Defense      | **Dual Mode (Puzzle / Blitz)**      |
| • Level Select UI          | Grid Menu         | Linear           | Linear        | 4 Packs        | World Grid      | Linear          | Linear Map        | Linear Map       | Map Node Tree          | **Cyber Subnet Node Map**           |
| **Monetization & Systems** |
| • CrazyGames SDK           | No                | No               | No            | No             | Yes (Local)     | No              | Yes (Cloud)       | No               | Yes (Cloud)            | **Full SDK 3.0 (Cloud Saves)**      |
| • Rewarded Ad Hints        | Direct (Free)     | None             | None          | None           | Yes (Hints)     | None            | Yes (Power)       | Yes (Skips)      | Yes (Revives)          | **Yes (Trace Route & Overclock)**   |
| • Midroll Frequency        | 180s (Portal)     | 180s (Portal)    | 180s          | Ad-per-level   | None (Rewarded) | Ad-per-level    | 180s (Standard)   | Interstitials    | 180s (Standard)        | **180s Interval + 3m Grace**        |
| **Aesthetics & Audio**     |
| • Visual Theme             | Blueprint Minimal | Flat 2D Neon     | Flat Vector   | Plastic 2D     | Wood & Brass    | Generic Plumber | Clean Workshop    | Cartoon Electric | Sci-Fi Military        | **Dark Cyberpunk / Bloom Neon**     |
| • Audio Polish             | Mechanical Click  | WebAudio FX      | Basic Chime   | Stock Buzz     | Ambient Loop    | Stock Plumber   | Mechanical Hum    | Cartoon Zap      | Synthwave Defense      | **Adaptive Synth / Data Chimes**    |

---

## 2. In-Depth Architectural & Interaction Breakdown

### A. Input Ergonomics & Hitbox Reliability

```
[Interaction Paradigms in the Competitive Field]

1. Static Click-to-Rotate (Spark Path, Neon Lights, Pipe)
   [Player Click] ──> [Rotate +90°] ──> [Instant Connectivity Check]
   Friction: Overshooting requires 3 corrective clicks. High repetition fatigue.

2. Inventory-to-Grid Placement (Circuit Master, Pipe Puzzle)
   [Palette Drag] ──> [Grid Snap] ──> [Static Circuit Complete]
   Friction: Dragging on mobile touchscreens can obscure grid slots under player fingers.

3. Proposed Hybrid Signal Chain (Neon Circuit Hacker)
   [Desktop: Click to cycle OR Drag from Hotbar] / [Mobile: Large Target Tap-to-Place]
   ──> [Continuous Signal Simulation Loop: Tick-driven Pulses]
```

- **Rotational Overshoot Friction:** Spark Path, Neon Lights, and Pipe share a glaring input flaw: clicking rotates exclusively 90° clockwise. On mobile, if a player accidentally double-taps, they must tap twice more to return. _Neon Circuit Hacker_ must introduce **bidirectional interaction** (right-click or two-finger swipe counter-clockwise) and **visual preview on hover/touch hold**.
- **Touch Occlusion:** Drag-and-drop mechanics in _Circuit Master_ suffer on screens under 6 inches because the user's fingertip covers the grid target tile. _Neon Circuit Hacker_ solves this via an **elevated drag anchor** (rendering dragged modules 40px above the touch point) or **tap-select then tap-place**.

### B. Progression & Level Pacing Architecture

```
[Level Content Scaling]
Competitor Levels Available:
Neon Lights:    ███ 15
Pipe:           ██████ 30
Power Light:    ████████ 40
Wire Connect:   ████████ 40
Spark Path:     ████████ 40
Circuit Master: ██████████ 50
Pipe Puzzle:    ████████████████████ 100
Laser Ricochet: ████████████████████ 100+ Endless
Neon Circuit:   ██████████ 50 Core + Procedural Daily Subnet
```

- **Content Starvation vs Content Bloat:** _Neon Lights_ (15 levels) exhausts its content in a single casual session, resulting in zero D1 retention. Conversely, _Pipe Puzzle_ (100 levels) maintains high player satisfaction (9.3 rating) because it provides long-tail content with clear milestones.
- **The Move-Par Dilemma:** _Spark Path_ tracks moves against a "Par" score (e.g. Par 38 on Level 1), but provides no tangible reward for beating par, creating a disconnect between player effort and feedback. _Neon Circuit Hacker_ must tie Par to a **3-Bit Rating System (011, 110, 111)** that directly unlocks cosmetic circuit traces and hacker aliases.

---

## 3. White Space Analysis: The 6 Unexploited Market Gaps

### Gap 1: Dynamic Signal Processing vs. Static Line Matching

- **Current State:** 100% of direct competitors evaluate circuit completion as an instant graph connectivity boolean: `PathExists(Source, Sink) == true`.
- **The White Space:** Introducing **discrete traveling data packets (pulses)**. In _Neon Circuit Hacker_, signals take time to travel along traces. Players must route pulses through **Logic Modules (Inverters, Splitters, Amplifiers, Frequency Filters, Delay Buffers)** to match target terminal conditions (e.g. "Deliver 3 Blue Pulses and 1 Inverted Pulse simultaneously").

### Gap 2: Authentic Cyberpunk "Hacking" Fantasy

- **Current State:** Competitors use generic, sanitized metaphors: plumbing water (_Pipe_, _Pipe Puzzle_), home electricity (_Power Light_, _Circuit Master_), or abstract glow shapes (_Neon Lights_).
- **The White Space:** The browser gaming market on CrazyGames and Y8 has an enormous appetite for the **hacker fantasy** (e.g., bypassing firewalls, cracking ICE, penetrating corporate subnets). Framing circuit modules as **Exploit Payloads, Port Shifters, and Decryption Routines** instantly elevates player agency and thematic immersion.

### Gap 3: True Responsive Multi-Platform Viewport

- **Current State:** The market is fractured between vertical mobile portrait games running letterboxed on desktop (Construct-based _Pipe_, _Power Light_) and desktop WebGL games that refuse to load on mobile (_Pipe Puzzle_).
- **The White Space:** A purpose-built **16:9 Landscape responsive canvas** engineered with CSS viewport units and touch-optimized UI scale that runs with 60 FPS hardware acceleration on both desktop monitors and mobile Safari/Chrome.

### Gap 4: Rhythm & Timing Mechanics (The "Overclock" Dimension)

- **Current State:** Zero circuit competitors feature timing or clock-cycle mechanics. Every puzzle is completely static and turn-agnostic.
- **The White Space:** Integrating an optional **"Firewall Sweep"** or **Clock Pulse Generator**. Pulses can collide, cancel each other out, or combine into higher-tier signals if synced properly, borrowing the satisfaction of music sequencers and Zach-like automation games without overwhelming casual players.

### Gap 5: Non-Intrusive, High-Yield Monetization

- **Current State:** Aggressive, unheralded midrolls in _Power Light_ and _Pipe_ shatter player cognitive focus. In contrast, _Pipe Puzzle_ relies entirely on Rewarded Ads for Hints, achieving an exceptional 9.3 rating.
- **The White Space:** Adopting CrazyGames' gold standard: **a mandatory 3-minute ad-free introductory grace period**, clean interstitial placement strictly between subnet chapters (never during active puzzle solving), and high-utility Rewarded Ads ("Signal Trace Hint" or "Overclock Exploit").

### Gap 6: Modern Web SDK Integration & Cloud Persistence

- **Current State:** Older competitors rely on fragile LocalStorage or lack save states entirely (_Connector_ is completely broken). _Circuit Master_ stands out with `userProgressionSaveMessage: "cloud"` via the CrazyGames SDK.
- **The White Space:** Full implementation of **CrazyGames SDK v3** (User Account Cloud Sync, System Mute hooks, Rewarded Callbacks) alongside **Y8 Account Integration** (Leaderboards and Save API).

---

## 4. Key Takeaways for Neon Circuit Hacker

1. **Do not build a generic pipe rotator.** Static line matching is oversupplied and yields low player retention.
2. **Double down on the Signal Chain.** Visualized data packets moving through transformational modules create emergent puzzle depth and hypnotic visual feedback.
3. **Target 50 tightly designed levels across 5 Subnet Chapters**, supported by an infinite "Daily Breach" seeded level generator.
4. **Build native 16:9 Landscape.** Dominate desktop web portals while offering zero-friction mobile browser play.
5. **Protect the player's flow state.** Keep ads strictly in natural downtime (level transitions) and monetize heavily through high-value Rewarded Hints.
