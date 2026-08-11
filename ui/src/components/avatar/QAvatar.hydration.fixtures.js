import { h } from 'vue'

import { QAvatar } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QAvatar, { color: 'primary', textColor: 'white', icon: 'home' })
}
