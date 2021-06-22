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

/**
 * This is the place where you can configure
 * [Workbox](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin)’s
 * behavior and also tweak your `manifest.json`.
 */
export interface QuasarPwaConfiguration {
  workboxPluginMode?: "GenerateSW" | "InjectManifest";
  /**
   * Full option list can be found
   *  [here](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_generatesw_config).
   */
  workboxOptions?: object;
  manifest?: PwaManifestOptions;

  /**
   * Webpack config object for the custom service worker ONLY (`/src-pwa/custom-service-worker`)
   *  when pwa > workboxPluginMode is set to InjectManifest
   */
  extendWebpackCustomSW?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpackCustomSW()` but uses `webpack-chain` instead,
   *  for the custom service worker ONLY (`/src-pwa/custom-service-worker`)
   *  when pwa > workboxPluginMode is set to InjectManifest
   */
  chainWebpackCustomSW?: (chain: WebpackChain) => void;

  /**
   * @default
   * ```typescript
   * {
   *    appleMobileWebAppCapable: 'yes';
   *    appleMobileWebAppStatusBarStyle: 'default';
   *    appleTouchIcon120: 'icons/apple-icon-120x120.png';
   *    appleTouchIcon180: 'icons/apple-icon-180x180.png';
   *    appleTouchIcon152: 'icons/apple-icon-152x152.png';
   *    appleTouchIcon167: 'icons/apple-icon-167x167.png';
   *    appleSafariPinnedTab: 'icons/safari-pinned-tab.svg';
   *    msapplicationTileImage: 'icons/ms-icon-144x144.png';
   *    msapplicationTileColor: '#000000';
   * }
   * ```
   */
  metaVariables?: {
    appleMobileWebAppCapable: string;
    appleMobileWebAppStatusBarStyle: string;
    appleTouchIcon120: string;
    appleTouchIcon180: string;
    appleTouchIcon152: string;
    appleTouchIcon167: string;
    appleSafariPinnedTab: string;
    msapplicationTileImage: string;
    msapplicationTileColor: string;
  };
  metaVariablesFn?: (manifest?: PwaManifestOptions) => PwaMetaVariablesEntry[];
}
