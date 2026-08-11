import { h } from 'vue'

import { QChatMessage } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QChatMessage, { name: 'jane', text: ['hello there'], stamp: 'yesterday' })
}
