<template>
  <router-view />
</template>

<script setup>
import { useMeta, Platform, Dark } from 'quasar'
import { onMounted } from 'vue'

import getMeta from 'assets/get-meta.js'

useMeta({
  title: 'Quasar Framework',
  titleTemplate: title => `${title} | Quasar Framework`,

  meta: getMeta(
    'Quasar Framework - Build high-performance VueJS user interfaces in record time',
    'Developer-oriented, front-end framework with VueJS components for best-in-class high-performance, responsive websites, PWA, SSR, Mobile and Desktop apps, all from the same codebase. Sensible people choose Vue. Productive people choose Quasar. Be both.'
  )
})

if (process.env.CLIENT) {
  function getMobilePlatform (is) {
    if (is.ios === true) return 'ios'
    if (is.android === true) return 'android'
  }

  function getBodyClasses ({ is, has }) {
    const cls = [
      is.desktop === true ? 'desktop' : 'mobile',
      `${ has.touch === false ? 'no-' : '' }touch`
    ]

    if (is.mobile === true) {
      const mobile = getMobilePlatform(is)
      mobile !== void 0 && cls.push('platform-' + mobile)
    }

    cls.push(`body--${ Dark.isActive === true ? 'dark' : 'light' }`)

    return cls.join(' ')
  }

  // need to apply correction from SSG
  // until Quasar SSG mode is available
  onMounted(() => {
    const classes = getBodyClasses(Platform)
    if (document.body.className !== classes) {
      document.body.className = classes
    }
  })
}
</script>
