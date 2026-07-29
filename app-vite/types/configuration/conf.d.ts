import type { DeepNonNullable, DeepRequired } from "ts-essentials";
import type { Options as OpenOptions } from "open";
import type { ServerOptions as ViteServerOptions } from "vite";
import type { VitePluginVueDevToolsOptions } from "vite-plugin-vue-devtools";

import type {
  QuasarAnimations,
  QuasarExtrasIcons,
  QuasarFonts
} from "@quasar/extras";

import type { QuasarBootConfiguration } from "./boot.d.ts";
import type { QuasarBuildConfiguration } from "./build.d.ts";
import type { QuasarCapacitorConfiguration } from "./capacitor-conf.d.ts";
import type { QuasarCordovaConfiguration } from "./cordova-conf.d.ts";
import type { QuasarElectronConfiguration } from "./electron-conf.d.ts";
import type { QuasarFrameworkConfiguration } from "./framework-conf.d.ts";
import type { QuasarPwaConfiguration } from "./pwa-conf.d.ts";
import type { QuasarSsrConfiguration } from "./ssr-conf.d.ts";
import type { QuasarSsgConfiguration } from "./ssg-conf.d.ts";
import type { QuasarMobileConfiguration } from "./mobile-conf.d.ts";
import type { QuasarBexConfiguration } from "./bex-conf.d.ts";

import type { QuasarContext } from "./context.d.ts";

type DevServerOptions = Omit<ViteServerOptions, "open" | "https"> & {
  https?: ViteServerOptions["https"] | boolean;

  /**
   * Automatically open the browser window when the dev server starts.
   * If a string is provided, it will be used as the URL to open.
   * If an object is provided, it will be passed to the `open` package.
   *
   * @default false
   */
  open?: Omit<OpenOptions, "wait"> | boolean;

  /**
   * Automatically open remote Vue DevTools in development mode.
   * Overrides the `--devtools` param in the `quasar dev` command
   * when explicitly specified.
   *
   * @default false
   */
  vueDevtools?: boolean | VitePluginVueDevToolsOptions;
};

/**
 * Use this property to change the default names of some files of your website/app if you have to.
 * All paths must be relative to the root folder of your project.
 *
 * @default
 * {
 *  rootComponent: 'src/App.vue',
 *  router: 'src/router/index',
 *  store: 'src/stores/index',
 *  pwaRegisterServiceWorker: 'src-pwa/register-sw',
 *  pwaServiceWorker: 'src-pwa/sw/custom-sw',
 *  pwaManifestFile: 'src-pwa/manifest.json',
 *  electronMain: 'src-electron/electron-main',
 *  bexManifestFile: 'src-bex/manifest.json'
 * }
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
  /**
   * Boot files to load. Order is important.
   * @type options {@link QuasarBootConfiguration}
   */
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
   * @type fonts {@link QuasarFonts} | icons {@link QuasarExtrasIcons}
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
   *
   * @type options {@link QuasarFrameworkConfiguration}
   */
  framework?: QuasarFrameworkConfiguration;
  /**
   * What [CSS animations](https://v2.quasar.dev/options/animations) to import.
   *
   * @example: [ 'bounceInLeft', 'bounceOutRight' ]
   * @type options {@link QuasarAnimations}
   */
  animations?: "all" | QuasarAnimations[];
  /**
   * Vite server [options](https://vite.dev/config/server-options).
   * Some properties are overwritten based on the Quasar mode you're using in order
   * to ensure a correct config.
   * If a reverse proxy or cloud IDE changes the public origin, configure
   * `origin` and the HMR WebSocket options for the externally visible URL.
   *
   * @type options {@link DevServerOptions}
   */
  devServer?: DevServerOptions;
  /**
   * Build configuration options.
   * @type options {@link QuasarBuildConfiguration}
   */
  build?: QuasarBuildConfiguration;
  /**
   * Change the default name of parts of your app.
   * @type options {@link QuasarSourceFilesConfiguration}
   */
  sourceFiles?: QuasarSourceFilesConfiguration;
}

export interface QuasarHookParams {
  quasarConf: QuasarConf;
}

export interface QuasarPublishParams extends QuasarHookParams {
  /** Argument supplied to the `--publish`/`-P` parameter. */
  arg: string;
  /** Folder where the distributables were built. */
  distDir: string;
}

export interface QuasarConf
  extends BaseQuasarConfiguration, QuasarMobileConfiguration {
  /**
   * PWA specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa).
   * @type options {@link QuasarPwaConfiguration}
   */
  pwa?: QuasarPwaConfiguration;
  /**
   * SSR specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr).
   * @type options {@link QuasarSsrConfiguration}
   */
  ssr?: QuasarSsrConfiguration;
  /**
   * SSG specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-ssg/configuring-ssg).
   * @type options {@link QuasarSsgConfiguration}
   */
  ssg?: QuasarSsgConfiguration;
  /**
   * Capacitor specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor).
   * @type options {@link QuasarCapacitorConfiguration}
   */
  capacitor?: QuasarCapacitorConfiguration;
  /**
   * Cordova specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova).
   * @type options {@link QuasarCordovaConfiguration}
   */
  cordova?: QuasarCordovaConfiguration;
  /**
   * Electron specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron).
   * @type options {@link QuasarElectronConfiguration}
   */
  electron?: QuasarElectronConfiguration;
  /**
   * Bex specific [config](https://v2.quasar.dev/quasar-cli-vite/developing-bex/configuring-bex).
   * @type options {@link QuasarBexConfiguration}
   */
  bex?: QuasarBexConfiguration;
}

interface QuasarMetaConf {
  debugging: boolean;
  needsAppMountHook: boolean;
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
