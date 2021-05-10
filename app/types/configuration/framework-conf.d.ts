import {
  QuasarIconSets,
  QuasarLanguageCodes,
  DeepPartial,
  QuasarPluginOptions,
} from "quasar";
import Vue from "vue";

interface QuasarMobileFrameworkInnerConfiguration {
  iosStatusBarPadding: boolean;
  backButton: boolean;
  backButtonExit: boolean | "*" | string[];
}

interface QuasarFrameworkInnerConfiguration {
  brand: {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
    positive: string;
    negative: string;
    info: string;
    warning: string;
  };
  capacitor: QuasarMobileFrameworkInnerConfiguration;
  cordova: QuasarMobileFrameworkInnerConfiguration;
  dark: boolean | "auto";
  loading: {
    delay: number;
    message: false | string;
    spinnerSize: number;
    spinnerColor: string;
    messageColor: string;
    backgroundColor: string;
    spinner: Vue;
    customClass: string;
  };
  loadingBar: { color: string; size: string; position: string };
  notify: {
    position: string;
    timeout: number;
    textColor: string;
    actions: { icon: string; color: string }[];
  };
}

interface QuasarBaseFrameworkObjectConfiguration {
  plugins?: (keyof QuasarPluginOptions["plugins"])[];
  config?: DeepPartial<QuasarFrameworkInnerConfiguration>;
  iconSet?: QuasarIconSets;
  lang?: QuasarLanguageCodes;
  cssAddon?: boolean;
}

interface QuasarAutoFrameworkObjectConfiguration
  extends QuasarBaseFrameworkObjectConfiguration {
  importStrategy: "auto";
  /** @default 'kebab' */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";
  components?: (keyof QuasarPluginOptions["components"])[];
  directives?: (keyof QuasarPluginOptions["directives"])[];
}

interface QuasarAllFrameworkObjectConfiguration
  extends QuasarBaseFrameworkObjectConfiguration {
  importStrategy: "all";
}

export type QuasarFrameworkConfiguration =
  | "all" // Equal to `{ importStrategy: 'all' }`
  | QuasarAutoFrameworkObjectConfiguration
  | QuasarAllFrameworkObjectConfiguration;
