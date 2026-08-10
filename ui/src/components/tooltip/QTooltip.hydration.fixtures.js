import { h } from 'vue'

import { QTooltip } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h('div', { class: 'tooltip-target' }, [
      'target',
      h(
        QTooltip,
        { modelValue: false, 'onUpdate:modelValue': () => {} },
        () => 'tip'
      )
    ])
}
