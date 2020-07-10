import { QuasarIconSet } from "./extras/icon-set";
import { HasCapacitor, HasCordova, HasElectron, HasSsr, HasBex } from './feature-flag'
import { QuasarLanguage } from "./lang";

// We cannot reference directly Capacitor/Cordova/Electron types
//  or they would generate TS errors for Vue CLI users
// We also cannot move feature-flags system into `@quasar/app`
//  because `QVueGlobals` augmentations won't be transferred to
//  the `vue/types/vue` augmentation for unknown reason (probably TS limitations)
//  and the system will just stop working
// To workaround these problems we define an empty holder interface
//  and augment it into `@quasar/app` with current typings
export interface GlobalsTypesHolder {
  [index: string]: any;
}

export interface GlobalQuasarLanguage extends QuasarLanguage {
  set(lang: QuasarLanguage): void;
  /** Returns undefined when in SSR mode or when it cannot determine current language. */
  getLocale(): string | undefined;
}

export interface GlobalQuasarIconSet extends QuasarIconSet {
  set(iconSet: QuasarIconSet): void;
}

type GlobalQuasarIconMapFn = (
  iconName: string
) => { icon: string } | { cls: string; content?: string } | void;

export interface QVueGlobals
  extends HasCapacitor<{ capacitor: any }>,
    HasBex<{ bex: GlobalsTypesHolder["bex"] }>,
    HasCordova<{ cordova: GlobalsTypesHolder["cordova"] }>,
    HasElectron<{ electron: GlobalsTypesHolder["electron"] }>,
    HasSsr<
      { iconMapFn?: GlobalQuasarIconMapFn },
      { iconMapFn: GlobalQuasarIconMapFn }
    > {
  version: string;
  lang: GlobalQuasarLanguage;
  iconSet: GlobalQuasarIconSet;
}
