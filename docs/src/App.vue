<template>
  <router-view />
</template>

<script setup>
import { useMeta } from 'quasar'

import getMeta from '@/assets/get-meta.js'

useMeta({
  title: 'Quasar Framework',
  titleTemplate: title => `${title} | Quasar Framework`,

  meta: getMeta(
    'Quasar Framework - Enterprise-ready, AI-ready cross-platform Vue.js framework',
    'Build high-performance, accessible Vue.js websites, PWA, SSR, SSG, browser extension, mobile and desktop apps from one codebase, with documentation and API your AI coding agent reads offline. Sensible people choose Vue. Productive people choose Quasar. Be both.'
  )
})
</script>
