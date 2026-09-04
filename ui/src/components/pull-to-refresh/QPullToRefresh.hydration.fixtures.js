import { h } from 'vue'

import { QPullToRefresh } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QPullToRefresh, { onRefresh: () => {} }, () => h('div', 'content'))
}

export const bottom = {
  render: () =>
    h(QPullToRefresh, { side: 'bottom', onRefresh: () => {} }, () =>
      h('div', 'content')
    )
}
