// @ts-ignore
/// <reference types="@quasar/vite-plugin" />

import type { Plugin } from "vite";

export interface QuasarPluginOpts {
  /**
   * Auto import - how to detect components in your vue files
   *   "kebab": q-carousel q-page
   *   "pascal": QCarousel QPage
   *   "combined": q-carousel QPage
   */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";

  /**
   * Auto import - which file extensions should be interpreted as referring to Vue SFC?
   * @default [ 'vue' ]
   */
  autoImportVueExtensions?: string[];

  /**
   * Auto import - which file extensions should be interpreted as referring to script files?
   * @default [ 'js', 'jsx', 'ts', 'tsx' ]
   */
  autoImportScriptExtensions?: string[];

  /**
   * Would you like to use Quasar's SCSS/Sass variables?
   *   true
   *      --> yes, all my vue files will be able to use $primary etc
   *   false
   *      --> no, don't make the variables available in vue files
   *   "src/my-variables.sass"
   *      --> yes, and I'd also like to customize those variables
   */
  sassVariables?: string | boolean;

  /**
   * How will Quasar be used? In a:
   *    "web-client" (default)
   *    "ssr-server" (used by @quasar/app-vite)
   *    "ssr-client" (used by @quasar/app-vite)
   */
  runMode?: "web-client" | "ssr-client" | "ssr-server";

  /**
   * Treeshake Quasar's UI on dev too?
   * Recommended to leave this as false for performance reasons.
   * @default false
   */
  devTreeshaking?: boolean;
}

export function quasar(opts?: QuasarPluginOpts): Plugin;

// `TransformAssetUrls` copy of https://github.com/vuejs/vue-next/blob/2c221fcd497d1541e667892ed908631df7e4a745/packages/compiler-sfc/src/compileTemplate.ts#L67
export interface AssetURLTagConfig {
  [name: string]: string[];
}

export interface AssetURLOptions {
  /**
   * If base is provided, instead of transforming relative asset urls into
   * imports, they will be directly rewritten to absolute urls.
   */
  base?: string | null;
  /**
   * If true, also processes absolute urls.
   */
  includeAbsolute?: boolean;
  tags?: AssetURLTagConfig;
}

export type TransformAssetUrls = AssetURLOptions | AssetURLTagConfig | boolean;

export const transformAssetUrls: AssetURLOptions;
