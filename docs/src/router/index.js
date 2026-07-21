/* global gtag */

import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function appRouter() {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : createWebHistory

  const Router = createRouter({
    scrollBehavior: (to, _, savedPosition) =>
      to.hash.length > 1 ? false : savedPosition || { left: 0, top: 0 },
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE)
  })

  if (import.meta.env.QUASAR_CLIENT && import.meta.env.PROD) {
    Router.afterEach(to => {
      gtag('config', 'G-WRH1VBGG35', {
        page_path: to.path
      })
    })
  }

  return Router
}
