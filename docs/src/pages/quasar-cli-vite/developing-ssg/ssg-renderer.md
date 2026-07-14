---
title: SSG Renderer
desc: (@quasar/app-vite) Configuring the Quasar SSG Renderer.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

When you develop a Static Site Generator (SSG) application with Quasar, the `/src-ssg/ssg-renderer` file is the heart of your generation process. This file is responsible for telling Quasar which pages to generate and how to preload assets for those generated pages.

::: warning
The SSG renderer script is being used for production only ("quasar build -m ssg"). The script will not be invoked in dev mode as it serves no purpose in this case.
:::

## Anatomy

This file exports two main functions: `getSsgPages` and `renderPreloadTag`. The following is the default content of /src-ssg/ssg-renderer:

```tabs /src-ssg/ssg-renderer
<<| js Manually defined routes |>>
import { defineSsgGetPages, defineSsgRenderPreloadTag } from '#q-app'
import routes from '@/router/routes'

export const getSsgPages = defineSsgGetPages(({ parseVueRouterRoutes /*, ctx */ }) => {
  // The use of parseVueRouterRoutes is optional as it's just a helper function.
  return parseVueRouterRoutes({ routes, verbose: true })
})

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
  async ({ getFilenameBasedRoutes, parseVueRouterRoutes /*, ctx */ }) => {
    const routes = await getFilenameBasedRoutes()

    // The use of parseVueRouterRoutes is optional as it's just a helper function.
    return parseVueRouterRoutes({ routes, verbose: true })
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

The `getSsgPages` export uses the `defineSsgGetPages` wrapper. It must return an Array of page objects that tell the SSG engine what html pages to render (based on Vue Router routes). The function passed to `defineSsgGetPages` can be synchronous or asynchronous.

### The Callback Parameters

The callback receives a single argument containing useful helpers:

| Name                     | Description                                                                                                                                                                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ctx`                    | The Quasar build context. Same as the one from your /quasar.config file. You can use this to access `ctx.appPaths` (among other things) to resolve paths to your pages, which is especially useful if you are using tools like tinyglobby to manually read your file system. |
| `parseVueRouterRoutes`   | A built-in helper function that parses your Vue Router routes and automatically builds a list of routes to generate. It will ignore redirects and routes with params. You will need to define and add those SSG pages manually, should you want.                             |
| `getFilenameBasedRoutes` | A built-in helper function when you are using [Filename-Based Routing](/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing), that returns the auto-generated routes by Vue Router.                                                                          |

### The Page Object

Each object in the returned array represents a single HTML page to be generated. It can contain the following properties:

| Property   | Type        | Description                                                                                                                                                                                            |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| route      | string      | **Required!** The vue-router route to render. It must be a valid route in your Vue Router configuration.                                                                                               |
| label      | string      | An optional label to identify the SSG page in your build logs.                                                                                                                                         |
| dir        | string      | The directory to place the generated HTML file in. Must be a relative path to the dist folder. If omitted, the route path determines the directory.                                                    |
| filename   | string      | The name of the generated HTML file. Defaults to "index.html".                                                                                                                                         |
| ssrContext | QSsrContext | An optional SSR context to use when rendering the specific page. If omitted, the default SSR context is used. One important prop for it is `req`, which has the IncomingMessage native node:http type. |

::: warning
When defining the `route` prop of a SSG page, do not include the quasar.config > build.publicPath to it. Use it as a Vue Router route exclusively.
:::

```tabs getSsgPages example
<<| js Explicit SSG pages |>>
import { defineSsgGetPages } from "#q-app"

export const getSsgPages = defineSsgGetPages(
  async ({ ctx }) => {
    return [
      { route: '/' },
      { route: '/second-page' },
      ...(
        ['light', 'dark'].map(theme => ({
          route: '/third-page',
          label: theme,
          filename: `index-${theme}.html`,
          ssrContext: {
            req: {
              headers: {
                cookie: `theme=${theme}`
              }
            }
          }
        }))
      )
    ]
  }
)
<<| js Manually defined routes |>>
import { defineSsgGetPages } from "#q-app"
// Importing the manually defined app routes:
import routes from "@/router/routes"

export const getSsgPages = defineSsgGetPages(
  async ({ parseVueRouterRoutes, ctx }) => {
    // The parseVueRouterRoutes helper is optional, but highly recommended
    // for standard routing setups.
    return parseVueRouterRoutes({ routes, verbose: true })
  }
)
<<| js With filenameBasedRouting |>>
import { defineSsgGetPages } from "#q-app";

export const getSsgPages = defineSsgGetPages(
  async ({ getFilenameBasedRoutes, parseVueRouterRoutes /*, ctx */ }) => {
    const routes = await getFilenameBasedRoutes()

    // The use of parseVueRouterRoutes is optional as it's just a helper function.
    return parseVueRouterRoutes({ routes, verbose: true })
  }
)
```

### Warning on 404 errors

When defining the SSG pages to render, please be aware that your app might have a Vue Router route defined as a catch-all which handles this error:

```js /src/router/routes file
// Example of route for catching 404 with Vue Router
{ path: '/:catchAll(.*)*', component: () => import('@/pages/Error404.vue') }
```

Therefore, if your `getSsgPages()` returns a SSG page configured with a non-existent Vue Router route, the html page that will be generated will essentially contain such a 404 rendered page and not your probably expected content and no build-time error will be generated.

As a side-note, please read the [SSG 404 Error Page](/quasar-cli-vite/developing-ssg/ssg-404-error-page) too. By default, such a page is generated so you don't need a specific entry in the returned array of your `getSsgPages()` for it.

## Rendering Preload Tags

To ensure boost performance and Lighthouse scores, Quasar allows you to inject `<link rel="preload">` and `<link rel="modulepreload">` tags into the `<head>` of your generated HTML files.
The `renderPreloadTag` evaluates the assets required by the current page and returns a string with the appropriate HTML output.

Out of the box, Quasar provides a robust default setup using Regex to match file extensions (.js, .css, fonts, and images) and applies the correct rel, as, and type attributes. You can customize this function to support additional file types or custom caching strategies.

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
