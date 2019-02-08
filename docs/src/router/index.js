import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store }) {
  const Router = new VueRouter({
    routes,

    scrollBehavior (to, _, savedPosition) {
      return new Promise(resolve => {
        setTimeout(() => {
          if (to.hash !== void 0 && to.hash !== '') {
            const el = document.getElementById(to.hash.substring(1))

            if (el !== null) {
              resolve({ x: 0, y: el.offsetTop - el.scrollHeight })
              return
            }
          }

          resolve(savedPosition || { x: 0, y: 0 })
        }, 100)
      })
    },

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  sync(store, Router)

  return Router
}
