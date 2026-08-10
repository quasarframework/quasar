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

export const stateVariants = {
  render: () =>
    h('div', [
      h(QBtn, { label: 'Loading', loading: true }),
      h(QBtn, { label: 'Disabled', disable: true }),
      h(QBtn, { icon: 'add', round: true }),
      h(QBtn, { label: 'Flat dense', flat: true, dense: true }),
      h(QBtn, { icon: 'navigation', fab: true })
    ])
}

// QBtn deliberately has NO active-route styling
// (useRouterLinkNonMatchingProps) — active-link class parity is
// covered by the QItem/QBreadcrumbs fixtures instead
export const withTo = {
  render: () => h(QBtn, { label: 'Navigate', to: '/target' })
}
