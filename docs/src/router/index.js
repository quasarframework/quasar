/* global gtag */

import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function () {
  const Router = new VueRouter({
    routes,

    scrollBehavior (to, __, savedPosition) {
      if (to.query === void 0 || to.query.noScroll !== true) {
        return savedPosition || { x: 0, y: 0 }
      }
    },

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  process.env.CLIENT === true && Router.afterEach(to => {
    gtag('config', 'UA-6317975-6', {
      page_path: to.path
    })
  })

  return Router
}
