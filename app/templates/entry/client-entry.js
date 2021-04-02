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

<% if (ctx.mode.ssr && ctx.mode.pwa) { %>
import { createSSRApp, createApp } from 'vue'
import { isRunningOnPWA } from './ssr-pwa'
<% } else { %>
import { <%= ctx.mode.ssr ? 'createSSRApp' : 'createApp' %> } from 'vue'
<% } %>

<% const bootEntries = boot.filter(asset => asset.client !== false) %>

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

<% css.length > 0 && css.filter(asset => asset.client !== false).forEach(asset => { %>
import '<%= asset.path %>'
<% }) %>

import createQuasarApp from './app.js'

<% if (ctx.mode.pwa) { %>
import 'app/<%= sourceFiles.registerServiceWorker %>'
<% } %>

<% if (preFetch) { %>
import { addPreFetchHooks } from './client-prefetch.js'
<% } %>

<% if (ctx.dev) { %>
console.info('[Quasar] Running <%= ctx.modeName.toUpperCase() + (ctx.mode.ssr && ctx.mode.pwa ? ' + PWA' : '') %>.')
<% if (ctx.mode.pwa) { %>console.info('[Quasar] PWA: Use devtools > Application > "Bypass for network" to not break Hot Module Replacement while developing.')<% } %>
<% } %>

<% if (ctx.mode.cordova && ctx.target.ios) { %>
import '@quasar/fastclick'
<% } else if (ctx.mode.pwa) { %>
// Needed only for iOS PWAs
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && window.navigator.standalone) {
  import(/* webpackChunkName: "fastclick"  */ '@quasar/fastclick')
}
<% } %>

const publicPath = `<%= build.publicPath %>`
<% if (build.publicPath.length > 1) { %>
const doubleSlashRE = /\/\//
const addPublicPath = url => (publicPath + url).replace(doubleSlashRE, '/')
<% } %>

async function start ({ app, router<%= store ? ', store, storeKey' : '' %> }<%= bootEntries.length > 0 ? ', bootFiles' : '' %>) {
  <% if (ctx.mode.ssr && store && ssr.manualStoreHydration !== true) { %>
  // prime the store with server-initialized state.
  // the state is determined during SSR and inlined in the page markup.
  if (<% if (ctx.mode.pwa) { %>isRunningOnPWA !== true && <% } %>window.__INITIAL_STATE__) {
    // TODO vue3
    store.replaceState(window.__INITIAL_STATE__)
  }
  <% } %>

  <% if (bootEntries.length > 0) { %>
  let hasRedirected = false
  const redirect = url => {
    hasRedirected = true
    const normalized = Object(url) === url
      ? <%= build.publicPath.length <= 1 ? 'router.resolve(url).fullPath' : 'addPublicPath(router.resolve(url).fullPath)' %>
      : url

    window.location.href = normalized
  }

  const urlPath = window.location.href.replace(window.location.origin, '')

  for (let i = 0; hasRedirected === false && i < bootFiles.length; i++) {
    try {
      await bootFiles[i]({
        app,
        router,
        <%= store ? 'store,' : '' %>
        ssrContext: null,
        redirect,
        urlPath,
        publicPath
      })
    }
    catch (err) {
      if (err && err.url) {
        window.location.href = err.url
        return
      }

      console.error('[Quasar] boot error:', err)
      return
    }
  }

  if (hasRedirected === true) {
    return
  }
  <% } %>

  app.use(router)
  <% if (store) { %>app.use(store, storeKey)<% } %>

  <% if (ctx.mode.ssr) { %>
    <% if (ctx.mode.pwa) { %>
      if (isRunningOnPWA === true) {
        <% if (preFetch) { %>
        addPreFetchHooks(router<%= store ? ', store' : '' %>)
        <% } %>
        app.mount('#q-app')
      }
      else {
    <% } %>
    // wait until router has resolved all async before hooks
    // and async components...
    router.isReady().then(() => {
      <% if (preFetch) { %>
      addPreFetchHooks(router<%= store ? ', store' : '' %>, publicPath)
      <% } %>
      app.mount('#q-app')
    })
    <% if (ctx.mode.pwa) { %>
    }
    <% } %>

  <% } else { // not SSR %>

    <% if (preFetch) { %>
    addPreFetchHooks(router<%= store ? ', store' : '' %>)
    <% } %>

    <% if (ctx.mode.bex) { %>
      window.QBexInit = function (shell) {
        shell.connect(bridge => {
          window.QBexBridge = bridge
          app.config.globalProperties.$q.bex = window.QBexBridge
          app.mount('#q-app')
        })
      }
    <% } else if (ctx.mode.cordova) { %>
      document.addEventListener('deviceready', () => {
        app.config.globalProperties.$q.cordova = window.cordova
        app.mount('#q-app')
      }, false) // on deviceready
    <% } else { %>
      app.mount('#q-app')
    <% } %>

  <% } // end of Non SSR %>

}

createQuasarApp(<%=
  ctx.mode.ssr
    ? (ctx.mode.pwa ? 'isRunningOnPWA ? createApp : createSSRApp' : 'createSSRApp')
    : 'createApp'
%>)
<% if (bootEntries.length > 0) { %>
  .then(app => {
    return Promise.all([
      <% bootEntries.forEach((asset, index) => { %>
      import(/* webpackMode: "eager" */ '<%= asset.path %>')<%= index < bootEntries.length - 1 ? ',' : '' %>
      <% }) %>
    ]).then(bootFiles => {
      const boot = bootFiles
        .map(entry => entry.default)
        .filter(entry => typeof entry === 'function')

      start(app, boot)
    })
  })
<% } else { %>
  .then(start)
<% } %>
