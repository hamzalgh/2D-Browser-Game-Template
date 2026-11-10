import { IAnalyticsAdapter } from './IAnalyticsAdapter';
import { ConsoleAnalyticsAdapter } from './ConsoleAnalyticsAdapter';
import { AnalyticsEvent, AnalyticsEventParams, StandardAnalyticsEvent } from './AnalyticsTypes';

export class AnalyticsManager {
  private static instance: AnalyticsManager | null = null;
  private adapters: Set<IAnalyticsAdapter> = new Set();
  private sessionId: string;
  private sessionStartTime: number;

  private constructor(defaultAdapter?: IAnalyticsAdapter) {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();

    const initialAdapter = defaultAdapter || new ConsoleAnalyticsAdapter();
    this.registerAdapter(initialAdapter);
  }

  public static getInstance(defaultAdapter?: IAnalyticsAdapter): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager(defaultAdapter);
    }
    return AnalyticsManager.instance;
  }

  public static resetInstance(): void {
    AnalyticsManager.instance = null;
  }

  public registerAdapter(adapter: IAnalyticsAdapter): void {
    this.adapters.add(adapter);
  }

  public removeAdapter(adapterName: string): void {
    for (const adapter of this.adapters) {
      if (adapter.name === adapterName) {
        this.adapters.delete(adapter);
      }
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public track(
    eventName: string | StandardAnalyticsEvent,
    params: AnalyticsEventParams = {}
  ): void {
    const enrichedParams: AnalyticsEventParams = {
      ...params,
      session_duration_s: Math.round((Date.now() - this.sessionStartTime) / 1000)
    };

    if (typeof window !== 'undefined') {
      enrichedParams.viewport_w = window.innerWidth;
      enrichedParams.viewport_h = window.innerHeight;
      enrichedParams.dpr = window.devicePixelRatio;
    }

    const event: AnalyticsEvent = {
      name: eventName,
      params: enrichedParams,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    for (const adapter of this.adapters) {
      try {
        adapter.trackEvent(event);
      } catch (err) {
        console.error(`[AnalyticsManager] Error in adapter "${adapter.name}":`, err);
      }
    }
  }

  public trackLevelStart(level: number): void {
    this.track(StandardAnalyticsEvent.LevelStart, { level });
  }

  public trackLevelComplete(level: number, moves: number, durationSeconds: number): void {
    this.track(StandardAnalyticsEvent.LevelComplete, {
      level,
      moves,
      duration_seconds: durationSeconds
    });
  }

  public trackAd(
    type: 'midroll' | 'rewarded',
    status: 'started' | 'completed' | 'failed' | 'skipped'
  ): void {
    const eventName =
      status === 'completed'
        ? StandardAnalyticsEvent.AdCompleted
        : status === 'failed'
          ? StandardAnalyticsEvent.AdFailed
          : StandardAnalyticsEvent.AdRequested;

    this.track(eventName, {
      ad_type: type,
      status
    });
  }

  private generateSessionId(): string {
    const rand = Math.random().toString(36).substring(2, 9);
    return `sess_${Date.now()}_${rand}`;
  }
}
