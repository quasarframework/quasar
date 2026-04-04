import { DeepRequired, DeepNonNullable } from "ts-essentials";
import {
  QuasarFonts,
  QuasarAnimations,
  QuasarExtrasIcons
} from "@quasar/extras";
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

import { Options as OpenOptions } from "open";
import { ServerOptions as ViteServerOptions } from "vite";
import { QuasarContext } from "./context";

type DevServerOptions = Omit<ViteServerOptions, "open" | "https"> & {
  open?: Omit<OpenOptions, "wait"> | boolean;
  https?: ViteServerOptions["https"] | boolean;
};

/**
 * Use this property to change the default names of some files of your website/app if you have to.
 * All paths must be relative to the root folder of your project.
 *
 * @default
 * ```typescript
 * {
 *  rootComponent: 'src/App.vue',
 *  router: 'src/router/index',
 *  store: 'src/stores/index',
 *  pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
 *  pwaServiceWorker: 'src-pwa/custom-service-worker',
 *  pwaManifestFile: 'src-pwa/manifest.json',
 *  electronMain: 'src-electron/electron-main',
 *  bexManifestFile: 'src-bex/manifest.json'
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
  bexManifestFile?: string;
}

interface BaseQuasarConfiguration {
  /** Boot files to load. Order is important. */
  boot?: QuasarBootConfiguration;
  /**
   * Global CSS/Stylus/SCSS/SASS/... files from `/src/css/`,
   * except for theme files, which are included by default.
   */
  css?: string[];
  /** Enable [PreFetch Feature](https://v2.quasar.dev/quasar-cli-vite/prefetch-feature). */
  preFetch?: boolean;
  /**
   * What to import from [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) package.
   * @example ['material-icons', 'roboto-font', 'ionicons-v4']
   */
  extras?: (QuasarFonts | QuasarExtrasIcons)[];
  /**
   * Add variables that you can use in index.html
   *
   * @see https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#htmlvariables
   */
  htmlVariables?: Record<string, any>;
  /**
   * What Quasar language pack to use, what Quasar icon
   * set to use for Quasar components, etc.
   */
  framework?: QuasarFrameworkConfiguration;
  /**
   * What [CSS animations](https://v2.quasar.dev/options/animations) to import.
   *
   * @example: [ 'bounceInLeft', 'bounceOutRight' ]
   */
  animations?: "all" | QuasarAnimations[];
  /**
   * Vite server [options](https://vitejs.dev/config/#server-options).
   * Some properties are overwritten based on the Quasar mode you're using in order
   * to ensure a correct config.
   * Note: if you're proxying the development server (i.e. using a cloud IDE),
   * set the `public` setting to your public application URL.
   */
  devServer?: DevServerOptions;
  /** Build configuration options. */
  build?: QuasarBuildConfiguration;
  /** Change the default name of parts of your app. */
  sourceFiles?: QuasarSourceFilesConfiguration;
}

export interface QuasarHookParams {
  quasarConf: QuasarConf;
}

export interface QuasarConf
  extends BaseQuasarConfiguration, QuasarMobileConfiguration {
  /** PWA specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa). */
  pwa?: QuasarPwaConfiguration;
  /** SSR specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr). */
  ssr?: QuasarSsrConfiguration;
  /** Capacitor specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor). */
  capacitor?: QuasarCapacitorConfiguration;
  /** Cordova specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova). */
  cordova?: QuasarCordovaConfiguration;
  /** Electron specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron). */
  electron?: QuasarElectronConfiguration;
  /** Bex specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-bex/configuring-bex). */
  bex?: QuasarBexConfiguration;
}

interface QuasarMetaConf {
  debugging: boolean;
  needsAppMountHook: boolean;
  vueDevtools: boolean | Record<string, any>;
  versions: {
    capacitor?: number;
    capacitorPluginApp?: number | true;
    capacitorPluginSplashscreen?: number | true;
  };
  css: Record<string, string>;

  hasLoadingBarPlugin: boolean;
  hasMetaPlugin: boolean;

  hasStore: boolean;
  storePackage: "pinia";

  APP_URL?: string;
  getUrl?: (hostname: string) => string;

  fileEnv: Record<string, string>;
  openBrowser: boolean | Record<string, any>;
  entryScript: {
    absolutePath: string;
    webPath: string;
    tag: string;
  };

  pwaManifestFile?: string;
  bexManifestFile?: string;
}

// Not exactly accurate as some of the properties are still left nullable
// TODO: improve this regarding the nullable precision
export interface ResolvedQuasarConf extends DeepRequired<
  DeepNonNullable<QuasarConf>
> {
  ctx: QuasarContext;
  /** @internal */
  metaConf: QuasarMetaConf;
}

type IsObject<T> =
  T extends Record<string, any>
    ? T extends any[]
      ? false
      : T extends Function
        ? false
        : true
    : false;
type MaxDepth = 5; // to avoid breaking the type system due to infinite complexity
type BuildPaths<
  T extends Record<string, any>,
  ParentKey extends string = "",
  Depth extends readonly number[] = []
> = [Depth["length"]] extends [MaxDepth]
  ? never
  : {
      [K in keyof T]: IsObject<T[K]> extends true
        ?
            | `${ParentKey}${K & string}`
            | `${ParentKey}${K & string}.${BuildPaths<T[K], "", [...Depth, 1]>}`
        : `${ParentKey}${K & string}`;
    }[keyof T];
type DotNotation<
  T extends Record<string, any>,
  Path extends BuildPaths<T>
> = Path extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? IsObject<T[First]> extends true
      ? DotNotation<T[First], Rest & BuildPaths<T[First]>>
      : never
    : never
  : Path extends keyof T
    ? T[Path]
    : never;

type QuasarConfPath = BuildPaths<ResolvedQuasarConf>;
export type ResolvedQuasarConfValue<Path extends QuasarConfPath> = DotNotation<
  ResolvedQuasarConf,
  Path
>;
