import { HasSsrParam, HasStoreParam } from "quasar";
import Vue, { ComponentOptions, VueConstructor } from "vue";
import VueRouter, { RawLocation } from "vue-router";

declare module "quasar" {
  interface BootFileParams<TStore> extends HasSsrParam, HasStoreParam<TStore> {
    app: ComponentOptions<Vue>;
    Vue: VueConstructor;
    router: VueRouter;
    urlPath: string;
    publicPath: string;
    redirect: (url: string | RawLocation) => void;
  }

  type BootCallback<TStore> = (
    params: BootFileParams<TStore>
  ) => void | Promise<void>;
}
