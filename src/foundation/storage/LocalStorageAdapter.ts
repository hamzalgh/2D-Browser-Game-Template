import { IStorageAdapter } from './StorageAdapter';

export class LocalStorageAdapter implements IStorageAdapter {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public async getItem(key: string): Promise<string | null> {
    if (!this.isAvailable) return null;
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Read error for key "${key}":`, e);
      return null;
    }
  }

  public async setItem(key: string, value: string): Promise<void> {
    if (!this.isAvailable) return;
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Write error for key "${key}":`, e);
    }
  }

  public async removeItem(key: string): Promise<void> {
    if (!this.isAvailable) return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Remove error for key "${key}":`, e);
    }
  }

  public async clear(): Promise<void> {
    if (!this.isAvailable) return;
    try {
      window.localStorage.clear();
    } catch (e) {
      console.warn('[LocalStorageAdapter] Clear error:', e);
    }
  }
}
