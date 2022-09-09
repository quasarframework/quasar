/* global gtag */

import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'

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
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : createWebHistory

  const Router = createRouter({
    scrollBehavior: (to, _, savedPosition) => (
      to.hash.length > 1
        ? false
        : (savedPosition || { left: 0, top: 0 })
    ),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, _, next) => {
    if (to.fullPath.startsWith('/quasar-cli/') === true) {
      next({
        path: to.fullPath.replace('/quasar-cli/', '/quasar-cli-webpack/'),
        query: to.query,
        hash: to.hash
      })
    }
    else {
      next()
    }
  })

  process.env.CLIENT === true && Router.afterEach(to => {
    gtag('config', 'UA-6317975-6', {
      page_path: to.path
    })
  })

  return Router
}
