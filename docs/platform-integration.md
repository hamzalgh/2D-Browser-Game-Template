# Platform Integration & Portal Publishing Guide

**Document Version:** 1.0.0  
**Supported Portals:** CrazyGames (SDK v3) & Y8 Games  
**Testing Strategy:** Zero-Account Local SDK Mocks

---

## 1. Unified Platform Contract (`IPlatformAdapter`)

To prevent portal-specific SDK calls from polluting gameplay scenes, all platform capabilities are normalized behind the `IPlatformAdapter` interface:

```typescript
export interface IPlatformAdapter {
  readonly id: PlatformId; // 'standalone' | 'crazygames' | 'y8'
  readonly isMock: boolean;

  initialize(): Promise<void>;

  // Gameplay Lifecycle (Analytics & Ad Tracking)
  gameplayStart(): void;
  gameplayStop(): void;
  happyHour?(): void;

  // Monetization (Midrolls & Rewarded Ads)
  showMidroll(): Promise<AdResult>;
  showRewarded(): Promise<RewardedAdResult>;
  hasAdblock(): Promise<boolean>;

  // Identity & Cloud Saves
  isUserAccountAvailable(): boolean;
  getUser(): Promise<PlatformUser | null>;
  loadCloudData(key: string): Promise<string | null>;
  saveCloudData(key: string, data: string): Promise<boolean>;
}
```

---

## 2. Local Development with `MockPlatformAdapter`

Developers do not need platform publisher accounts or live CDN domains to develop and test games locally.

When running on `localhost` (or passing `?mock=true`), `PlatformManager` automatically instantiates `MockPlatformAdapter`:

- **Simulated Midroll Ads:** Displays a temporary in-DOM modal showing a progress bar and countdown, followed by a simulated completion event.
- **Simulated Rewarded Ads:** Displays a rewarded video simulation modal with an option to skip or complete the ad, granting in-game rewards on completion.
- **Commercial Policy Enforcement:** Simulates CrazyGames' **mandatory 3-minute ad-free introductory grace period** and **180-second midroll throttling**.
- **Mock Cloud Storage:** Simulates asynchronous cloud save and load calls using an in-memory Map.

---

## 3. CrazyGames Integration (`CrazyGamesAdapter`)

CrazyGames is the premier web gaming portal for desktop and mobile HTML5 games. The foundation integrates natively with **CrazyGames SDK v3**:

```
[CrazyGames SDK v3 Integration Flow]

Game Lifecycle:
  GameScene.create()  ──► PlatformManager.gameplayStart() ──► Crazygames.SDK.game.gameplayStart()
  GameScene.destroy() ──► PlatformManager.gameplayStop()  ──► Crazygames.SDK.game.gameplayStop()

Ad Monetization:
  VictoryScreen.next() ──► PlatformManager.showMidroll()   ──► Crazygames.SDK.ad.requestAd('midroll')
  HintButton.click()   ──► PlatformManager.showRewarded()  ──► Crazygames.SDK.ad.requestAd('rewarded')

Cloud Progression:
  StorageManager.save() ──► PlatformManager.saveCloudData() ──► Crazygames.SDK.data.setItem(key, data)
```

### Policy Requirements Handled Automatically

1. **Ad-Free Grace Period:** No midroll ads are requested during the first 180 seconds of gameplay.
2. **Midroll Throttling:** Enforces a minimum interval of 180 seconds between consecutive midroll calls.
3. **Sound Management:** Automatically mutes Phaser WebAudio when an ad begins and restores original volumes upon ad completion.
4. **Cloud Account Sync:** Saves player progression to CrazyGames User Cloud if the player is logged into their CrazyGames account.

---

## 4. Y8 Integration (`Y8Adapter`)

Y8 relies on Google Ad Placement API (`adBreak`) and standard iframe messaging wrappers:

### Ad Placement Integration

- **Midroll Interstitials:** Invokes `window.y8.adBreak({ type: 'next', name: 'level-change' })`.
- **Rewarded Video Ads:** Invokes `window.y8.adBreak({ type: 'reward', name: 'hint-reward' })` and grants hints upon `placementInfo.breakStatus === 'viewed'`.
- **Account Verification:** Checks `window.y8.user.isLoggedIn()` to retrieve player usernames for leaderboards.

---

## 5. Platform Switching & Testing Flags

You can force specific platform adapters locally via URL query parameters:

| URL Query Parameter                          | Active Adapter        | Behavior                                                     |
| :------------------------------------------- | :-------------------- | :----------------------------------------------------------- |
| `http://localhost:3000/`                     | `MockPlatformAdapter` | Standalone local testing with simulated ads.                 |
| `http://localhost:3000/?platform=crazygames` | `CrazyGamesAdapter`   | Runs CrazyGames hooks (gracefully falls back if SDK absent). |
| `http://localhost:3000/?platform=y8`         | `Y8Adapter`           | Runs Y8 adBreak hooks (gracefully falls back if SDK absent). |
| `http://localhost:3000/?mock=true`           | `MockPlatformAdapter` | Forces local mock simulation regardless of domain.           |
