import { describe, it, expect, beforeEach } from 'vitest';
import {
  ResponsiveManager,
  DeviceOrientation,
  SafeAreaManager
} from '../../src/foundation/responsive';

describe('ResponsiveManager & SafeArea', () => {
  beforeEach(() => {
    ResponsiveManager.resetInstance();
  });

  it('initializes dimensions and detects landscape on standard desktop viewport', () => {
    const manager = ResponsiveManager.getInstance();
    const dims = manager.getDimensions();

    expect(dims).toBeDefined();
    expect(dims.width).toBeGreaterThan(0);
    expect(dims.height).toBeGreaterThan(0);
    expect(dims.aspectRatio).toBeGreaterThan(0);
    expect(dims.orientation).toBe(DeviceOrientation.Landscape);
    expect(typeof dims.isMobile).toBe('boolean');
  });

  it('calculates safe area insets safely', () => {
    const insets = SafeAreaManager.getInsets();
    expect(insets).toEqual({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    });
  });

  it('notifies listeners when dimensions change', () => {
    const manager = ResponsiveManager.getInstance();
    let triggered = false;

    const unsubscribe = manager.onViewportChange(dims => {
      triggered = true;
      expect(dims).toBeDefined();
    });

    manager.updateDimensions();
    expect(triggered).toBe(true);
    unsubscribe();
  });
});
