import { h } from 'vue'

import {
  QDrawer,
  QFooter,
  QHeader,
  QLayout,
  QPage,
  QPageContainer,
  QPageScroller,
  QPageSticky
} from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QLayout, { view: 'hHh lpR fFf' }, () => [
      h(QHeader, { elevated: true }, () => h('div', 'Header')),
      h(
        QDrawer,
        { modelValue: false, side: 'left', 'onUpdate:modelValue': () => {} },
        () => h('div', 'Drawer')
      ),
      h(QPageContainer, {}, () =>
        h(QPage, {}, () => [
          h('div', 'Page content'),
          h(QPageSticky, { position: 'bottom-right', offset: [18, 18] }, () =>
            h('div', 'Sticky')
          ),
          h(QPageScroller, {}, () => h('div', 'Scroll to top'))
        ])
      ),
      h(QFooter, {}, () => h('div', 'Footer'))
    ])
}
