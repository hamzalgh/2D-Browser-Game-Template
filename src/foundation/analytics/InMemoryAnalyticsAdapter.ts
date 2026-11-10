import { IAnalyticsAdapter } from './IAnalyticsAdapter';
import { AnalyticsEvent } from './AnalyticsTypes';

export class InMemoryAnalyticsAdapter implements IAnalyticsAdapter {
  public readonly name = 'in_memory';
  public events: AnalyticsEvent[] = [];
  public userProperties: Map<string, string | number | boolean> = new Map();

  public trackEvent(event: AnalyticsEvent): void {
    this.events.push(event);
  }

  public setUserProperty(key: string, value: string | number | boolean): void {
    this.userProperties.set(key, value);
  }

  public clear(): void {
    this.events = [];
    this.userProperties.clear();
  }

  public getEventsByName(name: string): AnalyticsEvent[] {
    return this.events.filter(e => e.name === name);
  }
}
