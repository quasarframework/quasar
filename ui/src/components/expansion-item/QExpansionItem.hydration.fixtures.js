import { h } from 'vue'

import { QExpansionItem } from 'quasar'

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
    h(QExpansionItem, { label: 'Expansion' }, () => h('div', 'Content'))
}

export const withTo = {
  render: () =>
    h(QExpansionItem, { label: 'Link expansion', to: '/target' }, () =>
      h('div', 'Content')
    )
}

// expanded from the start, so the content is in the server payload
export const defaultOpened = {
  render: () =>
    h(QExpansionItem, { label: 'Opened expansion', defaultOpened: true }, () =>
      h('div', 'Opened content')
    )
}
