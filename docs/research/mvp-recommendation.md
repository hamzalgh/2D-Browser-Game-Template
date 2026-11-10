# MVP Product Recommendation & Validation Experiment: Neon Circuit Hacker

**Document Version:** 1.0.0  
**Date:** November 10, 2026  
**Status:** Approved for Production Specification  
**Target Portals:** CrazyGames & Y8 (Desktop Web & Mobile Web)  
**Author:** Lead Game Designer & Commercial Product Analyst

---

## 1. Executive Recommendation

We recommend greenlighting **Direction 1: Cyber-Heist Pulse Conductor** as the Minimum Viable Product (MVP) for **Neon Circuit Hacker**.

```
                           [MVP VISION STATEMENT]
"Neon Circuit Hacker is a sleek, neon-infused logic puzzle where players route
 dynamic data pulses through transformational hacking modules to crack corporate
 mainframes, evading security sweeps through precise signal synchronization."
```

### Strategic Justification Summary

1. **Solves the Core Market Flaw:** Existing competitors (_Spark Path_, _Neon Lights_, _Pipe_) rely on dead, static continuity checks. The Signal Chain mechanic introduces **mesmerizing, living data packets** that transform circuit games from tedious trial-and-error clicking into satisfying causal engineering.
2. **Proven Player Appetite:** _Pipe Puzzle_ (9.3 rating on CrazyGames with 5.7k votes) and _Wire Connect_ (9.2 rating on Y8) prove that players reward spatial manipulation and dynamic physics over binary tile rotation.
3. **Flawless Multi-Platform Fit:** Unlike _Pipe Puzzle_ (which abandoned mobile web due to heavy Unity WebGL dependencies) or _Power Light_ (which defaulted to mobile portrait letterboxing), our lightweight 16:9 responsive 2D canvas guarantees 60 FPS performance across desktop and mobile browsers alike.
4. **Commercial Optimization:** Built ground-up for **CrazyGames SDK v3** and **Y8 API**, with high-value Rewarded Ads ("Signal Trace Hint" and "EMP Decoy") that respect player cognitive focus.

---

## 2. MVP Scope & Architectural Specification

```
[System Architecture: Neon Circuit Hacker MVP]

┌────────────────────────────────────────────────────────────────────────┐
│ UI Layer: Terminal Breadcrumbs | Move Optimization Par | Rewarded Hint │
├────────────────────────────────────────────────────────────────────────┤
│ Board Canvas (16:9 Responsive Grid: 5x5 to 8x6 Cells)                  │
│                                                                        │
│  [Pulse Emitter] ──(2 Hz Cyan)──► [Splitter] ──┬──► [Delay Buffer]     │
│                                                │          │            │
│  [Watchdog ICE Zone] ◄──(Sweeps every 3s)─────┼──────────┘            │
│                                                ▼                       │
│                                     [Mainframe Core Terminal]          │
├────────────────────────────────────────────────────────────────────────┤
│ Control Palette: Module Inventory (Drag-to-Grid or Tap-to-Place)       │
└────────────────────────────────────────────────────────────────────────┘
```

### A. Viewport & Technical Stack

- **Engine / Library:** HTML5 2D WebGL/Canvas renderer (Phaser 3 or PixiJS lightweight core).
- **Target Asset Footprint:** Under **5.0 MB total compressed bundle** (ensures sub-2-second load times on mobile 4G networks).
- **Coordinate Space:** Native 1280×720 virtual resolution, dynamically scaled via CSS letterboxing/pillarboxing with zero aspect ratio distortion across screens from 320px smartphones to 4K monitors.
- **Frame Rate Target:** Rock-solid 60 FPS on low-end hardware (e.g., Chromebooks, iPhone 8, budget Android devices).

### B. Core Component Palette (MVP Release)

The MVP limits module complexity to a carefully balanced set of 7 interconnected components:

1. **Pulse Emitter (Source):** Generates discrete data packets at a fixed frequency (1 pulse per second). Emitters emit specific color frequencies (Cyan = Data, Magenta = Encrypted).
2. **Conductive Traces & 90° Bends:** Static and rotatable circuit tracks that guide pulses along the grid.
3. **Splitter (1:2 Demux):** Splits 1 incoming pulse into 2 simultaneous orthogonal pulses.
4. **Phase Inverter (NOT Gate):** Transmutes pulse polarity (transforms Cyan Data pulses into Magenta Encrypted pulses, and vice versa).
5. **Delay Buffer (1-Tick Capacitor):** Holds an incoming pulse for exactly 1 beat (1 second) before releasing it, enabling temporal synchronization.
6. **Watchdog ICE (Hazard Scanner):** A security sweep beam that moves across designated grid lanes. If a pulse crosses a node while the sweep is active, the pulse is scrubbed, triggering an alarm state.
7. **Mainframe Core (Target Sink):** The victory terminal. Demands specific arrival criteria to crack (e.g., _"Accepts 2 Cyan Pulses and 1 Magenta Pulse in the same beat"_).

### C. Controls & Ergonomics

- **Dual Input Architecture:**
  - **Desktop:** Left-click to place or rotate; right-click or scroll-wheel to counter-rotate; drag-and-drop from the bottom module inventory.
  - **Mobile Touch:** Tap module in bottom palette to select, tap grid cell to place; tap placed module to rotate 90° clockwise; two-finger tap to clear.
- **Touch Buffer:** Grid cell hitboxes feature a 15% invisible padding margin to prevent mis-clicks on mobile glass.

### D. Content & Campaign Blueprint: 30 Curated Levels

The MVP campaign is structured into 3 distinct progression chapters designed for a complete 35–45 minute first-session experience:

```
[Campaign Progression Curve]
Chapter 1: Subnet Recon (Levels 1-10)     ──► Learn routing, emitters, core terminals.
Chapter 2: Logic Injection (Levels 11-20) ──► Master Splitters, Inverters, dual colors.
Chapter 3: System Overclock (Levels 21-30)──► Master Delay Buffers, Watchdogs, synchronized hits.
Endgame:    Daily Breach (Seeded)         ──► 1 New procedural puzzle generated daily.
```

- **Levels 1–10 (Subnet Recon):** Pure spatial routing. Introduces Emitters, Bends, and Terminals. Zero fail states; focused on positive reinforcement and tactile audio feedback.
- **Levels 11–20 (Logic Injection):** Introduces Splitters and Phase Inverters. Puzzles require splitting a single pulse to feed multiple terminals or flipping pulse colors to bypass filter gates.
- **Levels 21–30 (System Overclock):** Introduces Delay Buffers and sweeping Watchdog ICE. Puzzles require precision timing and synchronized multi-pulse delivery.
- **Bonus Feature (Daily Breach):** A seeded daily puzzle algorithm using level templates to provide long-term retention beyond the 30 core levels.

### E. Audio-Visual "Juice" & Cyberpunk Aesthetics

- **Visuals:** High-contrast dark cyber aesthetic. Pitch-black grid backdrop (`#0a0b10`) with glowing PCB trace lines (`#1a233a`). Traveling pulses use multi-stage bloom shaders with trailing light particles.
- **Audio:** Custom WebAudio synthesizer layer. Pulse travel produces soft rhythmic clicks; passing through modules generates harmonized pentatonic arpeggios; terminal completion triggers a bass-heavy, tactile drop.

### F. Commercial Integration & Monetization Hooks

- **CrazyGames SDK v3 Integration:**
  - `Crazygames.SDK.ad.requestAd('midroll')`: Enforce strict 180-second throttling, and zero ads during the first 3 minutes of gameplay. Midrolls fire _only_ on the victory screen of Levels 5, 10, 15, 20, 25.
  - `Crazygames.SDK.ad.requestAd('rewarded')`: Rewarded video ad unlocks **"Subnet Trace"** (draws the ghost path of the intended signal trajectory) or **"ICE Jammer"** (disables Watchdog scanners for the current attempt).
  - `Crazygames.SDK.user.saveData()`: Automatic background cloud progression save.
- **Y8 API Fallback:**
  - Wraps standard Y8 preroll wrapper and interstitial triggers using identical event hooks.

---

## 3. Playtesting & Validation Experiment Plan

To validate the MVP design before committing to post-launch content scaling, we define a controlled empirical playtesting experiment.

### A. Experiment Setup & Deployment

- **Platform:** CrazyGames Early Access / Unlisted Web Cohort on Itch.io & CrazyGames Developer Sandbox.
- **Sample Size:** 150–250 verified players (desktop and mobile web mix).
- **Build Configuration:** 30 levels with full telemetry instrumentation.

```
[Experiment Hypothesis & Funnel]
[100% Launch] ──► [90%+ Level 3 Clear] ──► [70%+ Level 10 Clear] ──► [28%+ Day 1 Return]
                                                        │
                                                        └──► Rewarded Ad Opt-in: >20%
```

### B. Core Hypotheses & Success Metrics

| Hypothesis                               | Target Metric                   | Measurement Method                                      | Benchmark / Pass Criteria                                                        |
| :--------------------------------------- | :------------------------------ | :------------------------------------------------------ | :------------------------------------------------------------------------------- |
| **H1: Strong Initial Engagement (FTUE)** | Level 1–5 Completion Rate       | Telemetry event: `level_complete` for Levels 1–5        | **> 85%** of players who start Level 1 finish Level 5 without dropping off.      |
| **H2: Signal Chain Mechanic Clarity**    | Level 11 (Splitter Intro) Churn | Telemetry event: Drop-off rate at Level 11              | **< 15%** drop-off on Level 11 (proves Splitter mechanic is intuitive).          |
| **H3: Commercial Value (Rewarded Ads)**  | Rewarded Hint Opt-In Rate       | Telemetry event: `rewarded_ad_watched` / `hint_clicked` | **> 20%** of active players voluntarily watch at least one rewarded hint ad.     |
| **H4: Non-Disruptive Ad Experience**     | Midroll Bounce Rate             | Portal telemetry: Tab close within 5s of midroll ad     | **< 8%** bounce rate during midroll interstitial displays.                       |
| **H5: Cross-Platform Ergonomics**        | Mobile vs Desktop Level Times   | Telemetry: Median `level_duration_seconds` by device    | Mobile solve duration within **±15%** of desktop duration (proves touch parity). |
| **H6: Long-Term Player Retention**       | Day 1 (D1) Return Rate          | Cloud save / Cookie return tracking after 24 hours      | **> 28% D1 Retention** (CrazyGames puzzle genre top quartile is >25%).           |

### C. Telemetry Event Instrumentation Schema

The game build will dispatch the following lightweight JSON payloads to our analytics endpoint:

```json
// Example: Level Complete Telemetry Event
{
  "event": "level_complete",
  "timestamp": 1794319200,
  "session_id": "usr_94f8a32b",
  "platform": "desktop_chrome",
  "data": {
    "level_id": 14,
    "duration_seconds": 42.6,
    "moves_used": 6,
    "move_par": 8,
    "hints_used": 0,
    "retries_count": 1,
    "watchdog_fails": 0,
    "fps_average": 59.8
  }
}
```

- `game_start`: Fired upon canvas initialization. Tracks screen resolution, user agent, and asset load time.
- `level_start`: Tracks level index and initial board state.
- `module_placed`: Tracks which module was placed, coordinates, and input method (mouse drag vs tap).
- `pulse_fired`: Tracks pulse trigger and resulting path trace.
- `pulse_collision` / `ice_intercept`: Tracks failure states to detect spikes in level difficulty.
- `hint_requested` & `rewarded_ad_completed`: Tracks monetization conversion.
- `rage_click_detected`: Fired if a player taps/clicks more than 5 times in 1 second on the same tile (signals player confusion or UI friction).

### D. Qualitative UX Evaluation Protocol

Following session completion, players are presented with a lightweight, 3-question in-game debrief modal:

1. _"How clear was how the signal modules worked?"_ (1: Completely Confusing — 5: Crystal Clear)
2. _"Did watching pulses travel make solving puzzles more satisfying?"_ (1: Annoying Delay — 5: Extremely Satisfying)
3. _"Would you return to play tomorrow's Daily Breach?"_ (Yes / Maybe / No)

---

## 4. Pre-Defined Decision Gates (Pivot / Kill / Scale)

To ensure commercial discipline, future development is governed by three strict empirical gates:

```
[Decision Gates Matrix]

                 ┌─────────────────────────────┐
                 │  Playtest Results Evaluated │
                 └──────────────┬──────────────┘
                                │
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
  [GATE A: SCALE]         [GATE B: PIVOT]          [GATE C: KILL]
  • D1 Retention ≥ 28%    • D1 Retention 18-27%    • D1 Retention < 18%
  • L1-5 Clear ≥ 85%      • High rage clicks on L11• L1-5 Clear < 65%
  • Rewarded Opt-in ≥ 20% • High bounce at ads     • Rating < 7.5
        │                       │                        │
        ▼                       ▼                        ▼
  Expand to 75 Levels,    Rework module UI,        Archive project;
  Deploy Daily Breach,    rebalance difficulty,    preserve engine
  Full Featured Launch.   adjust ad grace period.  components.
```

1. **Gate A: Full Commercial Rollout (Scale):**
   - _Thresholds:_ D1 Retention ≥ 28%, Level 1–5 Completion ≥ 85%, Rating ≥ 8.5/10.
   - _Action:_ Build out 45 additional levels (total 75 levels), deploy the automated Daily Breach procedural generator, integrate localized translations (Spanish, Russian, Portuguese, German for Y8), and submit for CrazyGames Featured placement.
2. **Gate B: Design Refinement (Pivot):**
   - _Thresholds:_ D1 Retention between 18%–27%, high rage clicks detected on Chapter 2 modules.
   - _Action:_ Simplify module rules, replace drag-and-drop entirely with tap-to-cycle, adjust Watchdog speed, and relax target synchronization windows.
3. **Gate C: Termination (Kill):**
   - _Thresholds:_ D1 Retention < 18%, Level 1–5 Completion < 65%, Rating < 7.5/10.
   - _Action:_ Immediately halt development; package core 2D signal pulse canvas engine into reusable open-source/internal library; redirect capital to alternative concepts.

---

## 5. Conclusion & Immediate Next Steps

The competitive research unequivocally demonstrates that web puzzle players are eager for an evolution beyond 1990s static pipe rotation. By executing **Neon Circuit Hacker** as a **Cyber-Heist Pulse Conductor**, we capitalize on an underserved white space on CrazyGames and Y8.

The architecture is lightweight, the MVP scope is disciplined and achievable within a 4-week production cycle, and our validation experiment establishes an airtight, data-driven path to commercial profitability.
