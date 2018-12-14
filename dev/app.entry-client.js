import { createApp } from './app'
import { LoadingBar } from 'quasar'

const { app, router } = createApp()

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    LoadingBar.start()
    next()
  })
  router.afterEach((to, from, next) => {
    LoadingBar.stop()
  })
  app.$mount('#q-app')
})
