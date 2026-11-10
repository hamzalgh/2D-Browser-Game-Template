import { IPlatformAdapter } from './IPlatformAdapter';
import { PlatformId, PlatformUser, AdResult, RewardedAdResult } from './PlatformTypes';

// Partial interface for CrazyGames SDK v3 runtime
interface CrazyGamesSDK {
  init(): Promise<void>;
  game: {
    gameplayStart(): void;
    gameplayStop(): void;
    happytime(): void;
  };
  ad: {
    requestAd(
      type: 'midroll' | 'rewarded',
      callbacks?: {
        adStarted?: () => void;
        adFinished?: () => void;
        adError?: (error: unknown) => void;
      }
    ): Promise<void>;
    hasAdblock(): Promise<boolean>;
  };
  user: {
    isUserAccountAvailable(): boolean;
    getUser(): Promise<{ id: string; username: string; avatarUrl?: string } | null>;
  };
  data: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
  };
}

export class CrazyGamesAdapter implements IPlatformAdapter {
  public readonly id: PlatformId = 'crazygames';
  public readonly isMock: boolean;

  private sdk: CrazyGamesSDK | null = null;
  private isInitialized = false;

  constructor() {
    this.isMock = typeof window === 'undefined' || !(window as unknown as { Crazygames?: { SDK: CrazyGamesSDK } }).Crazygames;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (typeof window !== 'undefined') {
      const globalCG = (window as unknown as { Crazygames?: { SDK: CrazyGamesSDK } }).Crazygames;
      if (globalCG?.SDK) {
        this.sdk = globalCG.SDK;
        try {
          await this.sdk.init();
          console.log('[CrazyGamesAdapter] CrazyGames SDK initialized successfully.');
        } catch (e) {
          console.warn('[CrazyGamesAdapter] SDK init failed:', e);
        }
      } else {
        console.log('[CrazyGamesAdapter] CrazyGames SDK not detected. Operating in fallback mode.');
      }
    }

    this.isInitialized = true;
  }

  public gameplayStart(): void {
    try {
      this.sdk?.game?.gameplayStart();
    } catch (e) {
      console.warn('[CrazyGamesAdapter] gameplayStart error:', e);
    }
  }

  public gameplayStop(): void {
    try {
      this.sdk?.game?.gameplayStop();
    } catch (e) {
      console.warn('[CrazyGamesAdapter] gameplayStop error:', e);
    }
  }

  public happyHour(): void {
    try {
      this.sdk?.game?.happytime();
    } catch (e) {
      console.warn('[CrazyGamesAdapter] happytime error:', e);
    }
  }

  public async showMidroll(): Promise<AdResult> {
    if (!this.sdk) {
      return { success: false, type: 'midroll', error: 'SDK unavailable' };
    }

    return new Promise(resolve => {
      this.sdk!.ad.requestAd('midroll', {
        adStarted: () => console.log('[CrazyGamesAdapter] Midroll started'),
        adFinished: () => resolve({ success: true, type: 'midroll' }),
        adError: err => resolve({ success: false, type: 'midroll', error: String(err) })
      }).catch(err => {
        resolve({ success: false, type: 'midroll', error: String(err) });
      });
    });
  }

  public async showRewarded(): Promise<RewardedAdResult> {
    if (!this.sdk) {
      return { success: false, type: 'rewarded', rewardGranted: false, error: 'SDK unavailable' };
    }

    let completed = false;

    return new Promise(resolve => {
      this.sdk!.ad.requestAd('rewarded', {
        adStarted: () => console.log('[CrazyGamesAdapter] Rewarded ad started'),
        adFinished: () => {
          completed = true;
          resolve({ success: true, type: 'rewarded', rewardGranted: true });
        },
        adError: err => {
          resolve({ success: false, type: 'rewarded', rewardGranted: completed, error: String(err) });
        }
      }).catch(err => {
        resolve({ success: false, type: 'rewarded', rewardGranted: false, error: String(err) });
      });
    });
  }

  public async hasAdblock(): Promise<boolean> {
    if (!this.sdk) return false;
    try {
      return await this.sdk.ad.hasAdblock();
    } catch {
      return false;
    }
  }

  public isUserAccountAvailable(): boolean {
    return Boolean(this.sdk?.user?.isUserAccountAvailable());
  }

  public async getUser(): Promise<PlatformUser | null> {
    if (!this.sdk) return null;
    try {
      return await this.sdk.user.getUser();
    } catch {
      return null;
    }
  }

  public async loadCloudData(key: string): Promise<string | null> {
    if (!this.sdk) return null;
    try {
      return await this.sdk.data.getItem(key);
    } catch {
      return null;
    }
  }

  public async saveCloudData(key: string, data: string): Promise<boolean> {
    if (!this.sdk) return false;
    try {
      await this.sdk.data.setItem(key, data);
      return true;
    } catch {
      return false;
    }
  }
}
