<template>
  <router-view />
</template>

<script setup>
import { useMeta } from 'quasar'

import getMeta from 'assets/get-meta.js'

useMeta({
  title: 'Quasar Framework',
  titleTemplate: title => `${title} | Quasar Framework`,

  meta: getMeta(
    'Quasar Framework - Build high-performance VueJS user interfaces in record time',
    'Developer-oriented, front-end framework with VueJS components for best-in-class high-performance, responsive websites, PWA, SSR, Mobile and Desktop apps, all from the same codebase. Sensible people choose Vue. Productive people choose Quasar. Be both.'
  )
})
</script>
