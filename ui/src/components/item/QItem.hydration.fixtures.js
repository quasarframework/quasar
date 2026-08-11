import { h } from 'vue'

import { QItem, QItemLabel, QItemSection, QList } from 'quasar'

import { getHydrationRouter } from '../../../test/hydration/router.js'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

// applied to the app on both sides (the `to` fixture needs a router)
export async function setupApp(app) {
  app.use(await getHydrationRouter(['/target']))
}

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

export const withTo = {
  render: () =>
    h(QList, { bordered: true }, () => [
      h(QItem, { to: '/target' }, () => [
        h(QItemSection, {}, () => 'Link item')
      ])
    ])
}
