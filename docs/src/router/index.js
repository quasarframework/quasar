/* global gtag */

import { createRouter, createMemoryHistory, createWebHashHistory } from 'vue-router'

import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function () {
  const createHistory = process.env.MODE === 'ssr'
    ? createMemoryHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: (_, __, savedPosition) => savedPosition || { x: 0, y: 0 },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  process.env.CLIENT === true && Router.afterEach(to => {
    gtag('config', 'UA-6317975-6', {
      page_path: to.path
    })
  })

  return Router
}
