import { QuasarIconSets } from "../extras/icon-set";
import { QuasarLanguageCodes } from "../lang";
import { QuasarComponents, QuasarDirectives, QuasarPlugins } from "../plugin";
import { DeepPartial } from "../ts-helpers";

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
  capacitor: {
    iosStatusBarPadding: boolean;
  };
  cordova: {
    iosStatusBarPadding: boolean;
    backButtonExit: boolean;
  };
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
  plugins?: (keyof QuasarPlugins)[];
  config?: DeepPartial<QuasarFrameworkInnerConfiguration>;
  iconSet?: QuasarIconSets;
  lang?: QuasarLanguageCodes;
  cssAddon?: boolean;
}

interface QuasarAutoFrameworkObjectConfiguration
  extends QuasarBaseFrameworkObjectConfiguration {
  all: "auto";
  /** @default 'kebab' */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";
}

interface QuasarAllFrameworkObjectConfiguration
  extends QuasarBaseFrameworkObjectConfiguration {
  all: true;
}

interface QuasarManualFrameworkObjectConfiguration
  extends QuasarBaseFrameworkObjectConfiguration {
  all: false;
  components?: (keyof QuasarComponents)[];
  directives?: (keyof QuasarDirectives)[];
}

export type QuasarFrameworkConfiguration =
  | "all" // Equal to `{ all: true }`
  | QuasarAutoFrameworkObjectConfiguration
  | QuasarAllFrameworkObjectConfiguration
  | QuasarManualFrameworkObjectConfiguration;
