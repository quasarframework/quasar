import { createSSRApp, nextTick } from 'vue'
import { commands } from 'vitest/browser'

import Quasar from 'quasar/src/vue-plugin.js'

const mountedList = []

/**
 * Full hydration round-trip for a fixture: the ssrRender command
 * server-renders it in Node through the built server bundle, then the
 * SAME fixture (compiled from ui/src with ssr-client flags) hydrates
 * that HTML here, while every console error/warning is captured (Vue
 * reports hydration mismatches through them, dev builds only).
 *
 * `fixturesPath`/`exportName` locate the fixture for the Node side
 * (which can only receive serializable values); `fixture` is the same
 * export imported by the test for the browser side.
 *
 * One takeover() per test FILE, as its last act: it flips the
 * module-level isRuntimeSsrPreHydration state and platform values for
 * the whole graph, exactly like in a real app — later hydrations in
 * the same file would no longer start from the pre-hydration state.
 * (Files are isolated from each other by the browser runner.)
 */
export async function hydrate(fixturesPath, exportName, fixture) {
  const html = await commands.ssrRender(
    fixturesPath,
    exportName,
    navigator.userAgent
  )

  const host = document.createElement('div')
  host.innerHTML = html
  document.body.append(host)

  // as normalized by the browser's parser, for mismatch debugging
  const serverHtml = host.innerHTML

  const app = createSSRApp(fixture)
  app.use(Quasar)

  const consoleOutput = []
  const original = { error: console.error, warn: console.warn }
  // captured output is NOT echoed to the terminal on purpose: a real
  // mismatch is reported in full through the failing consoleOutput
  // assertion, and the harness self-test triggers warnings
  // intentionally — echoing those would read like an actual error
  for (const level of ['error', 'warn']) {
    console[level] = (...args) => {
      consoleOutput.push(`[${level}] ${args.join(' ')}`)
    }
  }

  let vm
  try {
    vm = app.mount(host)
    await nextTick()
  } finally {
    Object.assign(console, original)
  }

  mountedList.push({ app, host })

  return {
    host,
    vm,
    serverHtml,
    consoleOutput,
    takeover: async () => {
      vm.$q.onSSRHydrated()
      await nextTick()
    }
  }
}

export function cleanupHydrated() {
  for (const { app, host } of mountedList.splice(0)) {
    app.unmount()
    host.remove()
  }
}
