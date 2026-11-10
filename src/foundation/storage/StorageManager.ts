import { IStorageAdapter } from './StorageAdapter';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { CurrentSaveData, DEFAULT_SAVE_DATA, GameSettings, PlayerProgress } from './SaveSchema';
import { MigrationManager } from './MigrationManager';

export type SaveChangeCallback = (data: CurrentSaveData) => void;

export class StorageManager {
  private static instance: StorageManager | null = null;
  private adapter: IStorageAdapter;
  private migrationManager: MigrationManager;
  private saveKey = 'neon_circuit_hacker_save';
  private cachedData: CurrentSaveData;
  private isLoaded = false;
  private listeners: Set<SaveChangeCallback> = new Set();

  private constructor(adapter?: IStorageAdapter) {
    this.adapter = adapter || new LocalStorageAdapter();
    this.migrationManager = new MigrationManager();
    this.cachedData = { ...DEFAULT_SAVE_DATA, timestamp: Date.now() };
  }

  public static getInstance(adapter?: IStorageAdapter): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager(adapter);
    }
    return StorageManager.instance;
  }

  public static resetInstance(): void {
    StorageManager.instance = null;
  }

  public async initialize(): Promise<CurrentSaveData> {
    if (this.isLoaded) return this.cachedData;

    try {
      const rawString = await this.adapter.getItem(this.saveKey);
      if (rawString) {
        const parsed = JSON.parse(rawString);
        this.cachedData = this.migrationManager.migrate(parsed);
      } else {
        this.cachedData = { ...DEFAULT_SAVE_DATA, timestamp: Date.now() };
        await this.persist();
      }
    } catch (e) {
      console.warn('[StorageManager] Failed to load save data, using defaults:', e);
      this.cachedData = { ...DEFAULT_SAVE_DATA, timestamp: Date.now() };
    }

    this.isLoaded = true;
    return this.cachedData;
  }

  public getSettings(): GameSettings {
    return { ...this.cachedData.settings };
  }

  public async updateSettings(partial: Partial<GameSettings>): Promise<GameSettings> {
    this.cachedData.settings = {
      ...this.cachedData.settings,
      ...partial
    };
    await this.persist();
    return this.getSettings();
  }

  public getProgress(): PlayerProgress {
    return { ...this.cachedData.progress };
  }

  public async updateProgress(partial: Partial<PlayerProgress>): Promise<PlayerProgress> {
    this.cachedData.progress = {
      ...this.cachedData.progress,
      ...partial
    };
    await this.persist();
    return this.getProgress();
  }

  public async markLevelCompleted(level: number, moves: number, stars = 3): Promise<void> {
    const progress = this.cachedData.progress;
    progress.currentLevel = Math.max(progress.currentLevel, level + 1);
    progress.highestUnlockedLevel = Math.max(progress.highestUnlockedLevel, level + 1);

    const prevStars = progress.levelStars[level] || 0;
    progress.levelStars[level] = Math.max(prevStars, stars);

    const prevBestMoves = progress.levelScores[level] || Infinity;
    progress.levelScores[level] = Math.min(prevBestMoves, moves);

    await this.persist();
  }

  public async resetAll(): Promise<void> {
    this.cachedData = { ...DEFAULT_SAVE_DATA, timestamp: Date.now() };
    await this.persist();
  }

  public exportSaveJSON(): string {
    return JSON.stringify(this.cachedData, null, 2);
  }

  public async importSaveJSON(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      this.cachedData = this.migrationManager.migrate(parsed);
      await this.persist();
      return true;
    } catch (e) {
      console.error('[StorageManager] Import failed: Invalid JSON format', e);
      return false;
    }
  }

  public onSaveChange(callback: SaveChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private async persist(): Promise<void> {
    this.cachedData.timestamp = Date.now();
    try {
      const payload = JSON.stringify(this.cachedData);
      await this.adapter.setItem(this.saveKey, payload);
      this.notifyListeners();
    } catch (e) {
      console.error('[StorageManager] Persist failed:', e);
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener({ ...this.cachedData });
      } catch (err) {
        console.error('Error in save change listener:', err);
      }
    }
  }
}
