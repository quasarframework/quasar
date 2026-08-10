import { h } from 'vue'

import { QPopupEdit } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h('div', { class: 'popup-target' }, [
      'value',
      h(
        QPopupEdit,
        { modelValue: 'value', 'onUpdate:modelValue': () => {} },
        () => h('div', 'Edit')
      )
    ])
}
