import { h } from 'vue'

import { QIntersection } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const basic = {
  render: () =>
    h(QIntersection, { style: 'height: 50px' }, () =>
      h('div', 'Observed content')
    )
}

// ssrPrerender makes the SERVER render the content, and the client
// must keep it in place until hydration completes
export const ssrPrerendered = {
  render: () =>
    h(QIntersection, { ssrPrerender: true, style: 'height: 50px' }, () =>
      h('div', 'Prerendered content')
    )
}
