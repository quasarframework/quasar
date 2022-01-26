import {
  QuasarIconSets,
  QuasarLanguageCodes,
  QuasarPluginOptions,
} from "quasar";
import { Component } from "vue";

interface QuasarMobileFrameworkInnerConfiguration {
  iosStatusBarPadding: boolean;
  backButton: boolean;
  backButtonExit: boolean | "*" | string[];
}

interface QuasarFrameworkInnerConfiguration {
  brand?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    dark?: string;
    positive?: string;
    negative?: string;
    info?: string;
    warning?: string;
  };
  capacitor?: QuasarMobileFrameworkInnerConfiguration;
  cordova?: QuasarMobileFrameworkInnerConfiguration;
  dark?: boolean | "auto";
  loading?: {
    delay?: number;
    message?: false | string;
    spinnerSize?: number;
    spinnerColor?: string;
    messageColor?: string;
    backgroundColor?: string;
    spinner?: Component;
    customClass?: string;
  };
  loadingBar?: { color?: string; size?: string; position?: string };
  notify?: {
    position?: string;
    timeout?: number;
    textColor?: string;
    actions?: { icon: string; color: string }[];
  };
}

interface QuasarFrameworkConfiguration {
  config?: QuasarFrameworkInnerConfiguration;
  iconSet?: QuasarIconSets;
  lang?: QuasarLanguageCodes;
  cssAddon?: boolean;
  /** @default 'kebab' */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";
  components?: (keyof QuasarPluginOptions["components"])[];
  directives?: (keyof QuasarPluginOptions["directives"])[];
  plugins?: (keyof QuasarPluginOptions["plugins"])[];
}
