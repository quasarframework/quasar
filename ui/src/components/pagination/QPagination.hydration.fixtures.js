import { h } from 'vue'

import { QPagination } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QPagination, { modelValue: 1, max: 5, 'onUpdate:modelValue': () => {} })
}
