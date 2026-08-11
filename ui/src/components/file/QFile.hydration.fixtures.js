import { h } from 'vue'

import { QFile } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QFile, {
      modelValue: null,
      label: 'File',
      'onUpdate:modelValue': () => {}
    })
}

export const errorState = {
  render: () =>
    h(QFile, {
      modelValue: null,
      label: 'Required file',
      error: true,
      errorMessage: 'Please attach a file',
      'onUpdate:modelValue': () => {}
    })
}
