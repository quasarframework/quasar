import { BuildOptions as EsbuildConfiguration } from "esbuild";

export interface QuasarSsrConfiguration {
  /**
   * If a PWA should take over or just a SPA.
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
   * @default 'offline.html'
   */
  pwaOfflineHtmlFilename?: string;

  /**
   * Extend/configure the Workbox GenerateSW options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendGenerateSWOptions()`.
   * More info: https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   */
  pwaExtendGenerateSWOptions?: (config: object) => void;

  /**
   * Extend/configure the Workbox InjectManifest options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendInjectManifestOptions()`.
   * More info: https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   */
  pwaExtendInjectManifestOptions?: (config: object) => void;

  /**
   * Manually serialize the store state and provide it yourself
   * as window.__INITIAL_STATE__ to the client-side (through a <script> tag)
   * @default false
   */
  manualStoreSerialization?: boolean;

  /**
   * Manually inject the store state into ssrContext.state
   * @default false
   */
  manualStoreSsrContextInjection?: boolean;

  /**
   * Manually handle the store hydration instead of letting Quasar CLI do it.
   * For Pinia: store.state.value = window.__INITIAL_STATE__
   * For Vuex: store.replaceState(window.__INITIAL_STATE__)
   * @default false
   */
  manualStoreHydration?: boolean;

  /**
   * Manually call $q.onSSRHydrated() instead of letting Quasar CLI do it.
   * This announces that client-side code should takeover.
   * @default false
   */
  manualPostHydrationTrigger?: boolean;

  /**
   * The default port (3000) that the production server should use
   * (gets superseded if process.env.PORT is specified at runtime)
   * @default 3000
   */
  prodPort?: number;

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
   * Extend the Esbuild config that is used for the SSR webserver
   * (which includes the SSR middlewares)
   */
  extendSSRWebserverConf?: (config: EsbuildConfiguration) => void;
}
