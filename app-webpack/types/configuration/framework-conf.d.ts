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
  /** @default 'kebab' */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";
  components?: (keyof QuasarPluginOptions["components"])[];
  directives?: (keyof QuasarPluginOptions["directives"])[];
  plugins?: (keyof QuasarPluginOptions["plugins"])[];
}
