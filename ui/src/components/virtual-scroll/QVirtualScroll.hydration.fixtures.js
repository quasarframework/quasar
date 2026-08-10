import { h } from 'vue'

import { QVirtualScroll } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(
      QVirtualScroll,
      {
        style: 'max-height: 120px',
        items: Array.from({ length: 50 }, (_, i) => `Item #${i}`),
        virtualScrollItemSize: 24
      },
      {
        default: ({ item, index }) =>
          h('div', { key: index, style: 'height: 24px' }, item)
      }
    )
}
