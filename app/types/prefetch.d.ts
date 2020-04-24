import { HasSsrParam, HasStoreParam, PrefetchCallback } from "quasar";
import Vue from "vue";
import { Route } from "vue-router";

declare module "quasar" {
  interface PreFetchOptions<TStore> extends HasSsrParam, HasStoreParam<TStore> {
    currentRoute: Route;
    previousRoute: Route;
    redirect: (url: string) => void;
  }

  // https://github.com/quasarframework/quasar/issues/6576#issuecomment-603787603
  // Promise<{}> allow nearly any type of Promise to be used
  type PrefetchCallback<TStore = any> = (
    options: PreFetchOptions<TStore>
  ) => void | Promise<void> | Promise<{}>;
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    preFetch?: PrefetchCallback;
  }
}
