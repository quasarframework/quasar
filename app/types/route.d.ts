import { HasSsrParam, HasStoreParam } from "quasar";
import { VueConstructor } from "vue";
import VueRouter from "vue-router";

declare module "quasar" {
  type RouteParams<TStore = any> = {
    Vue: VueConstructor;
  } & HasSsrParam &
    HasStoreParam<TStore>;

  type RouteCallback<TStore = any> = (params: RouteParams<TStore>) => VueRouter;
}
