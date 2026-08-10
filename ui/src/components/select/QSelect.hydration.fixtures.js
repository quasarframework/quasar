import { h } from 'vue'

import { QSelect } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QSelect, {
      modelValue: 'a',
      options: ['a', 'b'],
      label: 'Select',
      'onUpdate:modelValue': () => {}
    })
}

// the selected chips derive from the model, so the server renders
// them into the field control already
export const multipleChips = {
  render: () =>
    h(QSelect, {
      modelValue: ['a', 'b'],
      options: ['a', 'b', 'c'],
      label: 'Select',
      multiple: true,
      useChips: true,
      filled: true,
      'onUpdate:modelValue': () => {}
    })
}
