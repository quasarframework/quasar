import { HasStore } from "quasar";
import { VueConstructor } from "vue";
import { Store } from "vuex";
import { HasSsrParam } from "./ssr";

// TODO:BREAKING-CHANGE `store` property type should actually be `Store<S>`
// We noticed too late for q/app v2 release, should be changed into q/app v3
// In that instance, all `TStore` parameters occurrences should be renamed to `TState`
// and starter kit "router/index.ts" should be updated accordingly to provide
//  `StateInterface` instead of `Store<StateInterface>`
// See https://github.com/quasarframework/quasar-starter-kit/issues/109
export type HasStoreParam<S = any> = HasStore<{ store: S }>;

export type StoreParams = {
  Vue: VueConstructor;
} & HasSsrParam;

export type StoreCallback = (params: StoreParams) => Store<any> | Promise<Store<any>>;
