import { QuasarAnimations, QuasarFonts, QuasarIconSets } from "quasar";
import { QuasarEslintConfiguration } from "./eslint";
import { QuasarBootConfiguration } from "./boot";
import { QuasarBuildConfiguration } from "./build";
import { QuasarCapacitorConfiguration } from "./capacitor-conf";
import { QuasarCordovaConfiguration } from "./cordova-conf";
import { QuasarElectronConfiguration } from "./electron-conf";
import { QuasarFrameworkConfiguration } from "./framework-conf";
import { QuasarPwaConfiguration } from "./pwa-conf";
import { QuasarSsrConfiguration } from "./ssr-conf";
import { QuasarMobileConfiguration } from "./mobile-conf";
import { QuasarBexConfiguration } from "./bex";

import { ServerOptions } from "vite";

type QuasarAnimationsConfiguration = "all" | QuasarAnimations[];

/**
 * Use this property to change the default names of some files of your website/app if you have to.
 * All paths must be relative to the root folder of your project.
 *
 * @default
 * ```typescript
 * {
 *  rootComponent: 'src/App.vue',
 *  router: 'src/router/index',
 *  store: 'src/stores/index', // for Pinia
 *  // store: 'src/store/index' // for Vuex
 *  pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
 *  pwaServiceWorker: 'src-pwa/custom-service-worker',
 *  pwaManifestFile: 'src-pwa/manifest.json',
 *  electronMain: 'src-electron/electron-main',
 *  electronPreload: 'src-electron/electron-preload'
 * }
 * ```
 */
interface QuasarSourceFilesConfiguration {
  rootComponent?: string;
  router?: string;
  store?: string;
  pwaRegisterServiceWorker?: string;
  pwaServiceWorker?: string;
  pwaManifestFile?: string;
  electronMain?: string;
  electronPreload?: string;
}

interface BaseQuasarConfiguration {
  /** Boot files to load. Order is important. */
  boot?: QuasarBootConfiguration;
  /**
   * Global CSS/Stylus/SCSS/SASS/... files from `/src/css/`,
   * except for theme files, which are included by default.
   */
  css?: string[];
  /** Enable [PreFetch Feature](/quasar-cli/prefetch-feature). */
  preFetch?: boolean;
  /**
   * What to import from [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) package.
   * @example ['material-icons', 'roboto-font', 'ionicons-v4']
   */
  extras?: (QuasarIconSets | QuasarFonts)[];
  /** Add variables that you can use in index.template.html. */
  htmlVariables?: { [index: string]: string };
  /**
   * What Quasar language pack to use, what Quasar icon
   * set to use for Quasar components.
   */
  framework?: QuasarFrameworkConfiguration;
  /**
   * What [CSS animations](/options/animations) to import.
   * @example: [ 'bounceInLeft', 'bounceOutRight' ]
   */
  animations?: QuasarAnimationsConfiguration | 'all';
  /**
   * Vite server [options](https://vitejs.dev/config/#server-options).
   * Some properties are overwritten based on the Quasar mode you're using in order
   * to ensure a correct config.
   * Note: if you're proxying the development server (i.e. using a cloud IDE),
   * set the `public` setting to your public application URL.
   */
  devServer?: ServerOptions;
  /** Build configuration options. */
  build?: QuasarBuildConfiguration;
  /** Change the default name of parts of your app. */
  sourceFiles?: QuasarSourceFilesConfiguration;

  /**
   * Options with which Quasar CLI will use ESLint
   * @deprecated Use `vite-plugin-checker` instead
   */
  eslint?: QuasarEslintConfiguration;
}

export interface QuasarHookParams {
  quasarConf: QuasarConf;
}

export type QuasarConf = BaseQuasarConfiguration & QuasarMobileConfiguration & {
  /** PWA specific [config](/quasar-cli/developing-pwa/configuring-pwa). */
  pwa?: QuasarPwaConfiguration;
} & {
  /** SSR specific [config](/quasar-cli/developing-ssr/configuring-ssr). */
  ssr?: QuasarSsrConfiguration;
} & {
  /** Capacitor specific [config](/quasar-cli/developing-capacitor-apps/configuring-capacitor). */
  capacitor?: QuasarCapacitorConfiguration;
} & {
  /** Cordova specific [config](/quasar-cli/developing-cordova-apps/configuring-cordova). */
  cordova?: QuasarCordovaConfiguration;
} & {
  /** Electron specific [config](/quasar-cli/developing-electron-apps/configuring-electron). */
  electron?: QuasarElectronConfiguration;
} & {
  /** Bex specific [config](/quasar-cli/developing-bex/configuring-bex). */
  bex?: QuasarBexConfiguration;
};
