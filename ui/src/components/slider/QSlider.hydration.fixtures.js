import { h } from 'vue'

import { QSlider } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QSlider, {
      modelValue: 30,
      min: 0,
      max: 100,
      'onUpdate:modelValue': () => {}
    })
}
