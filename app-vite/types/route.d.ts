import type { Router } from "vue-router";

import type { HasSsrParam } from "./ssr/index.d.ts";
import type { HasSsgParam } from "./ssg/index.d.ts";
import type { HasStoreParam } from "./store.d.ts";

export type RouteParams = {} & HasSsrParam & HasSsgParam & HasStoreParam;
export type RouteCallback = (params: RouteParams) => Router | Promise<Router>;
