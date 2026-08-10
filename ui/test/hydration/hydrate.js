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
 * A fixtures module may also export `quasarOptions` (Quasar install
 * options: config/lang/iconSet — e.g. `{ config: { dark: true } }` or
 * an RTL lang pack) and `setupApp(app)` (further app setup, e.g.
 * installing the router from ./router.js). The Node side applies both
 * automatically; the test must pass them along here so the browser
 * side matches.
 *
 * One takeover() per test FILE, as its last act: it flips the
 * module-level isRuntimeSsrPreHydration state and platform values for
 * the whole graph, exactly like in a real app — later hydrations in
 * the same file would no longer start from the pre-hydration state.
 * (Files are isolated from each other by the browser runner.)
 */
export async function hydrate(
  fixturesPath,
  exportName,
  fixture,
  { quasarOptions, setupApp } = {}
) {
  const { html, bodyClasses } = await commands.ssrRender(
    fixturesPath,
    exportName,
    navigator.userAgent
  )

  // like a real SSR page: the server-emitted <body> classes are in
  // place before the client app boots — the Dark plugin reads its
  // state from them (not from the config) on ssr-client builds
  const previousBodyClassName = document.body.className
  document.body.className = bodyClasses

  const host = document.createElement('div')
  host.innerHTML = html
  document.body.append(host)

  // as normalized by the browser's parser, for mismatch debugging
  const serverHtml = host.innerHTML

  const app = createSSRApp(fixture)
  app.use(Quasar, quasarOptions)

  if (setupApp !== void 0) {
    await setupApp(app)
  }

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

  mountedList.push({ app, host, previousBodyClassName })

  return {
    host,
    vm,
    serverHtml,
    bodyClasses,
    consoleOutput,
    takeover: async () => {
      vm.$q.onSSRHydrated()
      await nextTick()
    }
  }
}

export function cleanupHydrated() {
  const entries = mountedList.splice(0)

  for (const { app, host } of entries) {
    app.unmount()
    host.remove()
  }

  if (entries.length !== 0) {
    // the state from before the test's first hydrate()
    document.body.className = entries[0].previousBodyClassName
  }
}
