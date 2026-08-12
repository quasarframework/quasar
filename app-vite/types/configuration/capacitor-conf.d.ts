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

  /**
   * The Xcode scheme (and .xcworkspace file name) used when building
   * for iOS from the CLI. Set it if you renamed the default "App"
   * in Xcode.
   *
   * @default 'App'
   */
  iosBuildScheme?: string;
}
