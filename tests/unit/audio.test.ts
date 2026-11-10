import { describe, it, expect, beforeEach } from 'vitest';
import { AudioManager } from '../../src/foundation/audio';
import { StorageManager, MemoryStorageAdapter } from '../../src/foundation/storage';

describe('AudioManager & Procedural Synth', () => {
  beforeEach(async () => {
    StorageManager.resetInstance();
    AudioManager.resetInstance();
    const memory = new MemoryStorageAdapter();
    await StorageManager.getInstance(memory).initialize();
  });

  it('manages singleton instance and volume controls', () => {
    const audio = AudioManager.getInstance();
    const storage = StorageManager.getInstance();

    audio.setMasterVolume(0.4);
    expect(storage.getSettings().masterVolume).toBe(0.4);

    audio.setSfxVolume(0.6);
    expect(storage.getSettings().sfxVolume).toBe(0.6);

    audio.setMusicVolume(0.5);
    expect(storage.getSettings().musicVolume).toBe(0.5);
  });

  it('toggles sfx and music mute correctly', () => {
    const audio = AudioManager.getInstance();
    const storage = StorageManager.getInstance();

    expect(storage.getSettings().sfxMuted).toBe(false);
    const newSfxMute = audio.toggleSfxMute();
    expect(newSfxMute).toBe(true);
    expect(storage.getSettings().sfxMuted).toBe(true);

    expect(storage.getSettings().musicMuted).toBe(false);
    const newMusicMute = audio.toggleMusicMute();
    expect(newMusicMute).toBe(true);
    expect(storage.getSettings().musicMuted).toBe(true);
  });

  it('safely invokes procedural sfx without crashing when AudioContext is uninitialized in test environment', () => {
    const audio = AudioManager.getInstance();
    expect(() => {
      audio.playSfx('click');
      audio.playSfx('rotate');
      audio.playSfx('pulse');
      audio.playSfx('connect');
      audio.playSfx('error');
      audio.playSfx('victory');
    }).not.toThrow();
  });
});
