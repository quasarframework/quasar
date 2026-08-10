import { h } from 'vue'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.
// The screen.bodyClasses config makes the SERVER emit screen--xs (it
// cannot know the viewport); the client keeps it until the takeover,
// which corrects it to the real breakpoint.

export const quasarOptions = {
  config: { screen: { bodyClasses: true } }
}

export const basic = {
  render: () => h('div', 'Screen body classes')
}
