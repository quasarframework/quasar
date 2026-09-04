import { QuasarUIConfiguration } from "./config";
import { QuasarIconSet } from "./icon-set";
import { GlobalQuasarIconMapFn } from "./globals";
import { QuasarLanguage } from "./lang";

// These interfaces are used as forward-references
//  filled at build-time via TS interface merging capabilities
export interface QuasarComponents {}
export interface QuasarDirectives {}
export interface QuasarPlugins {}

/**
 * Names of the spinner components (e.g. 'QSpinnerGears'); the quasar.config
 * file refers to a spinner by its name, as it cannot import components.
 */
export type QuasarSpinners = Extract<
  keyof QuasarComponents,
  `QSpinner${string}`
>;

export interface QuasarPluginOptions {
  lang?: QuasarLanguage;
  config?: QuasarUIConfiguration;
  iconSet?: QuasarIconSet;
  components?: Partial<QuasarComponents>;
  directives?: Partial<QuasarDirectives>;
  plugins?: Partial<QuasarPlugins>;
  iconMapFn?: GlobalQuasarIconMapFn;
}
