import { QuasarIconSet } from "./extras/icon-set";
import { HasCapacitor, HasCordova, HasElectron } from "./feature-flag";
import { QuasarLanguage } from "./lang";

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
    HasCordova<{ cordova: any }>,
    HasElectron<{ electron: any }> {
  version: string;
  lang: GlobalQuasarLanguage;
  iconSet: GlobalQuasarIconSet;
}
