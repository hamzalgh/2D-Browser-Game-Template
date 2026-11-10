export type PlatformId = 'standalone' | 'crazygames' | 'y8';

export interface PlatformUser {
  id: string;
  username: string;
  avatarUrl?: string;
}

export type AdType = 'midroll' | 'rewarded';

export interface AdResult {
  success: boolean;
  type: AdType;
  error?: string;
}

export interface RewardedAdResult extends AdResult {
  rewardGranted: boolean;
}

export interface PlatformConfig {
  midrollCooldownMs?: number; // Default 180,000ms
  initialGracePeriodMs?: number; // Default 180,000ms
  enableMocks?: boolean;
}
