import { h } from 'vue'

import { QCard, QCardSection } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.
// The server cannot resolve 'auto': it renders light and hands the
// resolution over to the client, which does it only on takeover.

export const quasarOptions = {
  config: { dark: 'auto' }
}

export const autoCard = {
  render: () => h(QCard, {}, () => [h(QCardSection, {}, () => 'Auto card')])
}
