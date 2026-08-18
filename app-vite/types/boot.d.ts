import type { App } from "vue";
import type { RouteLocationRaw, Router } from "vue-router";

import type { HasSsrParam, HttpRedirectStatusCode } from "./ssr/index.d.ts";
import type { HasSsgParam } from "./ssg/index.d.ts";
import type { HasStoreParam } from "./store.d.ts";

interface BootFileParams extends HasSsrParam, HasSsgParam, HasStoreParam {
  readonly app: App;
  readonly router: Router;
  /**
   * The URL the app was accessed with, as Vue Router sees it: path + query
   * (+ hash), without the publicPath prefix and without the hash-mode "#"
   * wrapper. Same value in every Quasar mode and Vue Router mode; can be
   * fed directly to router.resolve() or matched against your routes.
   * For the raw browser URL use window.location (client-side)
   * or ssrContext.req.url (server-side).
   */
  readonly urlPath: string;
  readonly publicPath: string;
  readonly redirect: (
    url: string | RouteLocationRaw,
    /**
     * HTTP status code to use for the redirection.
     * Only used in SSR mode.
     *
     * @default 302
     */
    httpStatusCode?: HttpRedirectStatusCode
  ) => void;
}

export type BootCallback = (params: BootFileParams) => void | Promise<void>;
