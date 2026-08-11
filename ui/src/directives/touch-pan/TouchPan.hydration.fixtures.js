import { h, withDirectives } from 'vue'

import { TouchPan } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () => withDirectives(h('div', 'Pan me'), [[TouchPan, () => {}]])
}
