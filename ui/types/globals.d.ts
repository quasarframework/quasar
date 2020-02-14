import { QuasarIconSet } from "./extras/icon-set";
import { HasCapacitor, HasCordova, HasElectron } from "./feature-flag";
import { QuasarLanguage } from "./lang";

// We cannot reference directly Capacitor/Cordova/Electron types
//  or they would generate TS errors for Vue CLI users
// We also cannot move feature-flags system into `@quasar/app`
//  because `QVueGlobals` augmentations won't be transfered to
//  the `vue/types/vue` augmentation for unknown reason (probably TS limitations)
//  and the system will just stop working
// To workaround these problems we define an empty holder interface
//  and augment it into `@quasar/app` with currect typings
export interface GlobalsTypesHolder {
  [index: string]: any;
}

interface GlobalQuasarLanguage extends QuasarLanguage {
  set(lang: QuasarLanguage): void;
  /** Returns undefined when in SSR mode or when it cannot determine current language. */
  getLocale(): string | undefined;
}

interface GlobalQuasarIconSet extends QuasarIconSet {
  set(iconSet: QuasarIconSet): void;
}

export interface QVueGlobals
  extends HasCapacitor<{ capacitor: any }>,
    HasCordova<{ cordova: GlobalsTypesHolder["cordova"] }>,
    HasElectron<{ electron: GlobalsTypesHolder["electron"] }> {
  version: string;
  lang: GlobalQuasarLanguage;
  iconSet: GlobalQuasarIconSet;
}
