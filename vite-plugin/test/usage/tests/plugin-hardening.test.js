import { describe, expect, test, vi } from 'vitest'

import { quasar } from '../../../src/index'

function getPlugin(name, pluginOpts) {
  return quasar(pluginOpts).find(entry => entry.name === name)
}

/**
 * Mirrors the semantics of Vite's transform hook filters:
 * the id must match at least one include pattern and no exclude
 * pattern; when a code filter exists, the code must match it too.
 */
function passesFilter(filter, id, code) {
  const toList = value => (Array.isArray(value) ? value : [value])
  const include = toList(filter.id.include ?? filter.id)
  const exclude = toList(filter.id.exclude ?? [])

  if (exclude.some(regex => regex.test(id))) return false
  if (!include.some(regex => regex.test(id))) return false

  return filter.code === void 0 || filter.code.test(code)
}

describe('hook filters never exclude what the handlers transform', () => {
  const scssPlugin = getPlugin('vite:quasar:scss')

  const scriptPlugin = getPlugin('vite:quasar:script')
  scriptPlugin.configResolved({ isProduction: true })

  const scssContent = '.foo { color: $primary; }'
  const scriptContent = "import { QBtn } from 'quasar'"
  const templateContent =
    "import { QBtn } from 'quasar';" +
    'const _component_q_icon = _resolveComponent("q-icon");'

  test.each([
    ['plain scss file', '/src/app.scss', scssContent],
    ['plain sass file', '/src/app.sass', scssContent],
    ['css module file', '/src/app.module.scss', scssContent],
    ['scss file with HMR query', '/src/app.scss?t=1712345678', scssContent],
    [
      'SFC style block',
      '/src/App.vue?vue&type=style&index=0&scoped=7a7a37b1&lang.sass',
      scssContent
    ],
    [
      'scoped css module SFC style block',
      '/src/App.vue?vue&type=style&index=0&module=1&lang.scss',
      scssContent
    ]
  ])('scss plugin: %s', (_, id, code) => {
    const result = scssPlugin.transform.handler(code, id)

    expect(result).not.toBeNull()
    expect(passesFilter(scssPlugin.transform.filter, id, code)).toBe(true)
  })

  test.each([
    ['SFC main module', '/src/App.vue', templateContent],
    [
      'SFC script sub-request (prod ts)',
      '/src/App.vue?vue&type=script&lang.ts',
      templateContent
    ],
    ['plain js file', '/src/util.js', scriptContent],
    ['js file with HMR query', '/src/util.js?t=1712345678', scriptContent],
    ['ts file', '/src/util.ts', scriptContent],
    ['tsx file', '/src/util.tsx', scriptContent]
  ])('script plugin: %s', (_, id, code) => {
    const result = scriptPlugin.transform.handler(code, id)

    expect(result).not.toBeNull()
    expect(passesFilter(scriptPlugin.transform.filter, id, code)).toBe(true)
  })
})

describe('?raw requests pass through untouched', () => {
  test('scss plugin leaves raw imports alone', () => {
    const scssPlugin = getPlugin('vite:quasar:scss')
    const id = '/src/app.sass?raw'

    expect(scssPlugin.transform.handler('.foo { color: $primary; }', id)).toBe(
      null
    )
    expect(
      passesFilter(scssPlugin.transform.filter, id, '.foo { color: red; }')
    ).toBe(false)
  })

  test('script plugin leaves raw imports alone', () => {
    const scriptPlugin = getPlugin('vite:quasar:script')
    scriptPlugin.configResolved({ isProduction: true })
    const id = '/src/App.vue?raw'

    expect(
      scriptPlugin.transform.handler("import { QBtn } from 'quasar'", id)
    ).toBe(null)
  })
})

describe('run mode build flags', () => {
  const getDefine = (runMode, externalCfg = {}) => {
    const [viteConfPlugin] = quasar({ runMode })
    return viteConfPlugin.config(externalCfg, { command: 'build' }).define
  }

  test('web-client', () => {
    expect(getDefine('web-client')).toMatchObject({
      __QUASAR_SSR__: false,
      __QUASAR_SSR_SERVER__: false,
      __QUASAR_SSR_CLIENT__: false,
      __QUASAR_SSR_PWA__: false
    })
  })

  test('ssr-client', () => {
    expect(getDefine('ssr-client')).toMatchObject({
      __QUASAR_SSR__: true,
      __QUASAR_SSR_SERVER__: false,
      __QUASAR_SSR_CLIENT__: true
    })
  })

  test('ssr-server', () => {
    expect(getDefine('ssr-server')).toMatchObject({
      __QUASAR_SSR__: true,
      __QUASAR_SSR_SERVER__: true,
      __QUASAR_SSR_CLIENT__: false
    })
  })

  test('a PWA flag configured by @quasar/app-vite is left alone', () => {
    const define = getDefine('web-client', {
      define: { __QUASAR_SSR_PWA__: true }
    })
    expect(define.__QUASAR_SSR_PWA__).toBe(void 0)
  })
})

describe('residual import warning', () => {
  test('warns once per file for untransformable quasar imports', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const scriptPlugin = getPlugin('vite:quasar:script')
    scriptPlugin.configResolved({ isProduction: true })

    const code = "export * from 'quasar'"
    scriptPlugin.transform.handler(code, '/src/reexport.js')
    scriptPlugin.transform.handler(code, '/src/reexport.js')

    expect(consoleWarn).toHaveBeenCalledOnce()
    expect(consoleWarn.mock.calls[0][0]).toContain('reexport.js')

    vi.restoreAllMocks()
  })

  test('does not warn for fully transformed imports', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const scriptPlugin = getPlugin('vite:quasar:script')
    scriptPlugin.configResolved({ isProduction: true })

    scriptPlugin.transform.handler(
      "import { QBtn } from 'quasar'",
      '/src/clean.js'
    )

    expect(consoleWarn).not.toHaveBeenCalled()

    vi.restoreAllMocks()
  })
})
