import { h } from 'vue'

import { QBreadcrumbs, QBreadcrumbsEl } from 'quasar'

import { getHydrationRouter } from '../../../test/hydration/router.js'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

// applied to the app on both sides (the `to` fixture needs a router)
export async function setupApp(app) {
  app.use(await getHydrationRouter(['/target']))
}

export const basic = {
  render: () =>
    h(QBreadcrumbs, {}, () => [
      h(QBreadcrumbsEl, { label: 'Home', icon: 'home' }),
      h(QBreadcrumbsEl, { label: 'Components' })
    ])
}

export const withTo = {
  render: () =>
    h(QBreadcrumbs, {}, () => [
      h(QBreadcrumbsEl, { label: 'Home', icon: 'home', to: '/' }),
      h(QBreadcrumbsEl, { label: 'Target', to: '/target' })
    ])
}
