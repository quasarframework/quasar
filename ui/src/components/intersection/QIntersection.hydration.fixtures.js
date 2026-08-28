import { defineComponent, h, onMounted, onUnmounted } from 'vue'

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

// counts the slot child's lifecycle on the client side (the server
// renders its own module copy, so these stay untouched by it)
export const counters = { setup: 0, mounted: 0, unmounted: 0 }

const Probe = defineComponent({
  name: 'ContentProbe',
  setup() {
    counters.setup++
    onMounted(() => {
      counters.mounted++
    })
    onUnmounted(() => {
      counters.unmounted++
    })
    return () => h('div', 'Prerendered content')
  }
})

export const oncePrerendered = {
  render: () =>
    h(
      QIntersection,
      { once: true, ssrPrerender: true, style: 'height: 50px' },
      () => h(Probe)
    )
}
