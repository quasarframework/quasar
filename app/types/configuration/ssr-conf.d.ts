import { Configuration as WebpackConfiguration } from "webpack";
import * as WebpackChain from "webpack-chain";

export interface QuasarSsrConfiguration {
  /**
   * If a PWA should take over or just a SPA.
   * When used in object form, you can specify Workbox options
   *  which will be applied on top of `pwa > workboxOptions`.
   *
   * @default false
   */
  pwa?: boolean | object;

  /**
   * Manually call store.replaceState(window.__INITIAL_STATE__)
   * instead of letting Quasar CLI do it
   */
  manualStoreHydration?: boolean;

  /**
   * Manually call $q.onSSRHydrated()
   * instead of letting Quasar CLI do it
   */
  manualPostHydrationTrigger?: boolean;

  /**
   * Tell browser when a file from the server should expire from cache
   * (the default value, in ms)
   * Has effect only when server.static() is used
   */
  maxAge?: number;

  /**
   * Add/remove/change properties of production generated package.json
   */
  extendPackageJson?: (pkg: { [index in string]: any }) => void;

  /**
   * Webpack config object for the Webserver
   * which includes the SSR middleware
   */
  extendWebpackWebserver?: (config: WebpackConfiguration) => void;

  /**
   * Equivalent to `extendWebpackWebserver()` but uses `webpack-chain` instead.
   * Handles the Webserver webpack config ONLY which includes the SSR middleware
   */
  chainWebpackWebserver?: (chain: WebpackChain) => void;
}
