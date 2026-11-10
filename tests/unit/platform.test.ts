import { describe, it, expect, beforeEach } from 'vitest';
import {
  PlatformManager,
  MockPlatformAdapter,
  CrazyGamesAdapter,
  Y8Adapter
} from '../../src/foundation/platform';

describe('Platform Integration & Local Mocks', () => {
  beforeEach(() => {
    PlatformManager.resetInstance();
  });

  it('initializes MockPlatformAdapter in local development', async () => {
    const mock = new MockPlatformAdapter();
    const manager = PlatformManager.getInstance(mock);
    await manager.initialize();

    expect(manager.getPlatformId()).toBe('standalone');
    expect(manager.isMock()).toBe(true);
  });

  it('handles simulated rewarded ad flow and grants reward', async () => {
    const mock = new MockPlatformAdapter();
    const manager = PlatformManager.getInstance(mock);
    await manager.initialize();

    const result = await manager.showRewarded();
    expect(result.type).toBe('rewarded');
    expect(result.rewardGranted).toBe(true);
    expect(result.success).toBe(true);
  });

  it('safely handles cloud data persistence in mock adapter', async () => {
    const mock = new MockPlatformAdapter();
    await mock.saveCloudData('test_slot', JSON.stringify({ score: 500 }));

    const loaded = await mock.loadCloudData('test_slot');
    expect(loaded).toBeDefined();
    expect(JSON.parse(loaded!)).toEqual({ score: 500 });
  });

  it('initializes CrazyGamesAdapter in fallback mode without breaking', async () => {
    const cg = new CrazyGamesAdapter();
    expect(cg.id).toBe('crazygames');
    expect(cg.isMock).toBe(true); // Window.Crazygames is not present in test env

    await expect(cg.initialize()).resolves.toBeUndefined();
    expect(await cg.hasAdblock()).toBe(false);
    expect(await cg.getUser()).toBeNull();
  });

  it('initializes Y8Adapter in fallback mode without breaking', async () => {
    const y8 = new Y8Adapter();
    expect(y8.id).toBe('y8');
    expect(y8.isMock).toBe(true);

    await expect(y8.initialize()).resolves.toBeUndefined();
    const midroll = await y8.showMidroll();
    expect(midroll.success).toBe(true);
  });
});
