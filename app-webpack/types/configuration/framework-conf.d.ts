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

interface RippleQuasarConf {
  early?: boolean;
  stop?: boolean;
  center?: boolean;
  color?: string;
  keyCodes?: number[] | number;
}

type VueClassObjectProp = {
  [value: string]: any
}

type VueClassProp =
  | string
  | Array<VueClassProp>
  | VueClassObjectProp;

type VueStyleObjectProp = Partial<CSSStyleDeclaration>;

type VueStyleProp =
  | string
  | Array<VueStyleProp>
  | VueStyleObjectProp;

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
  lang?: {
    noHtmlAttrs?: boolean;
  };
  loading?: {
    delay?: number;
    message?: false | string;
    html?: boolean;
    boxClass?: string;
    spinnerSize?: number;
    spinnerColor?: string;
    messageColor?: string;
    backgroundColor?: string;
    spinner?: Component;
    customClass?: string;
  };
  ripple?: boolean | RippleQuasarConf;
  loadingBar?: {
    position?: string;
    size?: string;
    color?: string;
    reverse?: boolean;
    skipHijack?: boolean;
  };
  notify?: {
    type?: string;
    color?: string;
    textColor?: string;
    message?: string;
    caption?: string;
    html?: boolean;
    icon?: string;
    iconColor?: string;
    iconSize?: string;
    avatar?: string;
    spinner?: boolean;
    spinnerColor?: string;
    spinnerSize?: string;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom" | "left" | "right" | "center";
    group?: boolean | string | number;
    badgeColor?: string;
    badgeTextColor?: string;
    badgePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    badgeStyle?: VueStyleProp;
    badgeClass?: VueClassProp;
    progress?: boolean;
    progressClass?: VueClassProp;
    classes?: string;
    attrs?: object;
    timeout?: number;
    closeBtn?: boolean | string;
    multiLine?: boolean;
    actions?: { icon: string; color: string }[];
  };
  screen?: {
    bodyClasses?: boolean;
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
