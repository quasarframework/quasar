import { h } from 'vue'

import { QForm, QInput } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QForm, {}, () => [
      h(QInput, {
        modelValue: 'value',
        label: 'Name',
        'onUpdate:modelValue': () => {}
      })
    ])
}
