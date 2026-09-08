// NO server-rendered-flag import here: without the body attribute a
// __QUASAR_SSR_PWA__ build boots as the PWA shell, a plain client
// render with no hydration at all
import { createApp, h } from 'vue'
import { afterEach, describe, expect, test } from 'vitest'

import Quasar from 'quasar/src/vue-plugin.js'
import { isRuntimeSsrPreHydration } from 'quasar/src/plugins/platform/Platform.js'

const mounted = []

afterEach(() => {
  for (const { app, host } of mounted.splice(0)) {
    app.unmount()
    host.remove()
  }
  document.body.classList.remove('body--dark', 'body--light')
})

// the shell HTML is the plain client template: no server-emitted body
// class for the Dark plugin to read its state back from (an ssr-client
// build hydrating server markup does exactly that), so the shell must
// start from the config instead, like an SPA does
describe('PWA SSR hydration, shell boot: Dark plugin', () => {
  test('boots outside of pre-hydration mode', () => {
    expect(isRuntimeSsrPreHydration.value).toBe(false)
  })

  test('applies the dark config instead of reading the (absent) body class', () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({ render: () => h('div') })
    app.use(Quasar, { config: { dark: true } })
    const vm = app.mount(host)
    mounted.push({ app, host })

    expect(vm.$q.dark.isActive).toBe(true)
    expect(vm.$q.dark.mode).toBe(true)
    expect(document.body.classList.contains('body--dark')).toBe(true)
  })
})
