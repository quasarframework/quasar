import { h } from 'vue'

import { LocalStorage } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const STORAGE_KEY = 'hydration-theme'

export const items = {
  setup() {
    return () => h('div', String(LocalStorage.items[STORAGE_KEY]))
  }
}
