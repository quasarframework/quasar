import type { HasSsg } from "quasar";
import type { RouteRecordRaw } from "vue-router";

import type { QSsrContext, RenderVueParams } from "../ssr/ssrcontext.d.ts";
import type { QuasarContext } from "../configuration/context.d.ts";
import type {
  QuasarSsgConfiguration,
  SsgPage
} from "../configuration/ssg-conf.d.ts";

export type HasSsgParam = HasSsg<{ ssrContext?: QSsrContext | null }>;

interface SsgRenderPreloadTagCallbackOptions {
  ssrContext: RenderVueParams;
}

export type SsgRenderPreloadTagCallback = (
  file: string,
  options: SsgRenderPreloadTagCallbackOptions
) => string;

export type SsgParseVueRouterParams = {
  /**
   * Vue Router routes definition to parse.
   */
  routes: RouteRecordRaw[];

  /**
   * Optional parent path to use for these routes.
   * @default '/'
   */
  parentPath?: string;

  /**
   * Optional list of routes to ignore during the parsing process.
   * You can use picomatch patterns to match the routes you want to ignore.
   * A matched route is omitted, but its children are still traversed and
   * evaluated against the patterns.
   * https://www.npmjs.com/package/picomatch
   *
   * Note on picomatch patterns:
   *   "/admin" matches the exact route only,
   *   "/admin/**" matches the exact route and all sub-routes of /admin,
   *   "/admin/*" matches only direct sub-routes of /admin,
   *   "/admin/{users,settings}" matches both exact routes /admin/users and /admin/settings
   *
   * @example ['/dashboard', '/admin/**']
   * @default []
   */
  crawlIgnoreRoutes?: string[];

  /**
   * Optional list of dynamic parameters for routes with dynamic segments.
   * Each entry in the array should be an object where the keys are the dynamic
   * segment names and the values are the corresponding values to use for those segments.
   *
   * The expansion uses the vue-router path parser, so all vue-router param
   * syntaxes are supported, with the same semantics as router.resolve().
   *
   * Note on optional route parameters (eg. /user/:id?):
   * Omit the param key or use an empty string as its value to drop the segment.
   * Example: { "/user/:id?": [{}] } or { "/user/:id?": [{ id: "" }] }
   * will generate a SSG page for the /user route.
   *
   * Note on repeatable route parameters (eg. /chapters/:chapter+):
   * Use an array as the value to fill the repeated segments.
   * Example: { "/chapters/:chapter+": [{ chapter: ["one", "two"] }] } generates /chapters/one/two.
   *
   * Note on custom regex parameters (eg. /items/:id(\\d+)):
   * Values are substituted without being validated against the custom regex,
   * matching the router.resolve() behavior.
   *
   * @example { "/user/:id": [{ id: 1 }, { id: 2 }] }
   * @example { "/product/:category/:id": [{ category: "electronics", id: 123 }, { category: "books", id: 456 }] }
   * @default {}
   */
  routesDynamicParamsMap?: Record<
    string,
    Record<string, string | number | (string | number)[]>[]
  >;

  /**
   * Optional flag to enable verbose logging.
   * If true, it will log the ignored routes with dynamic parameters.
   *
   * @default false
   */
  verbose?: boolean;
};

export type SsgParseVueRouterResult = {
  /**
   * Generated SSG pages based on the parsed Vue Router routes.
   */
  ssgPages: SsgPage[];

  /**
   * Indicates whether there are any ignored routes during the parsing process.
   */
  hasIgnoredRoutes: boolean;

  /**
   * List of Vue Router routes that were ignored due to matching
   * the crawlIgnoreRoutes patterns.
   */
  crawlIgnoredSsgPages: SsgPage[];

  /**
   * List of Vue Router routes that were ignored due to
   * having dynamic parameters.
   */
  ignoredDynamicParamSsgPages: SsgPage[];

  /**
   * List of Vue Router routes that were ignored due to being
   * marked as client-side rendered (CSR).
   */
  ignoredCsrSsgPages: SsgPage[];
};

export type SsgParseVueRouterRoutes = (
  params: SsgParseVueRouterParams
) => Promise<SsgParseVueRouterResult>;

export type SsgGetFilenameBasedRoutes = () => Promise<RouteRecordRaw[]>;

export interface SsgGetPagesParams {
  /**
   * The Quasar build context.
   * Same as the one from your /quasar.config file. You can use this to
   * access ctx.appPaths (among other things) to resolve paths to your
   * pages, which is especially useful if you are using tools like
   * tinyglobby to manually read your file system.
   *
   * @type QuasarContext {@link QuasarContext}
   */
  readonly ctx: QuasarContext;

  /**
   * The Quasar SSG configuration (quasar.config file > ssg)
   * @type QuasarSsgConfiguration {@link QuasarSsgConfiguration}
   */
  readonly quasarConfSsg: QuasarSsgConfiguration;

  /**
   * An async built-in helper function that parses your Vue Router routes
   * and automatically builds a list of routes to generate.
   * It will ignore redirects, routes with params, and CSR defined routes.
   * You will need to define and add those SSG pages manually, should you want.
   *
   * @param {SsgParseVueRouterParams} options - The configuration object. {@link SsgParseVueRouterParams}
   * @param {RouteRecordRaw[]} options.routes - Vue Router routes definition to parse. {@link RouteRecordRaw}
   * @param {string} [options.parentPath='/'] - Optional parent path to use for these routes.
   * @param {string[]} [options.crawlIgnoreRoutes=[]] - Optional picomatch patterns for routes to omit while still traversing their children.
   * @param {boolean} [options.verbose=false] - Optional flag to enable verbose logging. If true, it logs ignored routes with dynamic parameters.
   * @returns {Promise<SsgParseVueRouterResult>} {@link SsgParseVueRouterResult}
   */
  parseVueRouterRoutes: SsgParseVueRouterRoutes;

  /**
   * Async helper to get the filename-based routes auto-generated by Vue Router.
   * Can be used only when quasar.config > build > filenameBasedRouting is set to true.
   *
   * @returns {Promise<RouteRecordRaw[]>} Array of Vue Router routes. {@link RouteRecordRaw}
   */
  getFilenameBasedRoutes: SsgGetFilenameBasedRoutes;
}

export type SsgGetPagesCallback = (
  params: SsgGetPagesParams
) => SsgPage[] | Promise<SsgPage[]>;
