import { QuasarAnimations, QuasarFonts, QuasarIconSets } from "quasar";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import { QuasarBootConfiguration } from "./boot";
import { QuasarBuildConfiguration } from "./build";
import { QuasarCapacitorConfiguration } from "./capacitor-conf";
import { QuasarCordovaConfiguration } from "./cordova-conf";
import { QuasarElectronConfiguration } from "./electron-conf";
import { QuasarFrameworkConfiguration } from "./framework-conf";
import { QuasarPwaConfiguration } from "./pwa-conf";
import { QuasarSsrConfiguration } from "./ssr-conf";

type QuasarAnimationsConfiguration = "all" | QuasarAnimations[];

interface QuasarDevServerConfiguration
  extends Omit<WebpackDevServerConfiguration, "open"> {
  /**
   * Behind the scenes, webpack devServer `open` property is always set to false
   *  and that feature is delegated to `open` library.
   * When a string is provided, it's used as if it was `open.Options.app` value
   *  to define which browser must be open.
   *
   * @link https://github.com/sindresorhus/open/blob/ed757758dd556ae561b58b80ec7dee5e7c6ffddc/test.js#L10-L21
   * @link https://github.com/sindresorhus/open/blob/ed757758dd556ae561b58b80ec7dee5e7c6ffddc/index.d.ts#L26-L33
   */
  open: boolean | string;
}

/**
 * Use this property to change the default names of some files of your website/app if you have to.
 * All paths must be relative to the root folder of your project.
 *
 * @default
 * ```typescript
 * {
 *  rootComponent: 'src/App.vue',
 *  router: 'src/router/index',
 *  store: 'src/store/index',
 *  indexHtmlTemplate: 'src/index.template.html',
 *  registerServiceWorker: 'src-pwa/register-service-worker',
 *  serviceWorker: 'src-pwa/custom-service-worker',
 *  electronMain: 'src-electron/electron-main',
 *  electronPreload: 'src-electron/electron-preload'
 *  ssrServerIndex: 'src-ssr/index.js'
 * }
 * ```
 */
interface QuasarSourceFilesConfiguration {
  rootComponent?: string;
  router?: string;
  store?: string;
  indexHtmlTemplate?: string;
  registerServiceWorker?: string;
  serviceWorker?: string;
  electronMain?: string;
  electronPreload?: string;
  ssrServerIndex?: string;
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
  /** Add/remove files/3rd party libraries to/from vendor chunk. */
  vendor?: {
    add: string[];
    remove: string[];
  };
  /**
   * Add support for TypeScript.
   *
   * @default false
   */
  supportTS?: boolean | { tsLoaderConfig: object; tsCheckerConfig: object };
  /** Add variables that you can use in index.template.html. */
  htmlVariables?: { [index: string]: string };
  /**
   * What Quasar language pack to use, what Quasar icon
   * set to use for Quasar components.
   */
  framework?: QuasarFrameworkConfiguration;
  /**
   * What [CSS animations](/options/animations) to import.
   * Example: _['bounceInLeft', 'bounceOutRight']_
   * */
  animations?: QuasarAnimationsConfiguration;
  /**
   * Webpack dev server [options](https://webpack.js.org/configuration/dev-server/).
   * Some properties are overwritten based on the Quasar mode you're using in order
   * to ensure a correct config.
   * Note: if you're proxying the development server (i.e. using a cloud IDE),
   * set the `public` setting to your public application URL.
   */
  devServer?: QuasarDevServerConfiguration;
  /** Build configuration options. */
  build?: QuasarBuildConfiguration;
  /** Change the default name of parts of your app. */
  sourceFiles?: QuasarSourceFilesConfiguration;
}

export interface QuasarHookParams {
  quasarConf: QuasarConf;
}

export type QuasarConf = BaseQuasarConfiguration & {
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
};
