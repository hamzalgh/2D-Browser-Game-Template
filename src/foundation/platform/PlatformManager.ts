import { IPlatformAdapter } from './IPlatformAdapter';
import { MockPlatformAdapter } from './MockPlatformAdapter';
import { CrazyGamesAdapter } from './CrazyGamesAdapter';
import { Y8Adapter } from './Y8Adapter';
import { PlatformId, PlatformUser, AdResult, RewardedAdResult } from './PlatformTypes';

export class PlatformManager {
  private static instance: PlatformManager | null = null;
  private adapter: IPlatformAdapter;

  private constructor(customAdapter?: IPlatformAdapter) {
    this.adapter = customAdapter || this.detectPlatform();
  }

  public static getInstance(customAdapter?: IPlatformAdapter): PlatformManager {
    if (!PlatformManager.instance) {
      PlatformManager.instance = new PlatformManager(customAdapter);
    }
    return PlatformManager.instance;
  }

  public static resetInstance(): void {
    PlatformManager.instance = null;
  }

  public async initialize(): Promise<void> {
    await this.adapter.initialize();
    this.syncPlatformBadge();
  }

  public getAdapter(): IPlatformAdapter {
    return this.adapter;
  }

  public getPlatformId(): PlatformId {
    return this.adapter.id;
  }

  public isMock(): boolean {
    return this.adapter.isMock;
  }

  public gameplayStart(): void {
    this.adapter.gameplayStart();
  }

  public gameplayStop(): void {
    this.adapter.gameplayStop();
  }

  public async showMidroll(): Promise<AdResult> {
    return this.adapter.showMidroll();
  }

  public async showRewarded(): Promise<RewardedAdResult> {
    return this.adapter.showRewarded();
  }

  public async getUser(): Promise<PlatformUser | null> {
    return this.adapter.getUser();
  }

  public async loadCloudData(key: string): Promise<string | null> {
    return this.adapter.loadCloudData(key);
  }

  public async saveCloudData(key: string, data: string): Promise<boolean> {
    return this.adapter.saveCloudData(key, data);
  }

  private detectPlatform(): IPlatformAdapter {
    if (typeof window === 'undefined') {
      return new MockPlatformAdapter();
    }

    const searchParams = new URLSearchParams(window.location.search);
    const platformParam = searchParams.get('platform')?.toLowerCase();
    const isExplicitMock = searchParams.get('mock') === 'true';

    if (isExplicitMock) {
      return new MockPlatformAdapter();
    }

    if (platformParam === 'crazygames' || window.location.hostname.includes('crazygames')) {
      return new CrazyGamesAdapter();
    }

    if (platformParam === 'y8' || window.location.hostname.includes('y8.com')) {
      return new Y8Adapter();
    }

    // Default to local mock adapter
    return new MockPlatformAdapter();
  }

  private syncPlatformBadge(): void {
    if (typeof document === 'undefined') return;
    const badge = document.getElementById('ui-platform-badge');
    if (!badge) return;

    const id = this.adapter.id.toUpperCase();
    const mockSuffix = this.adapter.isMock ? ' (MOCK)' : '';
    badge.textContent = `${id}${mockSuffix}`;
  }
}
