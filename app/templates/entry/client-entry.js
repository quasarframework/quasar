/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
<% if (supportIE) { %>
import 'quasar/dist/quasar.ie.polyfills.js'
<% } %>

<% extras && extras.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/<%= asset %>/<%= asset %>.css'
<% }) %>

<% animations && animations.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/animate/<%= asset %>.css'
<% }) %>

import 'quasar-app-styl'

<% css && css.forEach(asset => { %>
import '<%= asset %>'
<% }) %>

import Vue from 'vue'
import createApp from './app.js'

<% if (ctx.mode.pwa) { %>
import 'app/<%= sourceFiles.registerServiceWorker %>'
<% } %>

<%
const pluginNames = []
if (plugins) {
  function hash (str) {
    const name = str.replace(/\W+/g, '')
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  plugins.filter(asset => asset.path !== 'boot' && asset.client !== false).forEach(asset => {
    let importName = 'p' + hash(asset.path)
    pluginNames.push(importName)
%>
import <%= importName %> from 'src/plugins/<%= asset.path %>'
<% }) } %>

<% if (preFetch) { %>
import { addPreFetchHooks } from './client-prefetch.js'
<% } %>

<%
const needsFastClick = ctx.mode.pwa || (ctx.mode.cordova && ctx.target.ios)
if (needsFastClick) {
%>
import FastClick from 'fastclick'
<% } %>

<% if (ctx.mode.electron) { %>
import electron from 'electron'
Vue.prototype.$q.electron = electron
<% } %>

<%
let hasBootPlugin = false
if (!ctx.mode.ssr) {
hasBootPlugin = plugins && plugins.find(asset => asset.path === 'boot')

if (hasBootPlugin) { %>
import boot from 'src/plugins/boot.js'
<% } } %>

<% if (ctx.dev) { %>
Vue.config.devtools = true
Vue.config.productionTip = false
<% } %>

<% if (ctx.dev) { %>
console.info('[Quasar] Running <%= ctx.modeName.toUpperCase() + (ctx.mode.ssr && ctx.mode.pwa ? ' + PWA' : '') %>.')
<% if (ctx.mode.pwa) { %>console.info('[Quasar] Forcing PWA into the network-first approach to not break Hot Module Replacement while developing.')<% } %>
<% } %>

const { app, <%= store ? 'store, ' : '' %>router } = createApp()

<% if (needsFastClick) { %>
<% if (ctx.mode.pwa) { %>
  // Needed only for iOS PWAs
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && window.navigator.standalone) {
<% } %>
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body)
  }, false)
<% if (ctx.mode.pwa) { %>
}
<% } %>
<% } %>

<% if (pluginNames.length > 0) { %>
;[<%= pluginNames.join(',') %>].forEach(plugin => {
  plugin({
    app,
    router,
    <%= store ? 'store,' : '' %>
    Vue,
    ssrContext: null
  })
})
<% } %>

<% if (ctx.mode.ssr) { %>

  // prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
<% if (store) { %>
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
<% } %>

const appInstance = new Vue(app)

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  <% if (preFetch) { %>
  addPreFetchHooks(router<%= store ? ', store' : '' %>)
  <% } %>
  appInstance.$mount('#q-app')
})

<% } else { // not SSR %>

<% if (preFetch) { %>
addPreFetchHooks(router<%= store ? ', store' : '' %>)
<% } %>

<% if (ctx.mode.cordova) { %>
document.addEventListener('deviceready', () => {
Vue.prototype.$q.cordova = window.cordova
<% } %>

<% if (hasBootPlugin) { %>
boot({ app, router,<% if (store) { %> store,<% } %> Vue })
<% } else { %>
new Vue(app)
<% } %>

<% if (ctx.mode.cordova) { %>
}, false) // on deviceready
<% } %>


<% } // end of Non SSR %>
