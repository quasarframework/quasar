import { describe, expect, test } from 'vitest'
import { quasar } from '../../../src/index'

describe('quasar plugin', () => {
  test('should return default plugins', () => {
    const plugins = quasar()
    expect(plugins.length).toBe(3)

    expect(plugins[0].name).toBe('vite:quasar:vite-conf')
    expect(plugins[1].name).toBe('vite:quasar:scss')
    expect(plugins[2].name).toBe('vite:quasar:script')
  })

  describe('vite:quasar:vite-conf', () => {
    test('should throw an error if not added after Vite Vue plugin', () => {
      const [viteConfPlugin] = quasar()

      const configResolved = viteConfPlugin.configResolved
      if (typeof configResolved !== 'function') {
        throw new TypeError(
          'configResolved hook is not a function. Adjust the test code accordingly'
        )
      }

      expect(() =>
        configResolved.call(viteConfPlugin, { plugins: [] })
      ).toThrow('after ** the Vue one')
    })

    test('should not throw an error if added after Vite Vue plugin', () => {
      const [viteConfPlugin] = quasar()

      const configResolved = viteConfPlugin.configResolved
      if (typeof configResolved !== 'function') {
        throw new TypeError(
          'configResolved hook is not a function. Adjust the test code accordingly'
        )
      }

      expect(() =>
        configResolved.call(viteConfPlugin, { plugins: [{ name: 'vite:vue' }] })
      ).not.toThrow()
    })
  })

  describe('framework css alias', () => {
    const cssAlias = 'quasar/dist/quasar.css'

    const getAliasList = (
      pluginOpts = {},
      userCfg = {},
      mode = 'production'
    ) => {
      const [viteConfPlugin] = quasar(pluginOpts)
      return viteConfPlugin.config(userCfg, { mode }).resolve?.alias ?? []
    }

    const hasCssAlias = list =>
      list.some(entry => entry.replacement === cssAlias)

    test('aliases index.sass to the prebuilt css without a custom variables file', () => {
      expect(hasCssAlias(getAliasList({}))).toBe(true)
      expect(hasCssAlias(getAliasList({ sassVariables: false }))).toBe(true)
      // in dev mode too, alongside the dev bundle alias
      expect(hasCssAlias(getAliasList({}, {}, 'development'))).toBe(true)
    })

    test('keeps compiling from source with a custom variables file', () => {
      expect(hasCssAlias(getAliasList({ sassVariables: 'src/my.sass' }))).toBe(
        false
      )
    })

    test('keeps compiling from source when the user injects additionalData', () => {
      for (const lang of ['sass', 'scss']) {
        const userCfg = {
          css: { preprocessorOptions: { [lang]: { additionalData: '$x: 1' } } }
        }
        expect(hasCssAlias(getAliasList({}, userCfg))).toBe(false)
      }
    })

    test('keeps compiling from source when the user aliases the quasar package', () => {
      // object form (e.g. the quasar monorepo's own ui test suite)
      expect(
        hasCssAlias(
          getAliasList({}, { resolve: { alias: { quasar: '/repo/ui' } } })
        )
      ).toBe(false)

      // array form with a string find
      expect(
        hasCssAlias(
          getAliasList(
            {},
            {
              resolve: { alias: [{ find: 'quasar', replacement: '/repo/ui' }] }
            }
          )
        )
      ).toBe(false)

      // array form with a regex find
      expect(
        hasCssAlias(
          getAliasList(
            {},
            {
              resolve: {
                alias: [{ find: /^quasar\//, replacement: '/repo/ui/' }]
              }
            }
          )
        )
      ).toBe(false)

      // unrelated aliases do not disable it
      expect(
        hasCssAlias(
          getAliasList({}, { resolve: { alias: { '@': '/app/src' } } })
        )
      ).toBe(true)
    })

    test('the alias matches only the exact framework css specifier', () => {
      const entry = getAliasList({}).find(e => e.replacement === cssAlias)

      expect(entry.find.test('quasar/src/css/index.sass')).toBe(true)
      expect(entry.find.test('quasar/src/css/flex-addon.sass')).toBe(false)
      expect(entry.find.test('quasar/src/css/index.sass.bak')).toBe(false)
    })
  })

  describe('vite:quasar:scss', () => {
    test('should be enabled if sassVariables is true', () => {
      const plugins = quasar({ sassVariables: true })
      const scssPlugin = plugins.find(({ name }) => name === 'vite:quasar:scss')
      expect(scssPlugin).toBeDefined()
    })

    test('should be enabled if sassVariables is a path', () => {
      const plugins = quasar({ sassVariables: 'some/path.scss' })
      const scssPlugin = plugins.find(({ name }) => name === 'vite:quasar:scss')
      expect(scssPlugin).toBeDefined()
    })

    test('should be disabled if sassVariables is false ', () => {
      const plugins = quasar({ sassVariables: false })
      const scssPlugin = plugins.find(({ name }) => name === 'vite:quasar:scss')
      expect(scssPlugin).toBeUndefined()
    })
  })

  describe('vite:quasar:script', () => {
    test.each(['web-client', 'ssr-client'])(
      'should be enabled if runMode is %s',
      runMode => {
        const plugins = quasar({ runMode })
        const scriptPlugin = plugins.find(
          ({ name }) => name === 'vite:quasar:script'
        )
        expect(scriptPlugin).toBeDefined()
      }
    )

    test('should be disabled if runMode is ssr-server', () => {
      const plugins = quasar({ runMode: 'ssr-server' })
      const scriptPlugin = plugins.find(
        ({ name }) => name === 'vite:quasar:script'
      )
      expect(scriptPlugin).toBeUndefined()
    })

    test('should not map Quasar imports if devTreeshaking is disabled and the config is not production-flavored', () => {
      const plugins = quasar({ devTreeshaking: false })
      const scriptPlugin = plugins.find(
        ({ name }) => name === 'vite:quasar:script'
      )
      // matches a vitest run: NODE_ENV "test" regardless of Vite mode
      scriptPlugin.configResolved({ mode: 'test', isProduction: false })

      // the transform hook is object-form (with filters)
      const transform = scriptPlugin.transform.handler

      const code = "import {QBtn} from 'quasar'"
      const scriptTransformed = transform(code, 'test.js')
      const templateTransformed = transform(code, 'test.vue')

      expect(templateTransformed).toMatchObject({
        code: "import {QBtn} from 'quasar';"
      })
      expect(scriptTransformed).toBeNull()
    })

    test('should map Quasar imports on production builds regardless of the mode name', () => {
      const plugins = quasar({ devTreeshaking: false })
      const scriptPlugin = plugins.find(
        ({ name }) => name === 'vite:quasar:script'
      )
      // matches "vite build --mode qa": NODE_ENV stays "production"
      scriptPlugin.configResolved({ mode: 'qa', isProduction: true })

      const transform = scriptPlugin.transform.handler
      const result = transform("import {QBtn} from 'quasar'", 'test.js')

      expect(result.code).toContain(
        "import QBtn from 'quasar/src/components/btn/QBtn.js'"
      )
      expect(result.code).not.toContain("from 'quasar'")
    })
  })
})
