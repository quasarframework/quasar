import { h } from 'vue'

import { QCheckbox } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QCheckbox, {
      modelValue: true,
      label: 'Checkbox',
      'onUpdate:modelValue': () => {}
    })
}

export const states = {
  render: () =>
    h('div', [
      h(QCheckbox, {
        modelValue: true,
        label: 'Disabled',
        disable: true,
        'onUpdate:modelValue': () => {}
      }),
      h(QCheckbox, {
        modelValue: null,
        label: 'Indeterminate',
        'onUpdate:modelValue': () => {}
      }),
      h(QCheckbox, {
        modelValue: false,
        label: 'Dense',
        dense: true,
        'onUpdate:modelValue': () => {}
      })
    ])
}
