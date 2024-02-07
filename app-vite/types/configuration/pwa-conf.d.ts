import { BuildOptions as EsbuildConfiguration } from "esbuild";
import { GenerateSWOptions, InjectManifestOptions } from "workbox-build";

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

interface InjectPwaMetaTagsParams {
  pwaManifest: PwaManifestOptions;
  publicPath: string;
}

/**
 * This is the place where you can configure
 * [Workbox](https://developers.google.com/web/tools/workbox)’s
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
   * PWA manifest filename to use on your browser
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
   * @default false
   */
  useCredentialsForManifestTag?: boolean;

  /**
   * Auto inject the PWA meta tags?
   * If using the function form, return HTML tags as one single string.
   * @default true
   */
  injectPwaMetaTags?: boolean | ((injectParam: InjectPwaMetaTagsParams) => string);

  /**
   * Extend the Esbuild config that is used for the custom service worker
   * (if using it through workboxMode: 'InjectManifest')
   */
  extendPWACustomSWConf?: (config: EsbuildConfiguration) => void;

  /**
   * Extend/configure the Workbox GenerateSW options
   */
  extendGenerateSWOptions?: (config: GenerateSWOptions) => void;

  /**
   * Extend/configure the Workbox InjectManifest options
   */
  extendInjectManifestOptions?: (config: InjectManifestOptions) => void;
}
