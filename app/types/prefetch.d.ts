import { HasSsrParam, HasStoreParam } from "quasar";
import Vue from "vue";
import { Route } from "vue-router";

interface PreFetchOptions<TStore> extends HasSsrParam, HasStoreParam<TStore> {
  currentRoute: Route;
  previousRoute: Route;
  redirect: (url: string) => void;
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    // https://github.com/quasarframework/quasar/issues/6576#issuecomment-603787603
    // Promise<{}> allow nearly any type of Promise to be used
    preFetch?: <TStore>(options: PreFetchOptions<TStore>) => void | Promise<{}>;
  }
}
