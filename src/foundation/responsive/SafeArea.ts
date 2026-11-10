export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export class SafeAreaManager {
  /**
   * Reads and applies CSS environment variables for safe areas
   * (e.g. iPhone notch, dynamic island, home indicator bar).
   */
  public static getInsets(): SafeAreaInsets {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const computedStyle = getComputedStyle(document.documentElement);
    const parse = (val: string) => {
      const num = parseFloat(val);
      return Number.isNaN(num) ? 0 : num;
    };

    return {
      top: parse(computedStyle.getPropertyValue('--safe-area-top')),
      bottom: parse(computedStyle.getPropertyValue('--safe-area-bottom')),
      left: parse(computedStyle.getPropertyValue('--safe-area-left')),
      right: parse(computedStyle.getPropertyValue('--safe-area-right'))
    };
  }

  /**
   * Enforces safe-area padding into document CSS root variables.
   */
  public static syncWithDOM(): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top, 0px)');
    root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom, 0px)');
    root.style.setProperty('--safe-area-left', 'env(safe-area-inset-left, 0px)');
    root.style.setProperty('--safe-area-right', 'env(safe-area-inset-right, 0px)');
  }
}
