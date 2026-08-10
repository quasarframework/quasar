import { h } from 'vue'

import { QInput } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QInput, {
      modelValue: 'text',
      label: 'Label',
      'onUpdate:modelValue': () => {}
    })
}

export const decorated = {
  render: () =>
    h(QInput, {
      modelValue: 'text',
      label: 'Label',
      filled: true,
      clearable: true,
      counter: true,
      maxlength: 20,
      prefix: '$',
      suffix: '.00',
      hint: 'A hint',
      'onUpdate:modelValue': () => {}
    })
}

// autogrow computes its height imperatively after mount — the
// server/pre-hydration markup must agree before that kicks in
export const autogrow = {
  render: () =>
    h(QInput, {
      modelValue: 'line one\nline two',
      type: 'textarea',
      autogrow: true,
      'onUpdate:modelValue': () => {}
    })
}
