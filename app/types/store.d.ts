import { HasSsrParam, HasStore } from "quasar";
import { VueConstructor } from "vue";
import { Store } from "vuex";

declare module "quasar" {
  type HasStoreParam<S = any> = HasStore<{ store: S }>;

  type StoreParams = {
    Vue: VueConstructor;
  } & HasSsrParam;

  type StoreCallback = (params: StoreParams) => Store<any>;
}
