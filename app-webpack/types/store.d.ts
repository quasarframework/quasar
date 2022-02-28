import { HasStore } from "quasar";
import { Store } from "vuex";
import { HasSsrParam } from "./ssr";

export type HasStoreParam<S = any> = HasStore<{
  /**
   * The state of the Vuex store, gets filled in by Vuex itself
   */
  store: Store<S>;
}>;

export type StoreParams = {} & HasSsrParam;

export type StoreCallback = (
  params: StoreParams
) => Store<any> | Promise<Store<any>>;
