// NO server-rendered-flag import here: without the body attribute a
// __QUASAR_SSR_PWA__ build boots as the PWA shell — a plain client
// render with no hydration at all
import { createApp, nextTick } from 'vue'
import { afterEach, describe, expect, test } from 'vitest'

import Quasar from 'quasar/src/vue-plugin.js'
import { isRuntimeSsrPreHydration } from 'quasar/src/plugins/platform/Platform.js'
import { hydrate } from 'testing/hydration/hydrate.js'

import { basic as noSsrBasic } from 'quasar/src/components/no-ssr/QNoSsr.hydration.fixtures.js'

const noSsrPath = 'src/components/no-ssr/QNoSsr.hydration.fixtures.js'

const mounted = []

afterEach(() => {
  for (const { app, host } of mounted.splice(0)) {
    app.unmount()
    host.remove()
  }
})

// a fresh client render into an empty host — how the PWA shell boots
async function mountShell(fixture) {
  const host = document.createElement('div')
  document.body.append(host)

  const app = createApp(fixture)
  app.use(Quasar)

  const consoleOutput = []
  const original = { error: console.error, warn: console.warn }
  for (const level of ['error', 'warn']) {
    console[level] = (...args) => {
      consoleOutput.push(`[${level}] ${args.join(' ')}`)
    }
  }

  try {
    app.mount(host)
    await nextTick()
  } finally {
    Object.assign(console, original)
  }

  mounted.push({ app, host })

  return { host, consoleOutput }
}

describe('PWA SSR hydration — shell boot', () => {
  test('boots outside of pre-hydration mode', () => {
    expect(isRuntimeSsrPreHydration.value).toBe(false)
  })

  test('QNoSsr renders its content immediately, never the placeholder', async () => {
    const { host, consoleOutput } = await mountShell(noSsrBasic)

    expect(consoleOutput).toEqual([])
    expect(host.textContent).toBe('Client only content')
  })

  test('the hydration harness refuses to run in shell mode', async () => {
    await expect(hydrate(noSsrPath, 'basic', noSsrBasic)).rejects.toThrow(
      'takeover'
    )
  })
})
