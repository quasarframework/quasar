import { h } from 'vue'

import { QBadge } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () => h(QBadge, { color: 'primary', label: 'Badge' })
}

export const states = {
  render: () =>
    h('div', { class: 'relative-position' }, [
      h(QBadge, { label: 'Outline', outline: true, color: 'primary' }),
      h(QBadge, { label: 'Rounded', rounded: true, color: 'primary' }),
      h(QBadge, { label: 'Floating', floating: true, color: 'primary' })
    ])
}
