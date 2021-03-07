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

<% if (__vueDevtools !== false) { %>
import vueDevtools from '@vue/devtools'
<% } %>

import Vue from 'vue'
import './import-quasar.js'

<% if (ctx.mode.ssr) { %>
import <%= framework.importStrategy === 'all' ? 'Quasar' : '{ Quasar }' %> from 'quasar'
<% if (ctx.mode.pwa) { %>
import { isRunningOnPWA } from './ssr-pwa'
<% } %>
<% } %>

import App from 'app/<%= sourceFiles.rootComponent %>'

<% if (store) { %>
import createStore from 'app/<%= sourceFiles.store %>'
<% } %>
import createRouter from 'app/<%= sourceFiles.router %>'

<% if (ctx.mode.capacitor) { %>
  <% if (__versions.capacitor <= 2) { %>
  import { Plugins } from '@capacitor/core'
  const { SplashScreen } = Plugins
  <% } else /* Capacitor v3+ */ { %>
  import '@capacitor/core'
    <% if (__versions.capacitorPluginApp) { %>
    // importing it so it can install itself (used by Quasar UI)
    import { App as CapApp } from '@capacitor/app'
    <% } %>
    <% if (__versions.capacitorPluginSplashscreen && capacitor.hideSplashscreen !== false) { %>
    import { SplashScreen } from '@capacitor/splash-screen'
    <% } %>
  <% } %>
<% } %>


export default async function (<%= ctx.mode.ssr ? 'ssrContext' : '' %>) {
  // create store and router instances
  <% if (store) { %>
  const store = typeof createStore === 'function'
    ? await createStore({Vue<%= ctx.mode.ssr ? ', ssrContext' : '' %>})
    : createStore
  <% } %>
  const router = typeof createRouter === 'function'
    ? await createRouter({Vue<%= ctx.mode.ssr ? ', ssrContext' : '' %><%= store ? ', store' : '' %>})
    : createRouter
  <% if (store) { %>
  // make router instance available in store
  store.$router = router
  <% } %>

  // Create the app instantiation Object.
  // Here we inject the router, store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    router,
    <%= store ? 'store,' : '' %>
    render: h => h(App)<% if (__needsAppMountHook === true) { %>,
    mounted () {
      <% if (ctx.mode.capacitor && __versions.capacitorPluginSplashscreen && capacitor.hideSplashscreen !== false) { %>
      SplashScreen.hide()
      <% } %>

      <% if (__vueDevtools !== false) { %>
      vueDevtools.connect('<%= __vueDevtools.host %>', <%= __vueDevtools.port %>)
      <% } %>
    }<% } %>
  }


  <% if (ctx.mode.ssr) { %>
    <% if (ctx.mode.pwa) { %>
  if (isRunningOnPWA === true) {
    app.el = '#q-app'
  }
  else {
    Quasar.ssrUpdate({ app, ssr: ssrContext })
  }
    <% } else { %>
  Quasar.ssrUpdate({ app, ssr: ssrContext })
    <% } %>
  <% } else { %>
  app.el = '#q-app'
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
