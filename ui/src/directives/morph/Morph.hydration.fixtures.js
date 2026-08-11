import { h, withDirectives } from 'vue'

import { Morph } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.
// Regression net for the directive's created hook: the server renders
// q-morph--invisible on non-active group members (getSSRProps) and
// the client must hydrate that without a class mismatch warning.

export const group = {
  render: () =>
    h('div', [
      withDirectives(h('div', 'Active member'), [[Morph, 'one', 'one:grp']]),
      withDirectives(h('div', 'Hidden member'), [[Morph, 'one', 'two:grp']])
    ])
}
