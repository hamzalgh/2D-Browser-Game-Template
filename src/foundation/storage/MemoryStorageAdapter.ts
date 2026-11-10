import { IStorageAdapter } from './StorageAdapter';

export class MemoryStorageAdapter implements IStorageAdapter {
  private storage: Map<string, string> = new Map();

  public async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) ?? null;
  }

  public async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  public async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  public async clear(): Promise<void> {
    this.storage.clear();
  }
}
