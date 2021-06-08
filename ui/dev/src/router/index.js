import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'

import routes from './routes'

export default function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: to => (to.meta && to.meta.skipScroll === true ? false : { x: 0, y: 0 }),
    routes,
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  return Router
}
