import { BuildOptions as EsbuildConfiguration } from "esbuild";

export interface QuasarSsrConfiguration {
  /**
   * If a PWA should take over or just a SPA.
   *
   * @default false
   */
  pwa?: boolean;

  /**
   * When using SSR+PWA, this is the name of the
   * PWA index html file that the client-side fallbacks to.
   * For production only.
   *
   * Do NOT use index.html as name as it will mess SSR up!
   *
   * @default offline.html
   */
  ssrPwaHtmlFilename?: string;

  /**
   * Manually serialize the store state and provide it yourself
   * as window.__INITIAL_STATE__ to the client-side (through a <script> tag)
   * (Requires @quasar/app-vite v1.0.0-beta.14+)
   */
  manualStoreSerialization?: boolean;

  /**
   * Manually inject the store state into ssrContext.state
   * (Requires @quasar/app-vite v1.0.0-beta.14+)
   */
  manualStoreSsrContextInjection?: boolean;

  /**
   * Manually handle the store hydration instead of letting Quasar CLI do it.
   * For Pinia: store.state.value = window.__INITIAL_STATE__
   * For Vuex: store.replaceState(window.__INITIAL_STATE__)
   */
  manualStoreHydration?: boolean;

  /**
   * Manually call $q.onSSRHydrated() instead of letting Quasar CLI do it.
   * This announces that client-side code should takeover.
   */
  manualPostHydrationTrigger?: boolean;

  /**
   * The default port (3000) that the production server should use
   * (gets superseded if process.env.PORT is specified at runtime)
   */
  prodPort?: number;

  /**
   * Tell browser when a file from the server should expire from cache
   * (the default value, in ms)
   * Has effect only when server.static() is used
   */
  maxAge?: number;

  /**
   * List of middleware files in src-ssr/middlewares
   * Order is important.
   */
  middlewares?: string[];

  /**
   * Add/remove/change properties of production generated package.json
   */
  extendPackageJson?: (pkg: { [index in string]: any }) => void;

  /**
   * Extend the esbuild config that is used for the SSR webserver
   * (which includes the SSR middlewares)
   */
  extendSSRWebserverConf?: (config: EsbuildConfiguration) => void;
}
