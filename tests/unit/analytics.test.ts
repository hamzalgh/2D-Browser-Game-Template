import { describe, it, expect, beforeEach } from 'vitest';
import {
  AnalyticsManager,
  InMemoryAnalyticsAdapter,
  StandardAnalyticsEvent
} from '../../src/foundation/analytics';

describe('Analytics Abstraction & Event Tracking', () => {
  beforeEach(() => {
    AnalyticsManager.resetInstance();
  });

  it('generates a unique session ID upon initialization', () => {
    const memory = new InMemoryAnalyticsAdapter();
    const analytics = AnalyticsManager.getInstance(memory);

    const sessionId = analytics.getSessionId();
    expect(sessionId).toMatch(/^sess_\d+_[a-z0-9]+$/);
  });

  it('enriches events with timestamp, session ID, and duration', () => {
    const memory = new InMemoryAnalyticsAdapter();
    const analytics = AnalyticsManager.getInstance(memory);

    analytics.track('custom_event', { customParam: 42 });

    const events = memory.getEventsByName('custom_event');
    expect(events.length).toBe(1);
    expect(events[0].name).toBe('custom_event');
    expect(events[0].params.customParam).toBe(42);
    expect(typeof events[0].params.session_duration_s).toBe('number');
    expect(events[0].sessionId).toBe(analytics.getSessionId());
  });

  it('tracks standard game lifecycle and level events', () => {
    const memory = new InMemoryAnalyticsAdapter();
    const analytics = AnalyticsManager.getInstance(memory);

    analytics.trackLevelStart(1);
    analytics.trackLevelComplete(1, 12, 45);
    analytics.trackAd('rewarded', 'completed');

    expect(memory.getEventsByName(StandardAnalyticsEvent.LevelStart).length).toBe(1);
    expect(memory.getEventsByName(StandardAnalyticsEvent.LevelComplete).length).toBe(1);
    expect(memory.getEventsByName(StandardAnalyticsEvent.AdCompleted).length).toBe(1);
  });
});
