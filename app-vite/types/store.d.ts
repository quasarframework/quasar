import { HasStore } from "quasar";
import { Pinia } from "pinia";
import { Store } from "vuex";
import { HasSsrParam } from "./ssr";

// If Pinia is installed, its type will be resolved, thus it will be used.
// Otherwise, if Vuex is installed, it will be used. If nothing is installed, 'any' will be used.
type StoreInstance<S = any> = unknown extends Pinia ? Store<S> : Pinia;

export type HasStoreParam<S = any> = HasStore<{
  /**
   * The store instance.
   */
  store: StoreInstance<S>;
}>;

export type StoreParams = {} & HasSsrParam;

export type StoreCallback = (
  params: StoreParams
) => StoreInstance | Promise<StoreInstance>;
