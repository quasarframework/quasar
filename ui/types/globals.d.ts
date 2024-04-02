import { QuasarIconSet } from "./extras/icon-set";
import { HasBex, HasCapacitor, HasCordova, HasSsr } from "./feature-flag";
import { QuasarLanguage } from "./lang";

// We cannot reference directly Capacitor/Cordova types
//  or they would generate TS errors for Vue CLI users
// We also cannot move feature-flags system into `@quasar/app-webpack`/`@quasar/app-vite`
//  because `QVueGlobals` augmentations won't be transferred to
//  the `vue/types/vue` augmentation for unknown reason (probably TS limitations)
//  and the system will just stop working
// To workaround these problems we define an empty holder interface
//  and augment it into `@quasar/app-webpack`/`@quasar/app-vite` with current typings
export interface GlobalsTypesHolder {
  [index: string]: any;
}

interface QuasarLanguageInstance extends QuasarLanguage {
  rtl: boolean;
}

export interface GlobalQuasarLanguage extends QuasarLanguageInstance {
  set(lang: QuasarLanguage): void;
  /** Returns undefined when it cannot determine current browser locale or when running on server in SSR mode. */
  getLocale(): string | undefined;
}

export interface GlobalQuasarLanguageSingleton
  extends Pick<GlobalQuasarLanguage, "isoName" | "nativeName" | "getLocale">,
    HasSsr<
      { set(lang: QuasarLanguage, ssrContext: any): void },
      { set(lang: QuasarLanguage): void }
    > {
  props: QuasarLanguageInstance;
}

export interface GlobalQuasarIconSet extends QuasarIconSet {
  set(iconSet: QuasarIconSet): void;
}

export interface GlobalQuasarIconSetSingleton
  extends QuasarIconSet,
    HasSsr<
      // QSsrContext interface depends on q/app, making it available into UI package adds complexity without any real benefit
      { set(iconSet: QuasarIconSet, ssrContext: any): void },
      { set(iconSet: QuasarIconSet): void }
    > {
  iconMapFn: GlobalQuasarIconMapFn;
}

export type GlobalQuasarIconMapFn = (
  iconName: string,
) => { icon: string } | { cls: string; content?: string } | void;

// `import { Quasar } from 'quasar'` will contain these types
export interface QSingletonGlobals {
  version: string;
  lang: GlobalQuasarLanguageSingleton;
  iconSet: GlobalQuasarIconSetSingleton;
}

export interface BaseQGlobals {
  version: string;
  lang: GlobalQuasarLanguage;
  iconSet: GlobalQuasarIconSet;
}

// $q object will contain these types
export interface QVueGlobals
  extends HasCapacitor<{ capacitor: any }>,
    HasBex<{ bex: GlobalsTypesHolder["bex"] }>,
    HasCordova<{ cordova: GlobalsTypesHolder["cordova"] }>,
    HasSsr<
      { iconMapFn?: GlobalQuasarIconMapFn; onSSRHydrated?: () => void },
      { iconMapFn: GlobalQuasarIconMapFn }
    >,
    BaseQGlobals {}
