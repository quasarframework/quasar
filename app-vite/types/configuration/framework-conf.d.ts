import {
  QuasarIconSets,
  QuasarLanguageCodes,
  QuasarPluginOptions,
  QuasarUIConfiguration,
} from "quasar";

interface QuasarFrameworkConfiguration {
  config?: QuasarUIConfiguration;
  iconSet?: QuasarIconSets;
  lang?: QuasarLanguageCodes;
  cssAddon?: boolean;
  /** @default 'kebab' */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";
  components?: (keyof QuasarPluginOptions["components"])[];
  directives?: (keyof QuasarPluginOptions["directives"])[];
  plugins?: (keyof QuasarPluginOptions["plugins"])[];
}
