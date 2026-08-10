import { h } from 'vue'

import { QItem, QItemLabel, QItemSection, QList } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QList, { bordered: true }, () => [
      h(QItem, {}, () => [
        h(QItemSection, {}, () => [
          h(QItemLabel, {}, () => 'Label'),
          h(QItemLabel, { caption: true }, () => 'Caption')
        ])
      ])
    ])
}
