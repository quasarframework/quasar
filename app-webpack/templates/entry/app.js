/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/

<% if (__vueDevtools !== false) { %>
import vueDevtools from '@vue/devtools'
<% } %>

import { Quasar } from 'quasar'
import { markRaw } from 'vue'
import <%= __needsAppMountHook === true ? 'AppComponent' : 'RootComponent' %> from 'app/<%= sourceFiles.rootComponent %>'

<% if (store) { %>import createStore from 'app/<%= sourceFiles.store %>'<% } %>
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

<% if (__needsAppMountHook === true) { %>
import { defineComponent, h, onMounted<%= ctx.mode.ssr && ssr.manualPostHydrationTrigger !== true ? ', getCurrentInstance' : '' %> } from 'vue'
const RootComponent = defineComponent({
  name: 'AppWrapper',
  setup (props) {
    onMounted(() => {
      <% if (ctx.mode.capacitor && __versions.capacitorPluginSplashscreen && capacitor.hideSplashscreen !== false) { %>
      SplashScreen.hide()
      <% } %>

      <% if (__vueDevtools !== false) { %>
      vueDevtools.connect('<%= __vueDevtools.host %>', <%= __vueDevtools.port %>)
      <% } %>

      <% if (ctx.mode.ssr && ssr.manualPostHydrationTrigger !== true) { %>
      const { proxy: { $q } } = getCurrentInstance()
      $q.onSSRHydrated !== void 0 && $q.onSSRHydrated()
      <% } %>
    })

    return () => h(AppComponent, props)
  }
})
<% } %>

<% if (ctx.mode.ssr && ctx.mode.pwa) { %>
export const ssrIsRunningOnClientPWA = typeof window !== 'undefined' &&
  document.body.getAttribute('data-server-rendered') === null
<% } %>

export default async function (createAppFn, quasarUserOptions<%= ctx.mode.ssr ? ', ssrContext' : '' %>) {
  // Create the app instance.
  // Here we inject into it the Quasar UI, the router & possibly the store.
  const app = createAppFn(RootComponent)

  <% if (ctx.dev || ctx.debug) { %>
  app.config.performance = true
  <% } %>

  app.use(Quasar, quasarUserOptions<%= ctx.mode.ssr ? ', ssrContext' : '' %>)

  <% if (ctx.mode.capacitor) { %>
  app.config.globalProperties.$q.capacitor = window.Capacitor
  <% } %>

  <% if (store) { %>
    const store = typeof createStore === 'function'
      ? await createStore({<%= ctx.mode.ssr ? 'ssrContext' : '' %>})
      : createStore

    <% if (__storePackage === 'vuex') { %>
      // obtain Vuex injection key in case we use TypeScript
      const { storeKey } = await import('app/<%= sourceFiles.store %>')
    <% } else if (__storePackage === 'pinia') { %>
      app.use(store)

      <% if (ctx.mode.ssr && ssr.manualStoreHydration !== true) { %>
        // prime the store with server-initialized state.
        // the state is determined during SSR and inlined in the page markup.
        if (typeof window !== 'undefined' && <% if (ctx.mode.pwa) { %>ssrIsRunningOnClientPWA !== true && <% } %>window.__INITIAL_STATE__ !== void 0) {
          store.state.value = window.__INITIAL_STATE__
          // for security reasons, we'll delete this
          delete window.__INITIAL_STATE__
        }
      <% } %>
    <% } %>
  <% } %>

  const router = markRaw(
    typeof createRouter === 'function'
      ? await createRouter({<%= ctx.mode.ssr ? 'ssrContext' + (store ? ',' : '') : '' %><%= store ? 'store' : '' %>})
      : createRouter
  )

  <% if (store) { %>
    // make router instance available in store
    <% if (__storePackage === 'vuex') { %>
      store.$router = router
    <% } else if (__storePackage === 'pinia') { %>
      store.use(({ store }) => { store.router = router })
    <% } %>
  <% } %>

  // Expose the app, the router and the store.
  // Note that we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app,
    <%= store ? 'store,' + (__storePackage === 'vuex' ? ' storeKey,' : '') : '' %>
    router
  }
}
