import { createApp } from './ssr.app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#q-app')
})
