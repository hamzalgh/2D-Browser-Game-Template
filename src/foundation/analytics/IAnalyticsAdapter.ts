import { AnalyticsEvent } from './AnalyticsTypes';

export interface IAnalyticsAdapter {
  readonly name: string;
  trackEvent(event: AnalyticsEvent): void;
  setUserProperty(key: string, value: string | number | boolean): void;
}
