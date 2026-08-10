import { h } from 'vue'

import { QFab, QFabAction } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(
      QFab,
      {
        modelValue: false,
        icon: 'add',
        color: 'primary',
        'onUpdate:modelValue': () => {}
      },
      () => [h(QFabAction, { icon: 'mail', color: 'secondary' })]
    )
}
