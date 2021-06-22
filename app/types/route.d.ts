import { Router } from "vue-router";
import { HasSsrParam } from "./ssr";
import { HasStoreParam } from "./store";

export type RouteParams<TState = any> = {} & HasSsrParam &
  HasStoreParam<TState>;

export type RouteCallback<TState = any> = (
  params: RouteParams<TState>
) => Router | Promise<Router>;
