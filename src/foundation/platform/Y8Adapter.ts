import { IPlatformAdapter } from './IPlatformAdapter';
import { PlatformId, PlatformUser, AdResult, RewardedAdResult } from './PlatformTypes';

interface Y8Global {
  adBreak?: (options: {
    type: string;
    name?: string;
    adBreakDone: (placementInfo: { breakStatus: string }) => void;
  }) => void;
  user?: {
    isLoggedIn?: () => boolean;
    name?: string;
    id?: string;
  };
}

export class Y8Adapter implements IPlatformAdapter {
  public readonly id: PlatformId = 'y8';
  public readonly isMock: boolean;

  private isInitialized = false;

  constructor() {
    this.isMock = typeof window === 'undefined' || !(window as unknown as { y8?: Y8Global }).y8;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    console.log('[Y8Adapter] Y8 Adapter initialized.');
    this.isInitialized = true;
  }

  public gameplayStart(): void {
    console.log('[Y8Adapter] gameplayStart() triggered.');
  }

  public gameplayStop(): void {
    console.log('[Y8Adapter] gameplayStop() triggered.');
  }

  public async showMidroll(): Promise<AdResult> {
    const y8 = typeof window !== 'undefined' ? (window as unknown as { y8?: Y8Global }).y8 : undefined;
    if (!y8?.adBreak) {
      console.log('[Y8Adapter] adBreak API not found, simulating completed ad.');
      return { success: true, type: 'midroll' };
    }

    return new Promise(resolve => {
      try {
        y8.adBreak!({
          type: 'next',
          name: 'level-change',
          adBreakDone: placementInfo => {
            const success = placementInfo.breakStatus !== 'dismissed';
            resolve({ success, type: 'midroll' });
          }
        });
      } catch (err) {
        resolve({ success: false, type: 'midroll', error: String(err) });
      }
    });
  }

  public async showRewarded(): Promise<RewardedAdResult> {
    const y8 = typeof window !== 'undefined' ? (window as unknown as { y8?: Y8Global }).y8 : undefined;
    if (!y8?.adBreak) {
      console.log('[Y8Adapter] adBreak API not found, granting reward.');
      return { success: true, type: 'rewarded', rewardGranted: true };
    }

    return new Promise(resolve => {
      try {
        y8.adBreak!({
          type: 'reward',
          name: 'hint-reward',
          adBreakDone: placementInfo => {
            const success = placementInfo.breakStatus === 'viewed';
            resolve({ success, type: 'rewarded', rewardGranted: success });
          }
        });
      } catch (err) {
        resolve({ success: false, type: 'rewarded', rewardGranted: false, error: String(err) });
      }
    });
  }

  public async hasAdblock(): Promise<boolean> {
    return false;
  }

  public isUserAccountAvailable(): boolean {
    const y8 = typeof window !== 'undefined' ? (window as unknown as { y8?: Y8Global }).y8 : undefined;
    return Boolean(y8?.user?.isLoggedIn && y8.user.isLoggedIn());
  }

  public async getUser(): Promise<PlatformUser | null> {
    const y8 = typeof window !== 'undefined' ? (window as unknown as { y8?: Y8Global }).y8 : undefined;
    if (this.isUserAccountAvailable() && y8?.user) {
      return {
        id: y8.user.id || 'y8_user',
        username: y8.user.name || 'Y8 Player'
      };
    }
    return null;
  }

  public async loadCloudData(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(`y8_cloud_${key}`);
    }
    return null;
  }

  public async saveCloudData(key: string, data: string): Promise<boolean> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`y8_cloud_${key}`, data);
      return true;
    }
    return false;
  }
}
