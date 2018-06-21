import Vue from 'vue'
import { createApp } from './app'
import { QAjaxBar } from 'quasar'

const bar = new Vue(QAjaxBar).$mount()
document.body.appendChild(bar.$el)

const { app, router } = createApp()

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    bar.start()
    next()
  })
  router.afterEach((to, from, next) => {
    bar.stop()
  })
  app.$mount('#q-app')
})
