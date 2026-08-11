import { h } from 'vue'

import { QCard, QCardActions, QCardSection } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QCard, {}, () => [
      h(QCardSection, {}, () => 'Section content'),
      h(QCardActions, {}, () => h('div', 'Actions'))
    ])
}

export const darkCard = {
  render: () =>
    h(QCard, { dark: true }, () => [h(QCardSection, {}, () => 'Dark prop')])
}
