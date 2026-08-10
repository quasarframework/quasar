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

// containerized layouts size against their parent element instead of
// the viewport (a distinct branch in QLayout/QFooter positioning)
export const container = {
  render: () =>
    h('div', { style: 'height: 200px' }, [
      h(QLayout, { view: 'hHh lpR fFf', container: true }, () => [
        h(QHeader, {}, () => h('div', 'Header')),
        h(QPageContainer, {}, () => h(QPage, {}, () => h('div', 'Page'))),
        h(QFooter, {}, () => h('div', 'Footer'))
      ])
    ])
}

// show-if-above decides from Screen state, which starts from SSR
// defaults on both sides until the client takeover
export const drawerShowIfAbove = {
  render: () =>
    h(QLayout, { view: 'hHh lpR fFf' }, () => [
      h(QDrawer, { showIfAbove: true, side: 'left' }, () => h('div', 'Drawer')),
      h(QPageContainer, {}, () => h(QPage, {}, () => h('div', 'Page')))
    ])
}
