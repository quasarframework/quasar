import { Options as LruCacheOptions } from "lru-cache";

export interface QuasarSsrConfiguration {
  /**
   * If a PWA should take over or just a SPA.
   * When used in object form, you can specify Workbox options
   *  which will be applied on top of `pwa > workboxOptions`.
   *
   * @default false
   */
  pwa?: boolean | object;

  componentCache?: LruCacheOptions<any, any>;

  /**
    * Manually inject the store state into ssrContext.state
    * (Requires @quasar/app v2.3+)
    */
  manualStoreSsrContextInjection?: boolean;

  /**
   * Manually handle the store hydration instead of letting Quasar CLI do it.
   *   store.replaceState(window.__INITIAL_STATE__)
   */
  manualHydration?: boolean;

  /**
   * @version `@quasar/app` 1.9.6+
   *
   * Add/remove/change properties of production generated package.json
   */
  extendPackageJson?: (pkg: { [index in string]: any }) => void;
}
