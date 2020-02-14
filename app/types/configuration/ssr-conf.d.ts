import { Options as LruCacheOptions } from "lru-cache";

import "quasar";
declare module "quasar" {
  interface QuasarSsrConfiguration {
    /**
     * If a PWA should take over or just a SPA.
     * When used in object form, you can specify Workbox options
     *  which will be applied on top of `pwa > workboxOptions`.
     *
     * @default false
     */
    pwa?: boolean | object;
    componentCache?: LruCacheOptions<any, any>;
  }
}
