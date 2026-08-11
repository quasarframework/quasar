import type {
  RouteLocationNormalizedLoaded,
  RouteLocationRaw
} from "vue-router";

import type { HasSsrParam, HttpRedirectStatusCode } from "./ssr/index.d.ts";
import type { HasSsgParam } from "./ssg/index.d.ts";
import type { HasStoreParam } from "./store.d.ts";

interface PreFetchOptions extends HasSsrParam, HasSsgParam, HasStoreParam {
  readonly currentRoute: RouteLocationNormalizedLoaded;
  readonly previousRoute: RouteLocationNormalizedLoaded;
  readonly redirect: (
    url: string | RouteLocationRaw,
    /**
     * HTTP status code to use for the redirection.
     * Only used in SSR mode (not SSG).
     *
     * @default 302
     */
    httpStatusCode?: HttpRedirectStatusCode
  ) => void;
  readonly urlPath: string;
  readonly publicPath: string;
}

// https://github.com/quasarframework/quasar/issues/6576#issuecomment-603787603
// Promise<{}> allow nearly any type of Promise to be used
export type PrefetchCallback = (
  options: PreFetchOptions
) => void | Promise<void> | Promise<{}>;

declare module "vue" {
  interface ComponentCustomOptions {
    preFetch?: PrefetchCallback;
  }
}
