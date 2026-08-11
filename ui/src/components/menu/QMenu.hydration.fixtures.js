import { h } from 'vue'

import { QMenu } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h('div', { class: 'menu-target' }, [
      'target',
      h(QMenu, { modelValue: false, 'onUpdate:modelValue': () => {} }, () =>
        h('div', 'Menu content')
      )
    ])
}
