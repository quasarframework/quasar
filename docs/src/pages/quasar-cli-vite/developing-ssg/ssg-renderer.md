---
title: SSG Renderer
desc: (@quasar/app-vite) Configuring the Quasar SSG Renderer.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

The `/src-ssg/ssg-renderer` file tells Quasar which routes to render during a production build. It can also customize the preload tags added for each page's assets.

::: warning
The SSG renderer runs only for `quasar build -m ssg`. Development mode renders requested routes on demand and does not invoke `getSsgPages()`.
:::

## Anatomy

The file exports `getSsgPages` and can optionally export `renderPreloadTag`. The generated template includes both:

```tabs /src-ssg/ssg-renderer
<<| js Manually defined routes |>>
import { defineSsgGetPages, defineSsgRenderPreloadTag } from '#q-app'
import routes from '@/router/routes'

export const getSsgPages = defineSsgGetPages(
  async ({ parseVueRouterRoutes }) => {
    // The use of parseVueRouterRoutes is optional as it's just a helper function.
    const { ssgPages } = await parseVueRouterRoutes({ routes, verbose: true })
    return ssgPages
  }
)

const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

export const renderPreloadTag = defineSsgRenderPreloadTag(
  (file /* , { ssrContext } */) => {
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    }

    return ''
  }
)
<<| js With filenameBasedRouting |>>
import { defineSsgGetPages, defineSsgRenderPreloadTag } from '#q-app'

export const getSsgPages = defineSsgGetPages(
  async ({ getFilenameBasedRoutes, parseVueRouterRoutes }) => {
    const routes = await getFilenameBasedRoutes()

    // The use of parseVueRouterRoutes is optional as it's just a helper function.
    const { ssgPages } = await parseVueRouterRoutes({ routes, verbose: true })

    return ssgPages
  }
)

const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

export const renderPreloadTag = defineSsgRenderPreloadTag(
  (file /* , { ssrContext } */) => {
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    }

    return ''
  }
)
```

## Defining SSG Pages

The `getSsgPages` export uses the `defineSsgGetPages` wrapper. It returns an array of page definitions and may be synchronous or asynchronous. The build stops when the array is empty.

```tabs
<<| ts getSsgPages Signature |>>
type SsgGetPagesCallback = (
  params: SsgGetPagesParams
) => SsgPage[] | Promise<SsgPage[]>;

interface SsgGetPagesParams {
  /**
   * The Quasar build context.
   * Same as the one from your /quasar.config file. You can use this to
   * access ctx.appPaths (among other things) to resolve paths to your
   * pages, which is especially useful if you are using tools like
   * tinyglobby to manually read your file system.
   *
   * @type QuasarContext
   */
  readonly ctx: QuasarContext;

  /**
   * The Quasar SSG configuration (quasar.config file > ssg)
   * @type QuasarSsgConfiguration
   */
  readonly quasarConfSsg: QuasarSsgConfiguration;

  /**
   * Async built-in helper function that parses your Vue Router routes
   * and automatically builds a list of routes to generate.
   * It will ignore redirects, routes with params, and CSR defined routes.
   * You will need to define and add those SSG pages manually, should you want.
   *
   * @param {SsgParseVueRouterParams} options - The configuration object.
   * @param {RouteRecordRaw[]} options.routes - Vue Router routes definition to parse.
   * @param {string} [options.parentPath='/'] - Optional parent path to use for these routes.
   * @param {string[]} [options.crawlIgnoreRoutes=[]] - Optional picomatch patterns for routes to omit while still traversing their children.
   * @param {Record<string, Record<string, string | number | (string | number)[]>[]>} [options.routesDynamicParamsMap={}] - Optional map of dynamic parameters for routes with dynamic segments.
   * @param {boolean} [options.verbose=false] - Optional flag to enable verbose logging. If true, it logs ignored routes with dynamic parameters.
   * @returns {Promise<SsgParseVueRouterResult>}
   */
  parseVueRouterRoutes: SsgParseVueRouterRoutes;

  /**
   * Async helper to get the filename-based routes auto-generated by Vue Router.
   * Can be used only when quasar.config > build > filenameBasedRouting is set to true.
   *
   * @returns {Promise<RouteRecordRaw[]>} Array of Vue Router routes.
   */
  getFilenameBasedRoutes: SsgGetFilenameBasedRoutes;
}

type SsgParseVueRouterRoutes = (
  params: SsgParseVueRouterParams
) => Promise<SsgParseVueRouterResult>;

type SsgParseVueRouterParams = {
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
   *   "/admin" matches the exact route only
   *   "/admin/**" matches the exact route and all sub-routes of /admin
   *   "/admin/*" matches only direct sub-routes of /admin
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

type SsgParseVueRouterResult = {
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
<<| ts SsgPage Signature |>>
type SsgPageSsrContext = Partial<
  Omit<QSsrContext, "req" | "res">
> & {
  req?: Partial<QSsrContext["req"]>;
  res?: Partial<QSsrContext["res"]>;
};

interface SsgPage {
  /**
   * The vue-router route to render.
   * It must be a valid route in your Vue Router configuration.
   */
  route: string;

  /**
   * The original Vue Router route object.
   */
  vueRouterRoute?: RouteRecordRaw;

  /**
   * Optional label to identify the SSG page in logs.
   */
  label?: string;

  /**
   * Optional directory to place the generated HTML file in.
   * Must be a relative path that resolves inside the dist folder.
   * It will be joined with the quasar.config > build > distDir.
   * Absolute paths, parent traversal and symlink escapes are rejected.
   * If not provided, the route will be used to determine the directory.
   */
  dir?: string;

  /**
   * Optional filename to use for the generated HTML file.
   * Must resolve inside the dist folder.
   * Absolute paths, parent traversal and symlink escapes are rejected.
   * @default 'index.html'
   */
  filename?: string;

  /**
   * Optional SSR context to use when rendering the specific page.
   * If omitted, the default SSR context is used. One important prop
   * for it is `req`, which has the IncomingMessage native node:http
   * type. Gets merged into the ssrContext so you don't have to
   * define all its props.
   *
   * @type SsgPageSsrContext
   */
  ssrContext?: SsgPageSsrContext;

  /**
   * Callback function that is called after rendering the SSG page.
   * You can use this to optionally modify the generated HTML content
   * before it is written to disk.
   *
   * If you return a string, it will replace the generated HTML content.
   * If you don't return anything, the generated HTML content will be used as-is.
   *
   * Example usage:
   * transformHtml: html => "<!-- This HTML was generated by Quasar SSG -->\n" + html
   *
   * @param {string} html - The rendered HTML content for the SSG page.
   * @returns {string | Promise<string> | void | Promise<void>} The modified HTML content or void.
   */
  transformHtml?: (
    html: string
  ) => string | Promise<string> | void | Promise<void>;
}
```

::: warning
When defining the `route` prop of a SSG page, do not include the quasar.config > build.publicPath to it. Use it as a Vue Router route exclusively.
:::

```tabs getSsgPages example
<<| js Dynamic routes from data |>>
import { defineSsgGetPages } from '#q-app'
import products from '@/data/products.json'

export const getSsgPages = defineSsgGetPages(() => [
  { route: '/' },
  ...products.map(product => ({
    route: `/products/${product.slug}`,
    label: product.name
  }))
])
<<| js Manually defined routes |>>
import { defineSsgGetPages } from '#q-app'
// Importing the manually defined app routes:
import routes from '@/router/routes'

export const getSsgPages = defineSsgGetPages(
  async ({ parseVueRouterRoutes }) => {
    // The parseVueRouterRoutes helper is optional, but highly recommended
    // for standard routing setups.
    const { ssgPages } = await parseVueRouterRoutes({ routes, verbose: true })
    return ssgPages
  }
)
<<| js With filenameBasedRouting |>>
import { defineSsgGetPages } from '#q-app'

export const getSsgPages = defineSsgGetPages(
  async ({ getFilenameBasedRoutes, parseVueRouterRoutes }) => {
    const routes = await getFilenameBasedRoutes()

    // The use of parseVueRouterRoutes is optional as it's just a helper function.
    const { ssgPages } = await parseVueRouterRoutes({ routes, verbose: true })

    return ssgPages
  }
)
```

### Warning on 404 errors

Your app will commonly have a Vue Router catch-all route:

```js /src/router/routes file
// Example of route for catching 404 with Vue Router
{ path: '/:catchAll(.*)*', component: () => import('@/pages/Error404.vue') }
```

If a page definition contains a route that does not otherwise exist, Vue Router resolves it to this catch-all and Quasar writes the rendered 404 markup. This is valid rendering, so the build cannot infer that the route was a mistake.

Quasar generates the configured [SSG 404 Error Page](/quasar-cli-vite/developing-ssg/ssg-404-error-page) separately, so do not add a page definition for the default `404.html`.

## Rendering Preload Tags

Quasar can inject `<link rel="preload">` and `<link rel="modulepreload">` tags for assets used by each generated page. `renderPreloadTag` receives each asset URL and returns its HTML tag.

The generated renderer handles JavaScript, CSS, WOFF fonts, and common image formats. Customize it to omit expensive image preloads or support another asset type.

```js renderPreloadTag example
import { defineSsgRenderPreloadTag } from '#q-app'

const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

export const renderPreloadTag = defineSsgRenderPreloadTag(
  (file, { ssrContext }) => {
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    }

    return '' // Return empty string if no preload tag is needed
  }
)
```

Always ensure that `crossorigin` is applied appropriately based on your CORS setup and where your assets are hosted. The default template assumes standard local or standard CDN hosting.
