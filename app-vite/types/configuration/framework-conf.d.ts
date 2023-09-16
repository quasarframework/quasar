import {
  QuasarIconSets,
  QuasarLanguageCodes,
  QuasarPluginOptions,
  QuasarUIConfiguration,
} from "quasar";

type AnyFn = (...args: any) => any;
type SerializableConfiguration<T> = {
  [K in keyof T as AnyFn extends T[K] ? never : K]: object extends T[K]
    ? SerializableConfiguration<T[K]>
    : T[K];
};

interface QuasarFrameworkConfiguration {
  config?: SerializableConfiguration<QuasarUIConfiguration>;
  iconSet?: QuasarIconSets;
  lang?: QuasarLanguageCodes;
  cssAddon?: boolean;

  /**
   * Auto import - how to detect components in your vue files
   *   "kebab": q-carousel q-page
   *   "pascal": QCarousel QPage
   *   "combined": q-carousel QPage
   * @default 'kebab'
   */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";

  /**
   * Auto import - which file extensions should be interpreted as referring to Vue SFC?
   * @default [ 'vue' ]
   */
  autoImportVueExtensions?: string[];

  /**
   * Auto import - which file extensions should be interpreted as referring to script files?
   * @default [ 'js', 'jsx', 'ts', 'tsx' ]
   */
  autoImportScriptExtensions?: string[];

  /**
   * Treeshake Quasar's UI on dev too?
   * Recommended to leave this as false for performance reasons.
   * @default false
   */
  devTreeshaking?: boolean;

  components?: (keyof QuasarPluginOptions["components"])[];
  directives?: (keyof QuasarPluginOptions["directives"])[];
  plugins?: (keyof QuasarPluginOptions["plugins"])[];
}
