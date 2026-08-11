import { h } from 'vue'

import { QTimeline, QTimelineEntry } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QTimeline, { color: 'secondary' }, () => [
      h(QTimelineEntry, { heading: true }, () => 'Timeline heading'),
      h(QTimelineEntry, { title: 'Event', subtitle: 'February 2, 2019' }, () =>
        h('div', 'Entry body')
      )
    ])
}
