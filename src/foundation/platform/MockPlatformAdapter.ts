import { IPlatformAdapter } from './IPlatformAdapter';
import { PlatformId, PlatformUser, AdResult, RewardedAdResult } from './PlatformTypes';

export class MockPlatformAdapter implements IPlatformAdapter {
  public readonly id: PlatformId = 'standalone';
  public readonly isMock = true;

  private startTime: number = Date.now();
  private lastMidrollTime = 0;
  private midrollCooldownMs = 180000; // 3 minutes
  private initialGracePeriodMs = 180000; // 3 minutes
  private cloudStorage: Map<string, string> = new Map();
  private isAdPlaying = false;

  public async initialize(): Promise<void> {
    this.startTime = Date.now();
    console.log('[MockPlatformAdapter] Initialized in local development mode.');
  }

  public gameplayStart(): void {
    console.log('[MockPlatformAdapter] gameplayStart() called.');
  }

  public gameplayStop(): void {
    console.log('[MockPlatformAdapter] gameplayStop() called.');
  }

  public happyHour(): void {
    console.log('[MockPlatformAdapter] happyHour() called.');
  }

  public async showMidroll(): Promise<AdResult> {
    const elapsedSinceStart = Date.now() - this.startTime;
    const elapsedSinceLastAd = Date.now() - this.lastMidrollTime;

    // Honor commercial rules: grace period and cooldown
    if (elapsedSinceStart < this.initialGracePeriodMs) {
      console.log('[MockPlatformAdapter] Midroll skipped: Inside initial 3-minute grace period.');
      return { success: false, type: 'midroll', error: 'In initial grace period' };
    }

    if (elapsedSinceLastAd < this.midrollCooldownMs) {
      console.log('[MockPlatformAdapter] Midroll skipped: Throttled by 180s cooldown.');
      return { success: false, type: 'midroll', error: 'Throttled by cooldown' };
    }

    if (this.isAdPlaying) {
      return { success: false, type: 'midroll', error: 'Ad already playing' };
    }

    this.isAdPlaying = true;
    console.log('[MockPlatformAdapter] [AD] Simulating Midroll Interstitial Ad (1.5s)...');

    await this.renderSimulatedAdModal('MIDROLL INTERSTITIAL AD SIMULATION', 1500);

    this.isAdPlaying = false;
    this.lastMidrollTime = Date.now();
    return { success: true, type: 'midroll' };
  }

  public async showRewarded(): Promise<RewardedAdResult> {
    if (this.isAdPlaying) {
      return {
        success: false,
        type: 'rewarded',
        rewardGranted: false,
        error: 'Ad already playing'
      };
    }

    this.isAdPlaying = true;
    console.log('[MockPlatformAdapter] [AD] Simulating Rewarded Video Ad (2.0s)...');

    const completed = await this.renderSimulatedAdModal(
      'REWARDED VIDEO AD SIMULATION (HINT UNLOCK)',
      2000
    );

    this.isAdPlaying = false;
    return {
      success: completed,
      type: 'rewarded',
      rewardGranted: completed
    };
  }

  public async hasAdblock(): Promise<boolean> {
    return false;
  }

  public isUserAccountAvailable(): boolean {
    return true;
  }

  public async getUser(): Promise<PlatformUser | null> {
    return {
      id: 'local_dev_hacker_01',
      username: 'NetRunner_Local'
    };
  }

  public async loadCloudData(key: string): Promise<string | null> {
    return this.cloudStorage.get(key) || null;
  }

  public async saveCloudData(key: string, data: string): Promise<boolean> {
    this.cloudStorage.set(key, data);
    return true;
  }

  private renderSimulatedAdModal(title: string, durationMs: number): Promise<boolean> {
    return new Promise(resolve => {
      if (typeof document === 'undefined') {
        setTimeout(() => resolve(true), 50);
        return;
      }

      const modal = document.createElement('div');
      modal.className =
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 text-cyan-400 font-mono p-4';
      modal.innerHTML = `
        <div class="bg-slate-900 border border-cyan-500 rounded-lg p-6 max-w-sm text-center shadow-2xl">
          <div class="text-xs text-slate-400 uppercase tracking-widest mb-2">[PLATFORM MOCK AD]</div>
          <h3 class="text-base font-bold text-slate-100 mb-3">${title}</h3>
          <p class="text-xs text-slate-300 mb-4">Simulating ad break for local testing. Will auto-close...</p>
          <div class="w-full bg-slate-800 h-2 rounded overflow-hidden mb-4">
            <div id="mock-ad-progress" class="bg-cyan-400 h-full w-0 transition-all duration-300"></div>
          </div>
          <button id="mock-ad-skip" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs border border-slate-600 text-slate-200">
            Skip Simulation
          </button>
        </div>
      `;

      document.body.appendChild(modal);

      const progress = modal.querySelector('#mock-ad-progress') as HTMLElement;
      if (progress) {
        progress.style.transition = `width ${durationMs}ms linear`;
        setTimeout(() => {
          progress.style.width = '100%';
        }, 20);
      }

      const cleanup = (success: boolean) => {
        if (modal.parentElement) {
          modal.remove();
        }
        resolve(success);
      };

      const timer = setTimeout(() => cleanup(true), durationMs);

      const skipBtn = modal.querySelector('#mock-ad-skip');
      if (skipBtn) {
        skipBtn.addEventListener('click', () => {
          clearTimeout(timer);
          cleanup(true);
        });
      }
    });
  }
}
