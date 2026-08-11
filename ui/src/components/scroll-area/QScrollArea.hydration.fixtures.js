import { h } from 'vue'

import { QScrollArea } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QScrollArea, { style: 'height: 100px' }, () =>
      h('div', { style: 'height: 500px' }, 'long content')
    )
}
