import { h } from 'vue'

import { QStep, QStepper, QStepperNavigation } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QStepper, { modelValue: 1, 'onUpdate:modelValue': () => {} }, () => [
      h(QStep, { name: 1, title: 'Step one', icon: 'settings' }, () => [
        h('div', 'Step 1 content'),
        h(QStepperNavigation, {}, () => h('div', 'nav'))
      ]),
      h(QStep, { name: 2, title: 'Step two', icon: 'create_new_folder' }, () =>
        h('div', 'Step 2 content')
      )
    ])
}
