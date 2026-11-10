import { StorageManager } from '../storage';
import { SynthAudioGenerator } from './SynthAudioGenerator';

export type SfxType = 'click' | 'rotate' | 'pulse' | 'connect' | 'error' | 'victory';

export class AudioManager {
  private static instance: AudioManager | null = null;
  private synth: SynthAudioGenerator;
  private isUnlocked = false;

  private constructor() {
    this.synth = new SynthAudioGenerator();
    this.setupInteractionUnlock();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public static resetInstance(): void {
    AudioManager.instance = null;
  }

  private setupInteractionUnlock(): void {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      if (!this.isUnlocked) {
        this.synth.resume();
        this.isUnlocked = true;
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  public playSfx(type: SfxType): void {
    const settings = StorageManager.getInstance().getSettings();
    if (settings.sfxMuted) return;

    const effectiveVolume = settings.masterVolume * settings.sfxVolume;
    if (effectiveVolume <= 0) return;

    this.synth.resume();

    switch (type) {
      case 'click':
        this.synth.playClick(effectiveVolume);
        break;
      case 'rotate':
        this.synth.playRotate(effectiveVolume);
        break;
      case 'pulse':
        this.synth.playPulse(effectiveVolume);
        break;
      case 'connect':
        this.synth.playConnect(effectiveVolume);
        break;
      case 'error':
        this.synth.playError(effectiveVolume);
        break;
      case 'victory':
        this.synth.playVictory(effectiveVolume);
        break;
    }
  }

  public toggleSfxMute(): boolean {
    const storage = StorageManager.getInstance();
    const settings = storage.getSettings();
    const newMuted = !settings.sfxMuted;
    storage.updateSettings({ sfxMuted: newMuted });
    return newMuted;
  }

  public toggleMusicMute(): boolean {
    const storage = StorageManager.getInstance();
    const settings = storage.getSettings();
    const newMuted = !settings.musicMuted;
    storage.updateSettings({ musicMuted: newMuted });
    return newMuted;
  }

  public setMasterVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    StorageManager.getInstance().updateSettings({ masterVolume: clamped });
  }

  public setSfxVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    StorageManager.getInstance().updateSettings({ sfxVolume: clamped });
  }

  public setMusicVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    StorageManager.getInstance().updateSettings({ musicVolume: clamped });
  }
}
