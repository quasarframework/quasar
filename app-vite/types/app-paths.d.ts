export interface QuasarAppPathsResolve {
  /**
   * Resolve an absolute path to Quasar CLI's own directory
   */
  readonly cli: (dir: string) => string;
  /**
   * Resolve an absolute path to the app's root directory
   * (where quasar.config.[js|ts] is located)
   */
  readonly app: (dir: string) => string;
  /**
   * Resolve an absolute path to the /src directory
   */
  readonly src: (dir: string) => string;
  /**
   * Resolve an absolute path to the /public directory
   */
  readonly public: (dir: string) => string;
  /**
   * Resolve an absolute path to the /src-pwa directory
   */
  readonly pwa: (dir: string) => string;
  /**
   * Resolve an absolute path to the /src-ssr directory
   */
  readonly ssr: (dir: string) => string;
  /**
   * Resolve an absolute path to the /src-ssg directory
   */
  readonly ssg: (dir: string) => string;
  /**
   * Resolve an absolute path to the /src-cordova directory
   */
  readonly cordova: (dir: string) => string;
  /**
   * Resolve an absolute path to the /src-capacitor directory
   */
  readonly capacitor: (dir: string) => string;
  /**
   * Resolve an absolute path to the /src-electron directory
   */
  readonly electron: (dir: string) => string;
  /**
   * Resolve an absolute path to the /src-bex directory
   */
  readonly bex: (dir: string) => string;

  /**
   * Resolve an absolute path to the cache directory used by the CLI
   * in the current context.
   */
  readonly cache: (dir: string) => string;
}

export interface QuasarAppPaths {
  /**
   * Absolute path to the Quasar CLI's own directory
   */
  readonly cliDir: string;
  /**
   * Absolute path to the app's root directory
   * (where quasar.config.[js|ts] is located)
   */
  readonly appDir: string;
  /**
   * Absolute path to the /src directory
   */
  readonly srcDir: string;
  /**
   * Absolute path to the /public directory
   */
  readonly publicDir: string;
  /**
   * Absolute path to the /src-pwa directory
   */
  readonly pwaDir: string;
  /**
   * Absolute path to the /src-ssr directory
   */
  readonly ssrDir: string;
  /**
   * Absolute path to the /src-ssg directory
   */
  readonly ssgDir: string;
  /**
   * Absolute path to the /src-cordova directory
   */
  readonly cordovaDir: string;
  /**
   * Absolute path to the /src-capacitor directory
   */
  readonly capacitorDir: string;
  /**
   * Absolute path to the /src-electron directory
   */
  readonly electronDir: string;
  /**
   * Absolute path to the /src-bex directory
   */
  readonly bexDir: string;

  /**
   * Absolute path to the cache directory used by the CLI
   * in the current context.
   */
  readonly cacheDir: string;

  /**
   * Absolute path to the Quasar configuration file
   */
  readonly quasarConfigFilename: string;
  /**
   * Format of the Quasar configuration file
   */
  readonly quasarConfigInputFormat: "esm" | "ts";

  /**
   * Helper functions to resolve absolute paths
   * for the app's various directories.
   *
   * @param fns {@link QuasarAppPathsResolve}
   */
  readonly resolve: QuasarAppPathsResolve;
}
