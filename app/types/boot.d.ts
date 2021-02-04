import Vue, { ComponentOptions, VueConstructor } from "vue";
import VueRouter, { RawLocation } from "vue-router";
import { HasSsrParam } from "./ssr";
import { HasStoreParam } from "./store";

interface BootFileParams<TStore> extends HasSsrParam, HasStoreParam<TStore> {
  app: ComponentOptions<Vue>;
  Vue: VueConstructor;
  router: VueRouter;
  urlPath: string;
  publicPath: string;
  redirect: (url: string | RawLocation, httpStatusCode?: number) => void;
}

export type BootCallback<TStore> = (
  params: BootFileParams<TStore>
) => void | Promise<void>;
