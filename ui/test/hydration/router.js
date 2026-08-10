import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

// a render function instead of a template string, so that
// the runtime-only Vue build suffices
const routeComponent = { render: () => h('div') }

/**
 * Router for hydration fixtures (installed through their `setupApp`
 * export). Memory history on purpose: it is DOM-free and ignores the
 * page URL, so the server pass and the browser pass resolve the exact
 * same route — a precondition for identical renders. Starts at "/".
 */
export async function getHydrationRouter(paths = []) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: ['/', ...paths].map(path => ({ path, component: routeComponent }))
  })

  router.push('/')
  await router.isReady()

  return router
}
