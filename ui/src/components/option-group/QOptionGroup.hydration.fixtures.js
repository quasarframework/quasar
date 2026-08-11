import { h } from 'vue'

import { QOptionGroup } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QOptionGroup, {
      modelValue: 'a',
      options: [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' }
      ],
      'onUpdate:modelValue': () => {}
    })
}
