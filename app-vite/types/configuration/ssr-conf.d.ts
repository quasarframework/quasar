import type { RolldownOptions } from "rolldown";
import type { GenerateSWOptions, InjectManifestOptions } from "workbox-build";

export interface QuasarSsrManifest {
  [key: string]: string[];
}

/**
 * Properties also available in the SSG configuration inherit their explicitly
 * configured SSG value when omitted here. An SSR value always takes precedence.
 */
export interface QuasarSsrConfiguration {
  /**
   * If a PWA should take over or just a SPA.
   * @default false
   */
  pwa?: boolean;

  /**
   * When using SSR+PWA, this is the name of the
   * PWA index html file that the client-side fallbacks to.
   *
   * Do NOT use index.html as name as it will mess SSR up!
   *
   * @default ssg.pwaOfflineHtmlFilename (when configured), otherwise 'offline.html'
   */
  pwaOfflineHtmlFilename?: string;

  /**
   * Extend/configure the Workbox GenerateSW options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendPWAGenerateSWOptions()`.
   *
   * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @type config {@link GenerateSWOptions}
   */
  extendSSRGenerateSWOptions?: (
    config: GenerateSWOptions
  ) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>;

  /**
   * Extend/configure the Workbox InjectManifest options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendPWAInjectManifestOptions()`.
   *
   * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @type config {@link InjectManifestOptions}
   */
  extendSSRInjectManifestOptions?: (
    config: InjectManifestOptions
  ) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

  /**
   * Configure this for a hybrid SSR + partial CSR (Client-Side Rendering)
   * approach, where you have some Vue Router routes that you want to be
   * rendered on the client-side exclusively.
   *
   * You can use picomatch patterns to match the routes you want to be rendered
   * on the client-side. https://www.npmjs.com/package/picomatch
   *
   * Note on picomatch patterns:
   *   "/admin" matches the exact route only
   *   "/admin/**" matches the exact route and all sub-routes of /admin
   *   "/admin/*" matches only direct sub-routes of /admin
   *   "/admin/{users,settings}" matches both exact routes /admin/users and /admin/settings
   *
   * @example ['/dashboard', '/admin/**']
   * @default ssg.clientSideRenderingRoutes (when configured), otherwise []
   */
  clientSideRenderingRoutes?: string[];

  /**
   * Manually serialize the store state and provide it yourself
   * as window.__INITIAL_STATE__ to the client-side (through a <script> tag)
   * @default ssg.manualStoreSerialization (when configured), otherwise false
   */
  manualStoreSerialization?: boolean;

  /**
   * Manually inject the store state into ssrContext.state
   * @default ssg.manualStoreSsrContextInjection (when configured), otherwise false
   */
  manualStoreSsrContextInjection?: boolean;

  /**
   * Manually handle the store hydration instead of letting Quasar CLI do it.
   *
   * For Pinia: store.state.value = window.__INITIAL_STATE__
   *
   * @default ssg.manualStoreHydration (when configured), otherwise false
   */
  manualStoreHydration?: boolean;

  /**
   * Manually call $q.onSSRHydrated() instead of letting Quasar CLI do it.
   * This announces that client-side code should takeover.
   * @default ssg.manualPostHydrationTrigger (when configured), otherwise false
   */
  manualPostHydrationTrigger?: boolean;

  /**
   * The default port (3000) that the production server should use
   * (gets superseded if process.env.PORT is specified at runtime)
   * @default 3000
   */
  prodPort?: number;

  /**
   * The named exports to use for the production generated SSR index.js script.
   * Works with `false` (no named exports), a single string (one named export),
   * or an array of strings (multiple named exports).
   *
   * Useful for serverless environments where you might want to export the
   * handler function. It creates one or more named exports from the
   * object returned by the defineSsrListen() function in /src-ssr/server file.
   *
   * @default false
   *
   * @example
   * prodScriptNamedExport: ['handler', 'ssr']
   * export const listen = defineSsrListen(() => {
   *   if (import.meta.env.QUASAR_PROD) {
   *     return { handler, ssr }
   *   }
   * })
   *
   * This will generate an SSR index.js with the following exports:
   * const { handler, ssr } = await listen({...})
   * export { handler, ssr }
   *
   * @example
   * prodScriptNamedExport: 'default'
   * export const listen = defineSsrListen(({ app }) => {
   *   if (import.meta.env.QUASAR_PROD) {
   *     return { default: app }
   *   }
   * })
   *
   * This will generate an SSR index.js with the following exports:
   * const listenResult = await listen({...})
   * export default listenResult?.default
   *
   * @example
   * prodScriptNamedExport: 'app'
   * export const listen = defineSsrListen(({ app }) => {
   *   if (import.meta.env.QUASAR_PROD) {
   *     return { app }
   *   }
   * })
   *
   * This will generate an SSR index.js with the following exports:
   * const { app } = await listen({...})
   * export { app }
   *
   * @example 'renderSsrContext' (special case)
   *
   * This will generate an SSR index.js with the following export:
   *   export { render as renderSsrContext }
   * where "render" is the same function used in
   * the /src-ssr/middlewares/render file
   */
  prodScriptNamedExport?: false | string | string[];

  /**
   * List of middleware files in src-ssr/middlewares
   * Order is important.
   */
  middlewares?: string[];

  /**
   * Add/remove/change properties of SSR production generated package.json
   *
   * Can be async. Can directly modify the "pkgJson" parameter or
   * return a new one that will be merged with the default one.
   */
  extendSSRPackageJson?: (pkgJson: { [index in string]: any }) =>
    | void
    | { [index in string]: any }
    | Promise<void | { [index in string]: any }>;

  /**
   * Extend the Rolldown config that is used for the SSR webserver
   * (which includes the SSR middlewares).
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @type config {@link RolldownOptions}
   */
  extendSSRWebserverConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * Extend the underlying SSR manifest file generated by Vite,
   * which is used by the server-side renderer to know which files to preload.
   *
   * Can be async. Can directly modify the "ssrManifest" parameter or
   * return a new one that will be merged with the default one.
   *
   * @type ssrManifest {@link QuasarSsrManifest}
   */
  extendSSRManifestJson?: (
    ssrManifest: QuasarSsrManifest
  ) => void | QuasarSsrManifest | Promise<void | QuasarSsrManifest>;
}
