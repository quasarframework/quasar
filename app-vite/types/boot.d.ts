import { App } from "vue";
import { Router, RouteLocationRaw } from "vue-router";
import { HasSsrParam } from "./ssr";
import { HasStoreParam } from "./store";

interface BootFileParams extends HasSsrParam, HasStoreParam {
  app: App;
  router: Router;
  urlPath: string;
  publicPath: string;
  redirect: (url: string | RouteLocationRaw) => void;
}

export type BootCallback = (params: BootFileParams) => void | Promise<void>;
