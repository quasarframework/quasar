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
import { h, createApp } from 'vue'
import { Quasar, quasarPluginOptions } from './import-quasar.js'

<% if (ctx.mode.ssr && ctx.mode.pwa) { %>
import { isRunningOnPWA } from './ssr-pwa'
<% } %>

<% if (ctx.mode.electron && electron.nodeIntegration === true) { %>
import electron from 'electron'
<% } %>

import App from 'app/<%= sourceFiles.rootComponent %>'

<% if (store) { %>
import createStore from 'app/<%= sourceFiles.store %>'
<% } %>
import createRouter from 'app/<%= sourceFiles.router %>'

<% if (ctx.mode.capacitor && capacitor.hideSplashscreen !== false) { %>
import { Plugins } from '@capacitor/core'
const { SplashScreen } = Plugins
<% } %>

<% if (__vueDevtools !== false) { %>
import vueDevtools from '@vue/devtools'
<% } %>

export default async function (<%= ctx.mode.ssr ? 'ssrContext' : '' %>) {
  // create store and router instances
  <% if (store) { %>
  const store = typeof createStore === 'function'
    ? await createStore({<%= ctx.mode.ssr ? ', ssrContext' : '' %>})
    : createStore
  <% } %>
  const router = typeof createRouter === 'function'
    ? await createRouter({<%= ctx.mode.ssr ? ', ssrContext' : '' %><%= store ? ', store' : '' %>})
    : createRouter
  <% if (store) { %>
  // make router instance available in store
  store.$router = router
  <% } %>

  // Create the app instantiation Object.
  // Here we inject the router, store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = createApp({
    render: () => h(App)<% if (__needsAppMountHook === true) { %>,
    mounted () {
      <% if (ctx.mode.capacitor && capacitor.hideSplashscreen !== false) { %>
      SplashScreen.hide()
      <% } %>

      <% if (__vueDevtools !== false) { %>
      vueDevtools.connect('<%= __vueDevtools.host %>', <%= __vueDevtools.port %>)
      <% } %>
    }<% } %>
  })

  <% if (ctx.dev) { %>
  app.config.devtools = true
  <% } %>

  app.use(router)
  <% if (store) { %>app.use(store)<% } %>
  app.use(Quasar, quasarPluginOptions)

  <% if (ctx.mode.electron && electron.nodeIntegration === true) { %>
  app.config.globalProperties.$q.electron = electron
  <% } %>

  <% if (ctx.mode.capacitor) { %>
  app.config.globalProperties.$q.capacitor = window.Capacitor
  <% } %>

  <% if (ctx.mode.ssr) { %>
    <% if (ctx.mode.pwa) { %>
  if (isRunningOnPWA !== true) {
    Quasar.ssrUpdate({ app, ssr: ssrContext })
  }
    <% } else { %>
  Quasar.ssrUpdate({ app, ssr: ssrContext })
    <% } %>
  <% } %>

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app,
    <%= store ? 'store,' : '' %>
    router
  }
}
