import { h } from 'vue'

import { QPagination } from 'quasar'
import langHe from 'quasar/lang/he.js'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.
// An RTL lang pack must reach the server-emitted <html> attributes
// and flip direction-sensitive component rendering identically on
// both sides.

export const quasarOptions = {
  lang: langHe
}

export const rtlPagination = {
  render: () =>
    h(QPagination, { modelValue: 1, max: 5, 'onUpdate:modelValue': () => {} })
}
