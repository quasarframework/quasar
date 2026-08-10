import { h } from 'vue'

import { QCard, QCardSection } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.
// The dark config must drive the SERVER markup and body classes, with
// the client reading its state back from them (not from the config).

export const quasarOptions = {
  config: { dark: true }
}

export const darkCard = {
  render: () => h(QCard, {}, () => [h(QCardSection, {}, () => 'Dark card')])
}
