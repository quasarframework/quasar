import { h } from 'vue'

import { QChip } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () => h(QChip, { icon: 'event', label: 'Chip' })
}

export const states = {
  render: () =>
    h('div', [
      h(QChip, { label: 'Outline', outline: true }),
      h(QChip, { label: 'Square dense', square: true, dense: true }),
      h(QChip, { label: 'Removable', removable: true })
    ])
}
