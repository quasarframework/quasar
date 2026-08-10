import { createSSRApp, nextTick } from 'vue'
import { commands } from 'vitest/browser'

import Quasar from 'quasar/src/vue-plugin.js'
import { isRuntimeSsrPreHydration } from 'quasar/src/plugins/platform/Platform.js'

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
 * One takeover() per test FILE, as its last act (enforced below): it
 * flips the module-level isRuntimeSsrPreHydration state and platform
 * values for the whole graph, exactly like in a real app — later
 * hydrations in the same file would no longer start from the
 * pre-hydration state. (Files are isolated from each other by the
 * browser runner.)
 */
// tests pass their own import.meta.url: the colocated fixtures
// sibling is derived from it (X.hydration.test.js ->
// X.hydration.fixtures.js), which cannot drift the way a hand-typed
// path can. Plain root-relative paths stay supported for tests
// borrowing another file's fixtures.
function resolveFixturesPath(fixturesPath) {
  if (!/^(https?|file):/.test(fixturesPath)) return fixturesPath

  return new URL(fixturesPath).pathname
    .replace(/^\/@fs/, '') // vite's filesystem-serving prefix, if any
    .replace(/^\/([A-Za-z]:\/)/, '$1') // "/C:/..." -> "C:/..." (Windows)
    .replace(/\.test\.js$/, '.fixtures.js')
}

export async function hydrate(
  fixturesPath,
  exportName,
  fixture,
  { quasarOptions, setupApp } = {}
) {
  fixturesPath = resolveFixturesPath(fixturesPath)

  if (isRuntimeSsrPreHydration.value === false) {
    throw new Error(
      'hydrate() called after the client takeover — takeover() must be ' +
        'the LAST act of a test file, since it permanently flips the ' +
        "module graph out of its pre-hydration state (see this harness' " +
        'contract in its doc block)'
    )
  }

  const { html, meta } = await commands.ssrRender(
    fixturesPath,
    exportName,
    navigator.userAgent
  )

  // like a real SSR page: the server-emitted <html> attributes and
  // <body> classes/attributes are in place before the client app
  // boots — the Dark plugin reads its state from the body classes
  // (not from the config) on ssr-client builds
  const htmlAttrs = parseAttrs(meta.htmlAttrs)
  const bodyAttrs = parseAttrs(meta.bodyAttrs)
  const previousBodyClassName = document.body.className
  const previousAttrs = [
    ...htmlAttrs.map(([name]) => [document.documentElement, name]),
    ...bodyAttrs.map(([name]) => [document.body, name])
  ].map(([el, name]) => [el, name, el.getAttribute(name)])

  document.body.className = meta.bodyClasses
  for (const [name, value] of htmlAttrs) {
    document.documentElement.setAttribute(name, value)
  }
  for (const [name, value] of bodyAttrs) {
    document.body.setAttribute(name, value)
  }

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

  // the client plugin installs must CONVERGE to the server-emitted
  // document state — a divergence is the FOUC class of SSR bug (wrong
  // body classes / html attributes until some later correction).
  // within-iframe is exempt BY DESIGN: the server can never know
  // iframe-ness (Platform's ssrClient pins it false) so the client
  // always corrects it — and the browser-mode runner puts every test
  // in an iframe, so it shows up here universally
  const expectedBodyClasses = sortedClasses(meta.bodyClasses)
  const actualBodyClasses = sortedClasses(
    document.body.className.replace(/\bwithin-iframe\b/, '')
  )
  if (actualBodyClasses !== expectedBodyClasses) {
    throw new Error(
      `the client-side body classes ("${actualBodyClasses}") diverge ` +
        `from the server-emitted ones ("${expectedBodyClasses}")`
    )
  }
  for (const [name, value] of htmlAttrs) {
    const actual = document.documentElement.getAttribute(name)
    if (actual !== value) {
      throw new Error(
        `the client-side <html> ${name} attribute ("${actual}") diverges ` +
          `from the server-emitted one ("${value}")`
      )
    }
  }

  mountedList.push({ app, host, previousBodyClassName, previousAttrs })

  return {
    host,
    vm,
    serverHtml,
    meta,
    consoleOutput,
    takeover: async () => {
      vm.$q.onSSRHydrated()
      await nextTick()
    }
  }
}

// "lang=he dir=rtl" / "data-server-rendered" -> [name, value] pairs
function parseAttrs(str) {
  if (str.length === 0) return []

  return str.split(/\s+/).map(pair => {
    const eq = pair.indexOf('=')
    return eq === -1
      ? [pair, '']
      : [pair.slice(0, eq), pair.slice(eq + 1).replaceAll('"', '')]
  })
}

function sortedClasses(className) {
  return className
    .split(/\s+/)
    .filter(cls => cls.length !== 0)
    .sort()
    .join(' ')
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
    for (const [el, name, value] of entries[0].previousAttrs) {
      if (value === null) el.removeAttribute(name)
      else el.setAttribute(name, value)
    }
  }
}
