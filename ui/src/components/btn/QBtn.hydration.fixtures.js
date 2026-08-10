import { h } from 'vue'

import { QBtn } from 'quasar'

import { getHydrationRouter } from '../../../test/hydration/router.js'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

// applied to the app on both sides (the `to` fixtures need a router)
export async function setupApp(app) {
  app.use(await getHydrationRouter(['/target']))
}

export const basic = {
  render: () => h(QBtn, { label: 'Hydrate me', icon: 'home' })
}

// QBtn deliberately has NO active-route styling
// (useRouterLinkNonMatchingProps) — active-link class parity is
// covered by the QItem/QBreadcrumbs fixtures instead
export const withTo = {
  render: () => h(QBtn, { label: 'Navigate', to: '/target' })
}
