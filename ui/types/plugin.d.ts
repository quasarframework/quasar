import { QuasarIconSet } from "./extras";
import { QuasarLanguage } from "./lang";

// These interfaces are used as forward-references
//  filled at build-time via TS interface mergin capabilities
export interface QuasarComponents {}
export interface QuasarDirectives {}
export interface QuasarPlugins {}

export interface QuasarPluginOptions {
  lang: QuasarLanguage;
  config: any;
  iconSet: QuasarIconSet;
  components: QuasarComponents;
  directives: QuasarDirectives;
  plugins: QuasarPlugins;
}
