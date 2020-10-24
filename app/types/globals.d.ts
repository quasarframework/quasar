import * as Cordova from "cordova";
import * as Electron from "electron";
import { GlobalQuasarBex } from "./bex";
import "quasar/dist/types/globals";

declare module "quasar/dist/types/globals" {
  interface GlobalsTypesHolder {
    cordova: typeof Cordova;
    electron: typeof Electron;
    bex: GlobalQuasarBex;
  }
}
