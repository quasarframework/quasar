export type QuasarCapacitorTargets = "android" | "ios";

export interface QuasarCapacitorConfiguration {
  /**
   * Automatically hide the Capacitor Splashscreen when app is ready,
   * (is using the Splashscreen Capacitor plugin).
   *
   * @default true
   */
  hideSplashscreen?: boolean;

  /**
   * Preparation params with which the Capacitor CLI is called
   *
   * @default [ 'sync', ctx.targetName ]
   */
  capacitorCliPreparationParams?: string[];
}
