import { QuasarIconSet } from "./extras/icon-set";
import { HasCapacitor, HasCordova, HasElectron } from "./feature-flag";
import { QuasarLanguage } from "./lang";
import * as Cordova from "cordova";
import * as Electron from "electron";

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
    HasCordova<{ cordova: typeof Cordova }>,
    HasElectron<{ electron: typeof Electron }> {
  version: string;
  lang: GlobalQuasarLanguage;
  iconSet: GlobalQuasarIconSet;
}
