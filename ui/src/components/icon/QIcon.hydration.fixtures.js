import { h } from 'vue'

import { QIcon } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () => h(QIcon, { name: 'home', size: '24px' })
}

// class-based sets carry no text content (glyph comes from the font's
// ::before rule) — covers the childless render path
export const webfont = {
  render: () => h(QIcon, { name: 'mdi-account', color: 'primary' })
}

export const svgPath = {
  render: () =>
    h(QIcon, {
      name: 'M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z'
    })
}
