/* oxlint-disable */
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
import { createApp<%= quasarConf.metaConf.hasStore && ((quasarConf.ctx.mode.ssr && quasarConf.ssr.manualStoreSsrContextInjection !== true) || (quasarConf.ctx.mode.ssg && quasarConf.ssg.manualStoreSsrContextInjection !== true)) ? ', unref' : '' %> } from 'vue'

<% quasarConf.extras.length !== 0 && quasarConf.extras.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/<%= asset %>/<%= asset %>.css'
<% }) %>

<% quasarConf.animations.length !== 0 && quasarConf.animations.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/animate/<%= asset %>.css'
<% }) %>

// We load Quasar stylesheet file
import 'quasar/dist/quasar.<%= quasarConf.metaConf.css.quasarSrcExt %>'

<% if (quasarConf.framework.cssAddon) { %>
// We add Quasar addons, if they were requested
import 'quasar/src/css/flex-addon.sass'
<% } %>

<% quasarConf.css.length !== 0 && quasarConf.css.filter(asset => asset.server !== false).forEach(asset => { %>
import '<%= asset.path %>'
<% }) %>

import createQuasarApp from './app.js'
import quasarUserOptions from './quasar-user-options.js'

<% if (quasarConf.preFetch) { %>
import App from '@/../<%= quasarConf.sourceFiles.rootComponent %>'
const appPrefetch = typeof App.preFetch === 'function'
  ? App.preFetch
  : (
    // Class components return the component options (and the preFetch hook) inside __c property
    App.__c !== void 0 && typeof App.__c.preFetch === 'function'
      ? App.__c.preFetch
      : false
    )
<% } %>

const publicPath = `<%= quasarConf.build.publicPath %>`
<% if (quasarConf.build.publicPath !== '/') { %>
const doubleSlashRE = /\/\//
const addPublicPath = url => (publicPath + url).replace(doubleSlashRE, '/')
<% } %>

const redirectStatusCodeList = [301, 302, 303, 307, 308]
const httpRE = /^https?:\/\//

function getRedirectUrl (url, router) {
  if (typeof url === 'string' && httpRE.test(url)) {
    return url
  }

  try { return router.resolve(url).href }
  catch (err) {}

  return url
}

function fastStripHost(url) {
  let offset = 0
  if (url.startsWith('https://')) {
    offset = 8
  } else if (url.startsWith('http://')) {
    offset = 7
  } else if (url.startsWith('//')) {
    offset = 2
  } else {
    return url.startsWith('/') ? url : '/' + url;
  }

  const slashIdx = url.indexOf('/', offset)
  const queryIdx = url.indexOf('?', offset)
  const hashIdx  = url.indexOf('#', offset)

  let splitIdx = url.length

  if (slashIdx !== -1) splitIdx = slashIdx
  if (queryIdx !== -1 && queryIdx < splitIdx) splitIdx = queryIdx
  if (hashIdx !== -1 && hashIdx < splitIdx) splitIdx = hashIdx

  return splitIdx === url.length
    ? '/'
    : splitIdx !== slashIdx
      ? '/' + url.slice(splitIdx)
      : url.slice(splitIdx)
}

const { components, directives, ...qUserOptions } = quasarUserOptions

<%
  const bootEntries = quasarConf.boot.filter(asset => asset.server !== false)
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
export default async ssrContext => {
  <% if (bootEntries.length !== 0) { %>
  if (bootFunctions === null) {
    bootFunctions = await bootPromise
    bootPromise = null
  }
  <% } %>

  const {
    app, router<%= quasarConf.metaConf.hasStore ? ', store' : '' %>
  } = await createQuasarApp(createApp, qUserOptions, ssrContext)

  const origUrlPath = fastStripHost(ssrContext.url || ssrContext.req.url)
  const urlPath = origUrlPath<% if (quasarConf.build.publicPath !== '/') { %>.replace(publicPath, '/')<% } %>

  <% if (bootEntries.length !== 0) { %>
  let bootRedirect = false
  const bootRedirectFn = (url, httpStatusCode) => {
    bootRedirect = {
      // interface SsrRenderRedirectError
      redirectUrl: getRedirectUrl(url, router),
      redirectHttpStatusCode:
        redirectStatusCodeList.includes(httpStatusCode)
          ? httpStatusCode
          : 302
    }
  }

  for (let i = 0; i < bootFunctions.length; i++) {
    await bootFunctions[ i ]({
      app,
      router,
      <%= quasarConf.metaConf.hasStore ? 'store,' : '' %>
      ssrContext,
      redirect: bootRedirectFn,
      urlPath: origUrlPath,
      publicPath
    })

    if (bootRedirect) throw bootRedirect
  }
  <% } %>

  app.use(router)

  const { fullPath } = router.resolve(urlPath)
  if (fullPath !== urlPath) {
    throw {
      // interface SsrRenderRedirectError
      redirectUrl: <%= quasarConf.build.publicPath === '/' ? 'fullPath' : 'addPublicPath(fullPath)' %>,
      redirectHttpStatusCode: 302
    }
  }

  // set router's location
  router.push(urlPath).catch(() => {})

  // wait until router has resolved possible async hooks
  await router.isReady()

  let matchedComponents = router.currentRoute.value.matched
    .filter(record => record.components !== void 0)
    .flatMap(record => Object.values(record.components))

  // no matched routes
  if (matchedComponents.length === 0) {
    // interface SsrRenderRouteNotFoundError
    throw { routeNotFound: true }
  }

  <% if (quasarConf.preFetch) { %>
  let prefetchRedirect = false
  const prefetchRedirectFn = (url, httpStatusCode) => {
    prefetchRedirect = {
      // interface SsrRenderRedirectError
      redirectUrl: getRedirectUrl(url, router),
      redirectHttpStatusCode:
        redirectStatusCodeList.includes(httpStatusCode)
          ? httpStatusCode
          : 302
    }
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
  await matchedComponents
  .reduce(
    (promise, preFetchFn) => promise.then(() => prefetchRedirect === false && preFetchFn({
      <% if (quasarConf.metaConf.hasStore) { %>store,<% } %>
      ssrContext,
      currentRoute: router.currentRoute.value,
      redirect: prefetchRedirectFn,
      urlPath: origUrlPath,
      publicPath
    })),
    Promise.resolve()
  )

  if (prefetchRedirect) throw prefetchRedirect
  <% } %>

  <% if (quasarConf.metaConf.hasStore && quasarConf.ssr.manualStoreSsrContextInjection !== true) { %>ssrContext.state = unref(store.state)<% } %>

  return app
}
