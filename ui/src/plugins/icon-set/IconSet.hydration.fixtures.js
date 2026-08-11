import { h } from 'vue'

import { QSelect } from 'quasar'
import svgMaterialIcons from 'quasar/icon-set/svg-material-icons.js'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.
// An SVG icon set must drive the SERVER markup (inline <svg> instead
// of the default font ligatures) and hydrate identically.

export const quasarOptions = {
  iconSet: svgMaterialIcons
}

export const basic = {
  render: () =>
    h(QSelect, {
      modelValue: 'a',
      options: ['a', 'b'],
      label: 'Select',
      'onUpdate:modelValue': () => {}
    })
}
