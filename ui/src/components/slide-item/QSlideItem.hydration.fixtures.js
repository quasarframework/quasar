import { h } from 'vue'

import { QSlideItem } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(
      QSlideItem,
      {},
      {
        default: () => h('div', 'content'),
        left: () => h('div', 'L'),
        right: () => h('div', 'R')
      }
    )
}
