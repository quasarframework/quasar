/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * This is set to boolean `true` when the app is running in development mode.
   */
  readonly QUASAR_DEV: boolean;
  /**
   * This is set to boolean `true` when the app is running in production mode.
   */
  readonly QUASAR_PROD: boolean;
  /**
   * This is set to boolean `true` when the app is running in
   * either development mode or production with debugging enabled.
   */
  readonly QUASAR_DEBUG: boolean;

  /**
   * This is set to the Quasar mode with which the app is running.
   */
  readonly QUASAR_MODE:
    | "spa"
    | "ssr"
    | "ssg"
    | "pwa"
    | "cordova"
    | "capacitor"
    | "electron"
    | "bex";

  /**
   * Is the code running in Quasar SPA mode?
   */
  readonly QUASAR_SPA_MODE: boolean;
  /**
   * Is the code running in Quasar SSR mode?
   */
  readonly QUASAR_SSR_MODE: boolean;
  /**
   * Is the code running in Quasar SSG mode?
   */
  readonly QUASAR_SSG_MODE: boolean;
  /**
   * Is the code running in Quasar PWA mode?
   */
  readonly QUASAR_PWA_MODE: boolean;
  /**
   * Is the code running in Quasar Cordova mode?
   */
  readonly QUASAR_CORDOVA_MODE: boolean;
  /**
   * Is the code running in Quasar Capacitor mode?
   */
  readonly QUASAR_CAPACITOR_MODE: boolean;
  /**
   * Is the code running in Quasar Electron mode?
   */
  readonly QUASAR_ELECTRON_MODE: boolean;
  /**
   * Is the code running in Quasar BEX mode?
   */
  readonly QUASAR_BEX_MODE: boolean;

  /**
   * The target platform the app is running on.
   *
   * When in BEX mode: "chrome", "firefox"
   * When in Electron mode: "darwin", "win32", "linux", "win", "mac", "mas"
   * Any other mode: it is "undefined"
   */
  readonly QUASAR_TARGET:
    | "chrome"
    | "firefox"
    | "all"
    | "darwin"
    | "win32"
    | "linux"
    | "win"
    | "mac"
    | "mas"
    | undefined;

  /**
   * This is set to boolean `true` when the code is running
   * in Quasar SSR mode and on the server-side.
   */
  readonly QUASAR_SERVER: boolean;
  /**
   * This is set to boolean `true` in all cases,
   * EXCEPT when the code is running in
   * Quasar SSR mode and on the server-side.
   */
  readonly QUASAR_CLIENT: boolean;

  /**
   * The possible vue-router running modes.
   */
  readonly QUASAR_VUE_ROUTER_MODE: "hash" | "history" | "abstract";
  /**
   * The Quasar CLI supplied vue-router base url.
   */
  readonly QUASAR_VUE_ROUTER_BASE: string;

  /**
   * Useful for Quasar Electron mode only.
   * It stores the app's running URL, which
   * differs in development and production.
   */
  readonly QUASAR_APP_URL: string;

  /**
   * The configured file name for the PWA service worker.
   * This is only set when running in Quasar PWA mode or
   * Quasar SSR mode with PWA.
   */
  readonly QUASAR_SERVICE_WORKER_FILE: string;
  /**
   * This is to be used on the custom service worker
   * file for Quasar PWA mode only.
   */
  readonly QUASAR_PWA_FALLBACK_HTML: string;
  /**
   * This is to be used on the custom service worker
   * file for Quasar PWA mode only.
   */
  readonly QUASAR_PWA_SERVICE_WORKER_REGEX: string;
}
