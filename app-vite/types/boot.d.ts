import type { App } from "vue";
import type { RouteLocationRaw, Router } from "vue-router";

import type { HasSsrParam, HttpRedirectStatusCode } from "./ssr/index.d.ts";
import type { HasSsgParam } from "./ssg/index.d.ts";
import type { HasStoreParam } from "./store.d.ts";

interface BootFileParams extends HasSsrParam, HasSsgParam, HasStoreParam {
  readonly app: App;
  readonly router: Router;
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
