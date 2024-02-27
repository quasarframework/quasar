import { QuasarUIConfiguration } from "./config";
import { QuasarIconSet } from "./extras";
import { GlobalQuasarIconMapFn } from "./globals";
import { QuasarLanguage } from "./lang";

// These interfaces are used as forward-references
//  filled at build-time via TS interface merging capabilities
export interface QuasarComponents {}
export interface QuasarDirectives {}
export interface QuasarPlugins {}

export interface QuasarPluginOptions {
  lang: QuasarLanguage;
  config: QuasarUIConfiguration;
  iconSet: QuasarIconSet;
  components: QuasarComponents;
  directives: QuasarDirectives;
  plugins: QuasarPlugins;
  iconMapFn: GlobalQuasarIconMapFn;
}
