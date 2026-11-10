import { IAnalyticsAdapter } from './IAnalyticsAdapter';
import { AnalyticsEvent } from './AnalyticsTypes';

export class ConsoleAnalyticsAdapter implements IAnalyticsAdapter {
  public readonly name = 'console';

  public trackEvent(event: AnalyticsEvent): void {
    console.log(
      `%c[ANALYTICS] %c${event.name}%c`,
      'color: #06b6d4; font-weight: bold;',
      'color: #f43f5e; font-weight: bold;',
      'color: inherit;',
      event.params
    );
  }

  public setUserProperty(key: string, value: string | number | boolean): void {
    console.log(`[ANALYTICS] Set User Property: ${key} = ${value}`);
  }
}
