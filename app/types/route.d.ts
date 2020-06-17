import { VueConstructor } from "vue";
import VueRouter from "vue-router";
import { HasSsrParam } from "./ssr";
import { HasStoreParam } from "./store";

export type RouteParams<TStore = any> = {
  Vue: VueConstructor;
} & HasSsrParam &
  HasStoreParam<TStore>;

export type RouteCallback<TStore = any> = (
  params: RouteParams<TStore>
) => VueRouter;
