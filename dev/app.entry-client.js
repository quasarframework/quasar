import { createApp } from './app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#q-app')
})
