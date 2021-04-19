/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.conf.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/
import { createApp } from 'vue'

<% extras.length > 0 && extras.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/<%= asset %>/<%= asset %>.css'
<% }) %>

<% animations.length > 0 && animations.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/animate/<%= asset %>.css'
<% }) %>

// We load Quasar stylesheet file
import 'quasar/dist/quasar.<%= __css.quasarSrcExt %>'

<% if (framework.cssAddon) { %>
// We add Quasar addons, if they were requested
import 'quasar/src/css/flex-addon.<%= __css.quasarSrcExt %>'
<% } %>

<% css.length > 0 && css.filter(asset => asset.server !== false).forEach(asset => { %>
import '<%= asset.path %>'
<% }) %>

import createQuasarApp from './app.js'

<% if (preFetch) { %>
import App from 'app/<%= sourceFiles.rootComponent %>'
<% } %>

<%
const bootNames = []
if (boot.length > 0) {
  function hash (str) {
    const name = str.replace(/\W+/g, '')
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  boot.filter(asset => asset.server !== false).forEach(asset => {
    let importName = 'qboot_' + hash(asset.path)
    bootNames.push(importName)
%>
import <%= importName %> from '<%= asset.path %>'
<% }) } %>

const publicPath = `<%= build.publicPath %>`
<% if (build.publicPath !== '/') { %>
const doubleSlashRE = /\/\//
const addPublicPath = url => (publicPath + url).replace(doubleSlashRE, '/')
<% } %>

const bootFiles = [<%= bootNames.join(',') %>].filter(boot => typeof boot === 'function')

function redirectBrowser (url, router, reject, httpStatusCode) {
  const normalized = Object(url) === url
    ? <%= build.publicPath === '/' ? 'router.resolve(url).fullPath' : 'addPublicPath(router.resolve(url).fullPath)' %>
    : url

  reject({ url: normalized, code: httpStatusCode })
}

// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default ssrContext => {
  return new Promise(async (resolve, reject) => {
    const { app, router<%= store ? ', store, storeKey' : '' %> } = await createQuasarApp(createApp, ssrContext)

    <% if (bootNames.length > 0) { %>
    let hasRedirected = false
    const redirect = (url, httpStatusCode) => {
      hasRedirected = true
      redirectBrowser(url, router, reject, httpStatusCode)
    }

    for (let i = 0; hasRedirected === false && i < bootFiles.length; i++) {
      try {
        await bootFiles[i]({
          app,
          router,
          <%= store ? 'store,' : '' %>
          ssrContext,
          redirect,
          urlPath: ssrContext.req.url,
          publicPath
        })
      }
      catch (err) {
        reject(err)
        return
      }
    }

    if (hasRedirected === true) {
      return
    }
    <% } %>

    app.use(router)
    <% if (store) { %>app.use(store, storeKey)<% } %>

    const url = ssrContext.req.url<% if (build.publicPath !== '/') { %>.replace(publicPath, '')<% } %>
    const { fullPath } = router.resolve(url)

    if (fullPath !== url) {
      return reject({ url: <%= build.publicPath === '/' ? 'fullPath' : 'addPublicPath(fullPath)' %> })
    }

    // set router's location
    router.push(url).catch(() => {})

    // wait until router has resolved possible async hooks
    router.isReady().then(() => {
      const matchedComponents = router.currentRoute.value.matched
        .flatMap(record => Object.values(record.components))
        .map(m => m)

      // no matched routes
      if (matchedComponents.length === 0) {
        return reject({ code: 404 })
      }

      <% if (preFetch) { %>

      let hasRedirected = false
      const redirect = (url, httpStatusCode) => {
        hasRedirected = true
        redirectBrowser(url, router, reject, httpStatusCode)
      }

      // Class components return the component options (and the preFetch hook) inside __c property
      if (typeof App.preFetch === 'function' || App.__c && typeof App.__c.preFetch === 'function') {
        matchedComponents.unshift(App)
      }
      // Call preFetch hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      matchedComponents
      // Class components return the component options (and the preFetch hook) inside __c property
      .filter(c => (typeof c.preFetch === 'function') || (c.__c && typeof c.__c.preFetch === 'function'))
      .reduce(
        (promise, c) => promise.then(() => hasRedirected === false && (c.__c ? c.__c : c).preFetch({
          <% if (store) { %>store,<% } %>
          ssrContext,
          currentRoute: router.currentRoute,
          redirect,
          urlPath: ssrContext.req.url,
          publicPath
        })),
        Promise.resolve()
      )
      .then(() => {
        if (hasRedirected === true) { return }

        <% if (store) { %>ssrContext.state = store.state<% } %>

        resolve(app)
      })
      .catch(reject)

      <% } else { %>

      <% if (store) { %>ssrContext.state = store.state<% } %>

      resolve(app)

      <% } %>
    }).catch(reject)
  })
}
