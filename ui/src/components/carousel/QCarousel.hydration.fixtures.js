import { h } from 'vue'

import { QCarousel, QCarouselControl, QCarouselSlide } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(
      QCarousel,
      { modelValue: 'a', height: '200px', 'onUpdate:modelValue': () => {} },
      () => [
        h(QCarouselSlide, { name: 'a' }, () => 'Slide A'),
        h(QCarouselSlide, { name: 'b' }, () => 'Slide B'),
        h(QCarouselControl, { position: 'bottom' }, () => h('div', 'Control'))
      ]
    )
}
