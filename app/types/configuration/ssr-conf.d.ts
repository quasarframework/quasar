export interface QuasarSsrConfiguration {
  /**
   * If a PWA should take over or just a SPA.
   * When used in object form, you can specify Workbox options
   *  which will be applied on top of `pwa > workboxOptions`.
   *
   * @default false
   */
  pwa?: boolean | object;

  /**
   * Add/remove/change properties of production generated package.json
   */
  extendPackageJson?: (pkg: { [index in string]: any }) => void;
}
