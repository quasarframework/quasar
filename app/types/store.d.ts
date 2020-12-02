import { HasStore } from "quasar";
import { Store } from "vuex";
import { HasSsrParam } from "./ssr";

export type HasStoreParam<S = any> = HasStore<{ store: Store<S> }>;

export type StoreParams = {} & HasSsrParam;

export type StoreCallback = (
  params: StoreParams
) => Store<any> | Promise<Store<any>>;
