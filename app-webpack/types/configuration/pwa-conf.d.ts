import { Configuration as WebpackConfiguration } from "webpack";
import * as WebpackChain from "webpack-chain";

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

interface PwaManifestOptions {
  id?: string;
  background_color?: string;
  categories?: string[];
  description?: string;
  dir?: PwaManifestDirection;
  display?: PwaManifestDisplay;
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

interface PwaMetaVariablesEntry {
  tagName: string;
  attributes: object;
  closeTag?: boolean;
}

interface InjectPwaMetaTagsParams {
  pwaManifest: PwaManifestOptions;
  publicPath: string;
}

/**
 * This is the place where you can configure
 * [Workbox](https://developer.chrome.com/docs/workbox/modules/workbox-webpack-plugin/)’s
 * behavior and also tweak your `manifest.json`.
 */
export interface QuasarPwaConfiguration {
  workboxMode?: "GenerateSW" | "InjectManifest";

  /**
   * Generated service worker filename to use (needs to end with .js)
   * @default sw.js
   */
  swFilename?: string;

  /**
   * PWA manifest filename to use (relative to /src-pwa or absolute path)
   * @default manifest.json
   */
  manifestFilename?: string;

  /**
   * Should you need some dynamic changes to the /src-pwa/manifest.json,
   * use this method to do it.
   */
  extendManifestJson?: (json: PwaManifestOptions) => void;

  /**
   * Does the PWA manifest tag requires crossorigin auth?
   */
  useCredentialsForManifestTag?: boolean;

  /**
   * Auto inject the PWA meta tags?
   * @default true
   */
  injectPwaMetaTags: boolean | ((injectParam: InjectPwaMetaTagsParams) => PwaMetaVariablesEntry[]);

  /**
   * Webpack config object for the custom service worker ONLY (`/src-pwa/custom-service-worker`)
   *  when pwa > workboxMode is set to InjectManifest
   */
  extendWebpackCustomSW?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpackCustomSW()` but uses `webpack-chain` instead,
   *  for the custom service worker ONLY (`/src-pwa/custom-service-worker`)
   *  when pwa > workboxMode is set to InjectManifest
   */
  chainWebpackCustomSW?: (chain: WebpackChain) => void;

  /**
   * Extend/configure the Workbox generateSW options
   * More info [here](https://developer.chrome.com/docs/workbox/reference/workbox-webpack-plugin/)
   */
  extendGenerateSWOptions?: (config: object) => void;

  /**
   * Extend/configure the Workbox injectManifest options
   * More info: [here](https://developer.chrome.com/docs/workbox/reference/workbox-webpack-plugin/)
   */
  extendInjectManifestOptions?: (config: object) => void;
}
