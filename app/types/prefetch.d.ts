import Vue from "vue";
import { RawLocation, Route } from "vue-router";
import { HasSsrParam } from "./ssr";
import { HasStoreParam } from "./store";

interface PreFetchOptions<TStore> extends HasSsrParam, HasStoreParam<TStore> {
  currentRoute: Route;
  previousRoute: Route;
  redirect: (url: RawLocation, httpStatusCode?: number) => void;
  urlPath: string;
  publicPath: string;
}

// https://github.com/quasarframework/quasar/issues/6576#issuecomment-603787603
// Promise<{}> allow nearly any type of Promise to be used
export type PrefetchCallback<TStore = any> = (
  options: PreFetchOptions<TStore>
) => void | Promise<void> | Promise<{}>;

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    preFetch?: PrefetchCallback;
  }
}
