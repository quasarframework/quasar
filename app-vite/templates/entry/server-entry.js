/* eslint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config file > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/
import { createApp<%= metaConf.hasStore && ssr.manualStoreSsrContextInjection !== true ? ', unref' : '' %> } from 'vue'

<% extras.length !== 0 && extras.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/<%= asset %>/<%= asset %>.css'
<% }) %>

<% animations.length !== 0 && animations.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/animate/<%= asset %>.css'
<% }) %>

// We load Quasar stylesheet file
import 'quasar/dist/quasar.<%= metaConf.css.quasarSrcExt %>'

<% if (framework.cssAddon) { %>
// We add Quasar addons, if they were requested
import 'quasar/src/css/flex-addon.sass'
<% } %>

<% css.length !== 0 && css.filter(asset => asset.server !== false).forEach(asset => { %>
import '<%= asset.path %>'
<% }) %>

import createQuasarApp from './app.js'
import quasarUserOptions from './quasar-user-options.js'

<% if (preFetch) { %>
import App from 'app/<%= sourceFiles.rootComponent %>'
const appPrefetch = typeof App.preFetch === 'function'
  ? App.preFetch
  : (
    // Class components return the component options (and the preFetch hook) inside __c property
    App.__c !== void 0 && typeof App.__c.preFetch === 'function'
      ? App.__c.preFetch
      : false
    )
<% } %>

const publicPath = `<%= build.publicPath %>`
<% if (build.publicPath !== '/') { %>
const doubleSlashRE = /\/\//
const addPublicPath = url => (publicPath + url).replace(doubleSlashRE, '/')
<% } %>

const httpRE = /^https?:\/\//

function getRedirectUrl (url, router) {
  if (typeof url === 'string' && httpRE.test(url) === true) {
    return url
  }

  try { return router.resolve(url).href }
  catch (err) {}

  return url
}

function getUrlPath(ssrContext) {
  <% /* In case the `req.url` is not available or different due to a custom webserver, also check for `ssrContext.url` */ %>
  const url = ssrContext.url || ssrContext.req.url

  try {
    <% /* Fetch API's Request.url, used by more modern web servers and runtime environments. Contains the full URL */ %>
    const parsedUrl = new URL(url)
    return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash
  } catch {
    <% /* Node IncomingMessage.url, used by Express and similar. It doesn't contain the protocol and host, only the path, so new URL(url) above would fail */ %>
    return url
  }
}

const { components, directives, ...qUserOptions } = quasarUserOptions

<%
  const bootEntries = boot.filter(asset => asset.server !== false)
  if (bootEntries.length !== 0) { %>
let bootFunctions = null
let bootPromise = Promise.allSettled([
  <% bootEntries.forEach((asset, index) => { %>
  import('<%= asset.path %>')<%= index < bootEntries.length - 1 ? ',' : '' %>
  <% }) %>
])
.then(bootFiles => bootFiles.map(result => {
  if (result.status === 'rejected') {
    console.error('[Quasar] boot error:', result.reason)
    return
  }
  return result.value.default
}))
.then(bootFiles => bootFiles.filter(entry => typeof entry === 'function'))
<% } %>

// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default ssrContext => {
  return new Promise(async (resolve, reject) => {
    <% if (bootEntries.length !== 0) { %>
    if (bootFunctions === null) {
      bootFunctions = await bootPromise
      bootPromise = null
    }
    <% } %>

    const {
      app, router<%= metaConf.hasStore ? ', store' : '' %>
    } = await createQuasarApp(createApp, qUserOptions, ssrContext)

    <% if (bootEntries.length !== 0) { %>
    let hasRedirected = false
    const redirect = (url, httpStatusCode) => {
      hasRedirected = true
      reject({ url: getRedirectUrl(url, router), code: httpStatusCode })
    }

    for (let i = 0; hasRedirected === false && i < bootFunctions.length; i++) {
      try {
        await bootFunctions[ i ]({
          app,
          router,
          <%= metaConf.hasStore ? 'store,' : '' %>
          ssrContext,
          redirect,
          urlPath: getUrlPath(ssrContext),
          publicPath
        })
      }
      catch (err) {
        reject(err)
        return
      }
    }

    if (hasRedirected === true) return
    <% } %>

    app.use(router)

    const urlPath = getUrlPath(ssrContext)<% if (build.publicPath !== '/') { %>.replace(publicPath, '/')<% } %>
    const { fullPath } = router.resolve(urlPath)

    if (fullPath !== urlPath) {
      return reject({ url: <%= build.publicPath === '/' ? 'fullPath' : 'addPublicPath(fullPath)' %> })
    }

    // set router's location
    router.push(urlPath).catch(() => {})

    // wait until router has resolved possible async hooks
    router.isReady().then(() => {
      let matchedComponents = router.currentRoute.value.matched
        .filter(record => record.components !== void 0)
        .flatMap(record => Object.values(record.components))

      // no matched routes
      if (matchedComponents.length === 0) {
        return reject({ code: 404 })
      }

      <% if (preFetch) { %>
      let hasRedirected = false
      const redirect = (url, httpStatusCode) => {
        hasRedirected = true
        reject({ url: getRedirectUrl(url, router), code: httpStatusCode })
      }

      // filter and convert all components to their preFetch methods
      matchedComponents = matchedComponents
        .filter(m => (
          typeof m.preFetch === 'function'
          // Class components return the component options (and the preFetch hook) inside __c property
          || (m.__c !== void 0 && typeof m.__c.preFetch === 'function')
        ))
        .map(m => m.__c !== void 0 ? m.__c.preFetch : m.preFetch)

      if (appPrefetch !== false) {
        matchedComponents.unshift(appPrefetch)
      }

      // Call preFetch hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      matchedComponents
      .reduce(
        (promise, preFetchFn) => promise.then(() => hasRedirected === false && preFetchFn({
          <% if (metaConf.hasStore) { %>store,<% } %>
          ssrContext,
          currentRoute: router.currentRoute.value,
          redirect,
          urlPath: getUrlPath(ssrContext),
          publicPath
        })),
        Promise.resolve()
      )
      .then(() => {
        if (hasRedirected === true) return

        <% if (metaConf.hasStore && ssr.manualStoreSsrContextInjection !== true) { %>ssrContext.state = unref(store.state)<% } %>

        resolve(app)
      })
      .catch(reject)

      <% } else { %>

        <% if (metaConf.hasStore && ssr.manualStoreSsrContextInjection !== true) { %>ssrContext.state = unref(store.state)<% } %>

        resolve(app)

      <% } %>
    }).catch(reject)
  })
}
