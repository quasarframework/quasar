import { HasSsrParam, HasStoreParam } from "quasar";
import Vue, { ComponentOptions, VueConstructor } from "vue";
import VueRouter from "vue-router";

declare module "quasar" {
  interface BootFileParams<TStore> extends HasSsrParam, HasStoreParam<TStore> {
    app: ComponentOptions<Vue>;
    Vue: VueConstructor;
    router: VueRouter;
    urlPath: string;
    redirect: (url: string) => void;
  }

  type BootCallback<TStore> = (
    params: BootFileParams<TStore>
  ) => void | Promise<void>;
}
