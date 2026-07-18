import type { RolldownOptions } from "rolldown";
import type { GenerateSWOptions, InjectManifestOptions } from "workbox-build";

import type { TSConfig } from "./build.d.ts";

// Derived from https://developer.mozilla.org/en-US/docs/Web/Manifest
type PwaManifestDirection = "ltr" | "rtl" | "auto";

type PwaManifestDisplay =
  | "fullscreen"
  | "standalone"
  | "minimal-ui"
  | "browser";

type PwaManifestOrientation =
  | "any"
  | "natural"
  | "landscape"
  | "landscape-primary"
  | "landscape-secondary"
  | "portrait"
  | "portrait-primary"
  | "portrait-secondary";

interface PwaManifestScreenshot {
  src: string;
  sizes: string;
  type: string;
}

interface PwaManifestServiceWorker {
  src: string;
}

interface PwaManifestRelatedApplications {
  platform?: string;
  url?: string;
  id?: string;
}

interface PwaManifestIcon {
  src: string;
  sizes: string;
  type?: string;
  purpose?: "badge" | "maskable" | "any";
}

export interface PwaManifestOptions {
  id?: string;
  background_color?: string;
  categories?: string[];
  description?: string;
  dir?: PwaManifestDirection;
  display?: PwaManifestDisplay;
  display_override?: PwaManifestDisplay[];
  iarc_rating_id?: string;
  icons?: PwaManifestIcon | PwaManifestIcon[];
  inject?: boolean;
  lang?: string;
  name: string;
  orientation?: PwaManifestOrientation;
  prefer_related_applications?: boolean;
  related_applications?: PwaManifestRelatedApplications[];
  scope?: string;
  screenshots?: PwaManifestScreenshot[];
  serviceworker?: PwaManifestServiceWorker;
  short_name?: string;
  start_url?: string;
  theme_color?: string;
}

interface InjectPWAMetaTagsParams {
  pwaManifest: PwaManifestOptions;
  publicPath: string;
}

/**
 * This is the place where you can configure
 * [Workbox](https://developers.google.com/web/tools/workbox)’s
 * behavior and also tweak your `manifest.json`.
 */
export interface QuasarPwaConfiguration {
  /**
   * Workbox operating mode.
   * @default 'GenerateSW'
   */
  workboxMode?: "GenerateSW" | "InjectManifest";

  /**
   * Generated service worker filename to use (needs to end with .js)
   * @default sw.js
   */
  swFilename?: string;

  /**
   * PWA manifest filename to use on your browser
   * @default manifest.json
   */
  manifestFilename?: string;

  /**
   * Should you need some dynamic changes to the /src-pwa/manifest.json,
   * use this method to do it.
   *
   * Can be async. Can directly modify the "json" parameter or
   * return a new one that will be merged with the default one.
   *
   * @param json {@link PwaManifestOptions}
   */
  extendPWAManifestJson?: (
    json: PwaManifestOptions
  ) => void | PwaManifestOptions | Promise<void | PwaManifestOptions>;

  /**
   * Does the PWA manifest tag requires crossorigin auth?
   * @default false
   */
  useCredentialsForManifestTag?: boolean;

  /**
   * Auto inject the PWA meta tags?
   * If using the function form, return HTML tags as one single string.
   * @default true
   * @type injectParam {@link InjectPWAMetaTagsParams}
   */
  injectPWAMetaTags?:
    | boolean
    | ((injectParam: InjectPWAMetaTagsParams) => string);

  /**
   * Extend the Rolldown config that is used for the custom service worker
   * (if using it through workboxMode: 'InjectManifest').
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @type config {@link RolldownOptions}
   */
  extendPWACustomSWConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * Extend/configure the Workbox GenerateSW options.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @type config {@link GenerateSWOptions}
   */
  extendPWAGenerateSWOptions?: (
    config: GenerateSWOptions
  ) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>;

  /**
   * Extend/configure the Workbox InjectManifest options.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @type config {@link InjectManifestOptions}
   */
  extendPWAInjectManifestOptions?: (
    config: InjectManifestOptions
  ) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

  /**
   * Extend the generated `.quasar/tsconfig.pwa-sw.json` file.
   *
   * NOT async! Can directly modify the "tsConfig" parameter or
   * return a new one that will be merged with the default one.
   *
   * @type tsConfig {@link TSConfig}
   */
  extendPWASwTsConfig?: (tsConfig: TSConfig) => void | TSConfig;
}
