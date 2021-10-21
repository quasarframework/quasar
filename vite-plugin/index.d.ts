// @ts-ignore
/// <reference types="@quasar/vite-plugin" />

import type { Plugin } from 'vite'

interface QuasarPluginOpts {
  /**
   * Auto import - how to detect components in your vue files
   *   "kebab": q-carousel q-page
   *   "pascal": QCarousel QPage
   *   "combined": q-carousel QPage
   */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";
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
   *    "ssr-server" (NOT YET AVAILABLE) SSR on server-side
   *    "ssr-client" (NOT YET AVAILABLE) SSR on client-side
   */
  // runMode?: "web-client" | "ssr-client" | "ssr-server";
}

export function quasar(
  opts?: QuasarPluginOpts
): Plugin;
