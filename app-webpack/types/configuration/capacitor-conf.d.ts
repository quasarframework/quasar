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

  /** If not present, will look for `package.json > name` */
  appName?: string;
  /** If not present, will look for `package.json > version` */
  version?: string;
  /** If not present, will look for `package.json > description` */
  description?: string;
}
