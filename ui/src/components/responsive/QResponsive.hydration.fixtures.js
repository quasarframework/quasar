import { h } from 'vue'

import { QResponsive } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QResponsive, { ratio: 16 / 9, style: 'width: 200px' }, () =>
      h('div', 'content')
    )
}
