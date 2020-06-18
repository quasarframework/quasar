import { HasStore } from "quasar";
import { VueConstructor } from "vue";
import { Store } from "vuex";
import { HasSsrParam } from "./ssr";

export type HasStoreParam<S = any> = HasStore<{ store: S }>;

export type StoreParams = {
  Vue: VueConstructor;
} & HasSsrParam;

export type StoreCallback = (params: StoreParams) => Store<any>;
