import * as Cordova from "cordova";
import { GlobalQuasarBex } from "./bex";
import "quasar/dist/types/globals";
import { PrefetchCallback } from "./prefetch";

declare module "quasar/dist/types/globals" {
  interface GlobalsTypesHolder {
    cordova: typeof Cordova;
    bex: GlobalQuasarBex;
  }
  const definePreFetch: PrefetchCallback
}
