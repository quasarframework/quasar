import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'

// node resolves this to the built quasar server bundle (package
// "node" export condition) — the same code path the docs SSR uses
import { Quasar } from 'quasar'

/**
 * Server-renders a docs component the way the site's SSR does,
 * returning its markup. A memory router is always installed: several
 * components render router-links.
 */
export async function renderComponent(component, props, slots) {
  const app = createSSRApp({ render: () => h(component, props, slots) })

  const ssrContext = {
    req: { headers: {}, url: '/' },
    res: {}
  }
  app.use(Quasar, {}, ssrContext)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:catchAll(.*)*', component: { render: () => h('div') } }]
  })
  app.use(router)
  router.push('/')
  await router.isReady()

  return renderToString(app, ssrContext)
}
