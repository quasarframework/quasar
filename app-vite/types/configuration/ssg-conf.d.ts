import type { RolldownOptions } from "rolldown";
import type { GenerateSWOptions, InjectManifestOptions } from "workbox-build";

interface QuasarSsrManifest {
  [key: string]: string[];
}

export interface QuasarSsgConfiguration {
  /**
   * If a PWA should take over or just a SPA.
   * @default false
   */
  pwa?: boolean;

  /**
   * When using SSG+PWA, this is the name of the
   * PWA index html file that the client-side fallbacks to.
   *
   * Make sure to name it so that the SSG generated html files
   * don't conflict with it! Also, it shouldn't clash with the
   * "clientSideRenderingHtmlFilename" option if you are using that.
   *
   * @default 'offline.html'
   */
  pwaOfflineHtmlFilename?: string;

  /**
   * The name of the html file that will be used for the 404 page.
   * If set to false, no 404 page will be generated.
   *
   * You will need to properly configure the webserver to serve this
   * file for 404 errors.
   *
   * Make sure to name it so that the SSG generated html files
   * don't conflict with it!
   *
   * @default '404.html'
   */
  error404HtmlFilename?: string | false;

  /**
   * Configure this for a hybrid SSG + partial CSR (Client-Side Rendering)
   * build, where you want the client to use an empty shell html for some
   * of the pages (as if those pages are part of a SPA) and let the client-side
   * code take over and render the page.
   *
   * For production only. You will need to properly configure the webserver
   * to fallback to this html file for the pages that are not pre-rendered by SSG.
   *
   * Make sure to name it so that the SSG generated html files
   * don't conflict with it!
   *
   * If you are building a SSG+PWA app, you might want to directly use the
   * `pwaOfflineHtmlFilename` as the empty shell html file instead,
   * as it will have the same content. Otherwise, make sure to use a different
   * name otherwise it will clash with the `pwaOfflineHtmlFilename` one!
   *
   * If not explicitly configured and `clientSideRenderingRoutes`
   * is not its default value (an empty array), then this option will
   * default to 'csr.html'.
   *
   * @default false | 'csr.html'
   */
  clientSideRenderingHtmlFilename?: string | false;

  /**
   * Configure this for a hybrid SSG + partial CSR (Client-Side Rendering)
   * approach, where you have some Vue Router routes that you want to be
   * rendered on the client-side exclusively.
   *
   * When not also specifying `clientSideRenderingHtmlFilename`, the default
   * value for it becomes 'csr.html'.
   *
   * For production, you will need to properly configure the webserver
   * to fallback to the `clientSideRenderingHtmlFilename` for the pages that
   * are not pre-rendered by SSG.
   *
   * You can use picomatch patterns to match the routes you want to be rendered
   * on the client-side. https://www.npmjs.com/package/picomatch
   *
   * @example ['/dashboard', '/admin/**']
   * @default []
   */
  clientSideRenderingRoutes?: string[];

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
  extendSSGGenerateSWOptions?: (
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
  extendSSGInjectManifestOptions?: (
    config: InjectManifestOptions
  ) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

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
   *
   * For Pinia: store.state.value = window.__INITIAL_STATE__
   *
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
   * Extend the Rolldown config that is used for the SSG renderer,
   * which is your /src-ssg/ssg-renderer file.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @type config {@link RolldownOptions}
   */
  extendSSGRendererConf?: (
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
  extendSSGManifestJson?: (
    ssrManifest: QuasarSsrManifest
  ) => void | QuasarSsrManifest | Promise<void | QuasarSsrManifest>;
}
