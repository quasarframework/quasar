import { h } from 'vue'

import { QImg } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

const gif = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

export const basic = {
  render: () => h(QImg, { src: gif, ratio: 1 })
}

// QImg defers loading until hydrated (isRuntimeSsrPreHydration) — the
// placeholder is what both sides must render until then
export const withPlaceholder = {
  render: () => h(QImg, { src: gif, placeholderSrc: gif, ratio: 1 })
}

export const noSpinner = {
  render: () => h(QImg, { src: gif, ratio: 1, noSpinner: true })
}
