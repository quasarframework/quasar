<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { reactive } from 'vue'
import { createMetaMixin } from 'quasar'

import getMeta from 'assets/get-meta.js'

export default {
  name: 'App',

  mixins: [
    createMetaMixin({
      title: 'Quasar Framework',
      titleTemplate: title => `${title} | Quasar Framework`,

      meta: getMeta(
        'Quasar Framework - Build high-performance VueJS user interfaces in record time',
        'Developer-oriented, front-end framework with VueJS components for best-in-class high-performance, responsive websites, PWA, SSR, Mobile and Desktop apps, all from the same codebase. Sensible people choose Vue. Productive people choose Quasar. Be both.'
      )
    })
  ],

  created () {
    const store = {
      toc: []
    }

    this.$root.store = process.env.SERVER === true
      ? store
      : reactive(store)
  }
}
</script>
