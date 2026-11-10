import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  StorageManager,
  MemoryStorageAdapter,
  MigrationManager,
  CURRENT_SAVE_VERSION,
  DEFAULT_SETTINGS
} from '../../src/foundation/storage';

describe('Storage & Migration System', () => {
  beforeEach(() => {
    StorageManager.resetInstance();
  });

  it('initializes with default save schema and settings', async () => {
    const memoryAdapter = new MemoryStorageAdapter();
    const storage = StorageManager.getInstance(memoryAdapter);

    const data = await storage.initialize();
    expect(data.version).toBe(CURRENT_SAVE_VERSION);
    expect(data.settings.masterVolume).toBe(DEFAULT_SETTINGS.masterVolume);
    expect(data.progress.currentLevel).toBe(1);
  });

  it('updates settings and persists changes', async () => {
    const memoryAdapter = new MemoryStorageAdapter();
    const storage = StorageManager.getInstance(memoryAdapter);
    await storage.initialize();

    await storage.updateSettings({ masterVolume: 0.5, sfxMuted: true });
    const settings = storage.getSettings();

    expect(settings.masterVolume).toBe(0.5);
    expect(settings.sfxMuted).toBe(true);
  });

  it('updates progress and tracks level completion statistics', async () => {
    const memoryAdapter = new MemoryStorageAdapter();
    const storage = StorageManager.getInstance(memoryAdapter);
    await storage.initialize();

    await storage.markLevelCompleted(1, 14, 3);
    const progress = storage.getProgress();

    expect(progress.currentLevel).toBe(2);
    expect(progress.highestUnlockedLevel).toBe(2);
    expect(progress.levelStars[1]).toBe(3);
    expect(progress.levelScores[1]).toBe(14);
  });

  it('exports and imports valid JSON save strings', async () => {
    const memoryAdapter = new MemoryStorageAdapter();
    const storage = StorageManager.getInstance(memoryAdapter);
    await storage.initialize();

    await storage.updateSettings({ highContrast: true });
    const exportedJSON = storage.exportSaveJSON();
    expect(exportedJSON).toContain('"highContrast": true');

    const imported = await storage.importSaveJSON(exportedJSON);
    expect(imported).toBe(true);
    expect(storage.getSettings().highContrast).toBe(true);
  });

  it('gracefully recovers from corrupt data in migration manager', () => {
    const migration = new MigrationManager();
    const recovered = migration.migrate('corrupt_non_json');

    expect(recovered.version).toBe(CURRENT_SAVE_VERSION);
    expect(recovered.settings).toBeDefined();
    expect(recovered.progress).toBeDefined();
  });

  it('notifies listeners when save data changes', async () => {
    const memoryAdapter = new MemoryStorageAdapter();
    const storage = StorageManager.getInstance(memoryAdapter);
    await storage.initialize();

    const listener = vi.fn();
    const unsubscribe = storage.onSaveChange(listener);

    await storage.updateSettings({ screenShake: false });
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });
});
