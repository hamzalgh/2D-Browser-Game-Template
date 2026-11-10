import { PlatformId, PlatformUser, AdResult, RewardedAdResult } from './PlatformTypes';

export interface IPlatformAdapter {
  readonly id: PlatformId;
  readonly isMock: boolean;

  initialize(): Promise<void>;

  // Lifecycle
  gameplayStart(): void;
  gameplayStop(): void;
  happyHour?(): void;

  // Ads
  showMidroll(): Promise<AdResult>;
  showRewarded(): Promise<RewardedAdResult>;
  hasAdblock(): Promise<boolean>;

  // User & Cloud Saves
  isUserAccountAvailable(): boolean;
  getUser(): Promise<PlatformUser | null>;
  loadCloudData(key: string): Promise<string | null>;
  saveCloudData(key: string, data: string): Promise<boolean>;
}
