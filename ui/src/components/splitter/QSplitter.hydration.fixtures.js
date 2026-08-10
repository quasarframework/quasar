import { h } from 'vue'

import { QSplitter } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(
      QSplitter,
      {
        modelValue: 50,
        style: 'height: 100px',
        'onUpdate:modelValue': () => {}
      },
      {
        before: () => h('div', 'before'),
        after: () => h('div', 'after')
      }
    )
}
