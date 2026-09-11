import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'

// node resolves this to the built quasar server bundle (package
// "node" export condition) — the same code path the docs SSR uses
import { Meta, Quasar } from 'quasar'

/**
 * Server-renders a docs component the way the site's SSR does,
 * returning its markup and the <head> tags its useMeta() calls add. A
 * memory router is always installed: several components render
 * router-links.
 *
 * @returns {Promise<{ html: string, headTags: string }>}
 */
export async function renderComponentWithHead(
  component,
  props,
  slots,
  { path = '/' } = {}
) {
  const app = createSSRApp({ render: () => h(component, props, slots) })

  // the shape the Meta plugin writes into, and the render hook it
  // registers on - the parts of app-vite's SSR context it touches
  const onRendered = []
  const ssrContext = {
    req: { headers: {}, url: '/' },
    res: {},
    _meta: { htmlAttrs: '', headTags: '', bodyAttrs: '', bodyTags: '' },
    onRendered: fn => {
      onRendered.push(fn)
    }
  }
  app.use(Quasar, { plugins: { Meta } }, ssrContext)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:catchAll(.*)*', component: { render: () => h('div') } }]
  })
  app.use(router)
  router.push(path)
  await router.isReady()

  const html = await renderToString(app, ssrContext)
  for (const fn of onRendered) fn()

  return { html, headTags: ssrContext._meta.headTags }
}

/**
 * renderComponentWithHead() for the tests that only read the markup.
 *
 * @returns {Promise<string>}
 */
export async function renderComponent(component, props, slots) {
  const { html } = await renderComponentWithHead(component, props, slots)
  return html
}
