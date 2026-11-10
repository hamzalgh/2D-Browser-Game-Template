import { CurrentSaveData, DEFAULT_SAVE_DATA, CURRENT_SAVE_VERSION } from './SaveSchema';

export type MigrationFunction = (oldData: Record<string, unknown>) => Record<string, unknown>;

export class MigrationManager {
  private migrations: Map<number, MigrationFunction> = new Map();

  constructor() {
    this.registerDefaultMigrations();
  }

  private registerDefaultMigrations(): void {
    // Example: future v1 -> v2 migration hook
    // this.registerMigration(1, (v1Data) => ({ ...v1Data, version: 2 }));
  }

  public registerMigration(fromVersion: number, migrationFn: MigrationFunction): void {
    this.migrations.set(fromVersion, migrationFn);
  }

  /**
   * Upgrades raw parsed JSON data through all migration steps until it matches CURRENT_SAVE_VERSION.
   */
  public migrate(rawData: unknown): CurrentSaveData {
    if (!rawData || typeof rawData !== 'object') {
      return { ...DEFAULT_SAVE_DATA, timestamp: Date.now() };
    }

    let data = { ...(rawData as Record<string, unknown>) };
    const version = typeof data.version === 'number' ? data.version : 0;

    if (version === CURRENT_SAVE_VERSION) {
      return this.validateAndFillDefaults(data as unknown as CurrentSaveData);
    }

    let currentVer = version;
    while (currentVer < CURRENT_SAVE_VERSION) {
      const migration = this.migrations.get(currentVer);
      if (!migration) {
        console.warn(
          `[MigrationManager] Missing migration from v${currentVer} to v${currentVer + 1}. Resetting to default save.`
        );
        return { ...DEFAULT_SAVE_DATA, timestamp: Date.now() };
      }
      data = migration(data);
      currentVer++;
    }

    return this.validateAndFillDefaults(data as unknown as CurrentSaveData);
  }

  private validateAndFillDefaults(data: CurrentSaveData): CurrentSaveData {
    return {
      version: CURRENT_SAVE_VERSION,
      timestamp: data.timestamp || Date.now(),
      settings: {
        ...DEFAULT_SAVE_DATA.settings,
        ...(data.settings || {})
      },
      progress: {
        ...DEFAULT_SAVE_DATA.progress,
        ...(data.progress || {})
      }
    };
  }
}
