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
const appOptions = App.options /* Vue.extend() */ || App
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

function redirectBrowser (url, router, reject) {
  const normalized = Object(url) === url
    ? <%= build.publicPath === '/' ? 'router.resolve(url).fullPath' : 'addPublicPath(router.resolve(url).fullPath)' %>
    : url

  reject({ url: normalized })
}

// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default ssrContext => {
  return new Promise(async (resolve, reject) => {
    const { app, router<%= store ? ', store' : '' %> } = await createQuasarApp(createApp, ssrContext)

    <% if (bootNames.length > 0) { %>
    let hasRedirected = false
    const redirect = url => {
      hasRedirected = true
      redirectBrowser(url, router, reject)
    }

    const bootFiles = [<%= bootNames.join(',') %>]
    for (let i = 0; hasRedirected === false && i < bootFiles.length; i++) {
      if (typeof bootFiles[i] !== 'function') {
        continue
      }

      try {
        await bootFiles[i]({
          app,
          router,
          <%= store ? 'store,' : '' %>
          Vue,
          ssrContext,
          redirect,
          urlPath: ssrContext.url,
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

    const url = ssrContext.url<% if (build.publicPath !== '/') { %>.replace(publicPath, '')<% } %>
    const { fullPath } = router.resolve(url)

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }

    // set router's location
    router.push(url).catch(() => {})

    // wait until router has resolved possible async hooks
    router.isReady().then(() => {
      const matchedComponents = router.currentRoute.value.matched
        .flatMap(record => Object.values(record.components))
        .map(m => m.options /* Vue.extend() */ || m)

      // no matched routes
      if (matchedComponents.length === 0) {
        return reject({ code: 404 })
      }

      <% if (preFetch) { %>

      let hasRedirected = false
      const redirect = url => {
        hasRedirected = true
        redirectBrowser(url, router, reject)
      }

      appOptions.preFetch !== void 0 && matchedComponents.unshift(appOptions)

      // Call preFetch hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      matchedComponents
      .filter(c => c && c.preFetch)
      .reduce(
        (promise, c) => promise.then(() => hasRedirected === false && c.preFetch({
          <% if (store) { %>store,<% } %>
          ssrContext,
          currentRoute: router.currentRoute,
          redirect,
          urlPath: ssrContext.url,
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
