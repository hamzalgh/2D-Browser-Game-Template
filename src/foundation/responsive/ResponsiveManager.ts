import Phaser from 'phaser';
import { DeviceOrientation, ViewportDimensions } from './Orientation';
import { SafeAreaManager } from './SafeArea';

export type ViewportChangeCallback = (dimensions: ViewportDimensions) => void;

export class ResponsiveManager {
  private static instance: ResponsiveManager | null = null;
  private game: Phaser.Game | null = null;
  private listeners: Set<ViewportChangeCallback> = new Set();
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;

  private currentDimensions: ViewportDimensions = {
    width: 1280,
    height: 720,
    devicePixelRatio: 1,
    orientation: DeviceOrientation.Landscape,
    aspectRatio: 16 / 9,
    isMobile: false
  };

  private constructor() {
    this.initEventListeners();
    this.updateDimensions();
  }

  public static getInstance(): ResponsiveManager {
    if (!ResponsiveManager.instance) {
      ResponsiveManager.instance = new ResponsiveManager();
    }
    return ResponsiveManager.instance;
  }

  public static resetInstance(): void {
    ResponsiveManager.instance = null;
  }

  public setGame(game: Phaser.Game): void {
    this.game = game;
  }

  public getDimensions(): ViewportDimensions {
    return { ...this.currentDimensions };
  }

  public onViewportChange(callback: ViewportChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Toggles native browser fullscreen safely across desktop and mobile vendors.
   */
  public async toggleFullscreen(): Promise<boolean> {
    if (typeof document === 'undefined') return false;

    try {
      if (!document.fullscreenElement) {
        const root = document.documentElement;
        if (root.requestFullscreen) {
          await root.requestFullscreen();
        } else if (
          (root as unknown as { webkitRequestFullscreen?: () => Promise<void> })
            .webkitRequestFullscreen
        ) {
          await (
            root as unknown as { webkitRequestFullscreen: () => Promise<void> }
          ).webkitRequestFullscreen();
        }
        return true;
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (
          (document as unknown as { webkitExitFullscreen?: () => Promise<void> })
            .webkitExitFullscreen
        ) {
          await (
            document as unknown as { webkitExitFullscreen: () => Promise<void> }
          ).webkitExitFullscreen();
        }
        return false;
      }
    } catch (err) {
      console.warn('Fullscreen toggle request was blocked or unsupported:', err);
      return false;
    }
  }

  private initEventListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', this.handleResizeDebounced.bind(this));
    window.addEventListener('orientationchange', this.handleResizeDebounced.bind(this));

    // Mobile scroll / address bar jumping prevention
    window.addEventListener(
      'touchmove',
      event => {
        // Prevent default scrolling on canvas container
        if ((event.target as HTMLElement)?.closest('#game-container')) {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    // Visibility / tab focus change handling
    document.addEventListener('visibilitychange', () => {
      const isHidden = document.hidden;
      if (this.game) {
        if (isHidden) {
          this.game.sound.pauseAll();
        } else {
          this.game.sound.resumeAll();
        }
      }
    });

    SafeAreaManager.syncWithDOM();
  }

  private handleResizeDebounced(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.updateDimensions();
    }, 100);
  }

  public updateDimensions(): void {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth || 1280;
    const height = window.innerHeight || 720;
    const dpr = window.devicePixelRatio || 1;
    const isMobile =
      /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) || width < 768;
    const orientation = width >= height ? DeviceOrientation.Landscape : DeviceOrientation.Portrait;
    const aspectRatio = width / (height || 1);

    this.currentDimensions = {
      width,
      height,
      devicePixelRatio: dpr,
      orientation,
      aspectRatio,
      isMobile
    };

    // Update orientation warning visibility
    this.syncOrientationWarning(orientation, isMobile);

    // Update HTML overlay viewport badge
    this.syncViewportBadge(width, height, aspectRatio);

    // Notify listeners
    for (const listener of this.listeners) {
      try {
        listener(this.currentDimensions);
      } catch (err) {
        console.error('Error in viewport change listener:', err);
      }
    }
  }

  private syncOrientationWarning(orientation: DeviceOrientation, isMobile: boolean): void {
    if (typeof document === 'undefined') return;
    const warningEl = document.getElementById('orientation-warning');
    if (!warningEl) return;

    // Show warning on mobile when held vertically (portrait)
    if (isMobile && orientation === DeviceOrientation.Portrait) {
      warningEl.classList.remove('hidden');
    } else {
      warningEl.classList.add('hidden');
    }
  }

  private syncViewportBadge(width: number, height: number, ratio: number): void {
    if (typeof document === 'undefined') return;
    const badge = document.getElementById('ui-viewport-info');
    if (!badge) return;

    const ratioStr = ratio.toFixed(2);
    badge.textContent = `${width}x${height} (${ratioStr}:1)`;
  }
}
