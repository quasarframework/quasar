import { App } from "vue";
import { Router, RouteLocationRaw } from "vue-router";
import { HasSsrParam } from "./ssr";
import { HasStoreParam } from "./store";

interface BootFileParams<TState> extends HasSsrParam, HasStoreParam<TState> {
  app: App;
  router: Router;
  urlPath: string;
  publicPath: string;
  redirect: (url: string | RouteLocationRaw) => void;
}

export type BootCallback<TState> = (
  params: BootFileParams<TState>
) => void | Promise<void>;
