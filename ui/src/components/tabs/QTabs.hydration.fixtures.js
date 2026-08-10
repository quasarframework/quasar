import { h } from 'vue'

import { QRouteTab, QTab, QTabs } from 'quasar'

import { getHydrationRouter } from '../../../test/hydration/router.js'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

// applied to the app on both sides (QRouteTab needs a router)
export async function setupApp(app) {
  app.use(await getHydrationRouter(['/alpha']))
}

export const basic = {
  render: () =>
    h(QTabs, { modelValue: 'a', 'onUpdate:modelValue': () => {} }, () => [
      h(QTab, { name: 'a', label: 'Tab A' }),
      h(QTab, { name: 'b', label: 'Tab B' })
    ])
}

export const withRouteTab = {
  render: () =>
    h(QTabs, { modelValue: 'a', 'onUpdate:modelValue': () => {} }, () => [
      h(QTab, { name: 'a', label: 'Tab A' }),
      h(QRouteTab, { name: 'r', label: 'Route tab', to: '/alpha' })
    ])
}
