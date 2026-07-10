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

<% if (quasarConf.ctx.mode.bex) { %>
import { bex } from './bex-app.js'
<% } %>

<% if (quasarConf.ctx.mode.capacitor) { %>
  import '@capacitor/core'
  <% if (quasarConf.metaConf.versions.capacitorPluginApp) { %>
  // importing it so it can install itself (used by Quasar UI)
  import { App as CapApp } from '@capacitor/app'
  <% } %>
  <% if (quasarConf.metaConf.versions.capacitorPluginSplashscreen && quasarConf.capacitor.hideSplashscreen !== false) { %>
  import { SplashScreen } from '@capacitor/splash-screen'
  <% } %>
<% } %>

import { Quasar } from 'quasar'
import { markRaw } from 'vue'
import <%= quasarConf.metaConf.needsAppMountHook ? 'AppComponent' : 'RootComponent' %> from '@/../<%= quasarConf.sourceFiles.rootComponent %>'

<% if (quasarConf.metaConf.hasStore) { %>
import createStore from '@/../<%= quasarConf.sourceFiles.store %>'
<% } %>
import createRouter from '@/../<%= quasarConf.sourceFiles.router %>'

<% if (quasarConf.metaConf.needsAppMountHook) { %>
import { defineComponent, h, onMounted<%= (quasarConf.ctx.mode.ssr && quasarConf.ssr.manualPostHydrationTrigger !== true) || (quasarConf.ctx.mode.ssg && quasarConf.ssg.manualPostHydrationTrigger !== true) ? ', getCurrentInstance' : '' %> } from 'vue'

const RootComponent = defineComponent({
  name: 'AppWrapper',
  setup (props) {
    onMounted(() => {
      <% if (quasarConf.ctx.mode.capacitor && quasarConf.metaConf.versions.capacitorPluginSplashscreen && quasarConf.capacitor.hideSplashscreen !== false) { %>
      SplashScreen.hide()
      <% } %>

      <% if ((quasarConf.ctx.mode.ssr && quasarConf.ssr.manualPostHydrationTrigger !== true) || (quasarConf.ctx.mode.ssg && quasarConf.ssg.manualPostHydrationTrigger !== true)) { %>
      const { proxy: { $q } } = getCurrentInstance()
      $q.onSSRHydrated !== void 0 && $q.onSSRHydrated()
      <% } %>
    })

    return () => h(AppComponent, props)
  }
})
<% } %>

<% if ((quasarConf.ctx.mode.ssr || quasarConf.ctx.mode.ssg) && quasarConf.ctx.mode.pwa) { %>
export const ssrIsRunningOnClientPWA = typeof window !== 'undefined' &&
  document.body.getAttribute('data-server-rendered') === null
<% } %>

export default async function (createAppFn, quasarUserOptions<%= (quasarConf.ctx.mode.ssr || quasarConf.ctx.mode.ssg) ? ', ssrContext' : '' %>) {
  <% if (quasarConf.ctx.mode.bex) { %>
    await bex.promise
    delete bex.promise
  <% } %>

  // Create the app instance.
  // Here we inject into it the Quasar UI, the router & possibly the store.
  const app = createAppFn(RootComponent)

  <% if (quasarConf.metaConf.debugging) { %>
  app.config.performance = true
  <% } %>

  app.use(Quasar, quasarUserOptions<%= (quasarConf.ctx.mode.ssr || quasarConf.ctx.mode.ssg) ? ', ssrContext' : '' %>)

  <% if (quasarConf.ctx.mode.bex) { %>
    app.config.globalProperties.$q.bex = bex.bridge
  <% } else if (quasarConf.ctx.mode.capacitor) { %>
    app.config.globalProperties.$q.capacitor = window.Capacitor
  <% } %>

  <% if (quasarConf.metaConf.hasStore) { %>
    const store = typeof createStore === 'function'
      ? await createStore({<%= (quasarConf.ctx.mode.ssr || quasarConf.ctx.mode.ssg) ? 'ssrContext' : '' %>})
      : createStore

    <% if (quasarConf.metaConf.storePackage === 'pinia') { %>
      app.use(store)

      <% if (quasarConf.ctx.mode.ssr && quasarConf.ssr.manualStoreHydration !== true) { %>
        // prime the store with server-initialized state.
        // the state is determined during SSR and inlined in the page markup.
        if (typeof window !== 'undefined' && <% if (quasarConf.ctx.mode.pwa) { %>ssrIsRunningOnClientPWA !== true && <% } %>window.__INITIAL_STATE__ !== void 0) {
          store.state.value = window.__INITIAL_STATE__
          // for security reasons, we'll delete this
          delete window.__INITIAL_STATE__
        }
      <% } %>
    <% } %>
  <% } %>

  const router = markRaw(
    typeof createRouter === 'function'
      ? await createRouter({<%= (quasarConf.ctx.mode.ssr || quasarConf.ctx.mode.ssg) ? 'ssrContext' + (quasarConf.metaConf.hasStore ? ',' : '') : '' %><%= quasarConf.metaConf.hasStore ? 'store' : '' %>})
      : createRouter
  )

  <% if (quasarConf.metaConf.hasStore) { %>
    // make router instance available in store
    <% if (quasarConf.metaConf.storePackage === 'pinia') { %>
      store.use(({ store }) => { store.router = router })
    <% } %>
  <% } %>

  // Expose the app, the router and the store.
  // Note that we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app,
    <%= quasarConf.metaConf.hasStore ? 'store,' : '' %>
    router
  }
}
