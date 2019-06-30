<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import getMeta from 'assets/get-meta.js'

export default {
  name: 'App',

  meta: {
    title: 'Quasar Framework',
    titleTemplate: title => `${title} | Quasar Framework`,

    meta: getMeta(
      'Quasar Framework - High performance Vue.js full front end stack',
      'Full frontend framework with Vue.js components for high performance, responsive websites, PWA, SSR, Hybrid mobile apps and Electron apps, all using the same codebase.'
    )
  }
}
</script>
