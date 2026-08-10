import { h } from 'vue'

import { QEditor } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QEditor, {
      modelValue: '<p>editor content</p>',
      'onUpdate:modelValue': () => {}
    })
}
