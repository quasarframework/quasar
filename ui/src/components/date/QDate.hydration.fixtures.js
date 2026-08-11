import { h } from 'vue'

import { QDate } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically (the
// model is pinned so the render never depends on the current date).

export const basic = {
  render: () =>
    h(QDate, {
      modelValue: '2019/02/01',
      'onUpdate:modelValue': () => {}
    })
}

// no model: the calendar shows the CURRENT month, where the
// today-highlight is gated behind useHydration on purpose — this
// exercises that gate (only flake window: a run crossing midnight)
export const currentMonth = {
  render: () =>
    h(QDate, {
      modelValue: null,
      'onUpdate:modelValue': () => {}
    })
}
