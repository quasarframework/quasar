import { Router } from "vue-router";
import { HasSsrParam } from "./ssr";
import { HasStoreParam } from "./store";

export type RouteParams = {} & HasSsrParam & HasStoreParam;

export type RouteCallback = (params: RouteParams) => Router | Promise<Router>;
