import { afterEach, describe, expect, test, vi } from 'vitest'

import { displayBanner, getPackager, printDevRunningBanner } from './banner.js'
import { cliPkg } from './cli-runtime.js'

// colors depend on the environment, so strip them before asserting
const ESC = String.fromCodePoint(27)
const ansiRE = new RegExp(`${ESC}\\[[0-9;]*m`, 'g')

function captureOutput() {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  return () =>
    logSpy.mock.calls
      .map(args => args.join(' '))
      .join('\n')
      .replace(ansiRE, '')
}

function makeCtx(overrides = {}) {
  return {
    pkg: {
      quasarPkg: { version: '2.99.0' },
      vitePkg: { version: '7.7.7' }
    },
    ...overrides
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('[banner.js]', () => {
  describe('getPackager()', () => {
    test('prefers the IDE when requested or required', () => {
      expect(getPackager({ ide: true, mode: 'electron' }, 'build')).toBe(
        'IDE (manual)'
      )
      expect(getPackager({ mode: 'capacitor' }, 'dev')).toBe('IDE (manual)')
      expect(getPackager({ mode: 'cordova' }, 'dev')).toBe('IDE (manual)')
    })

    test('picks the mode/target specific packager', () => {
      expect(getPackager({ mode: 'cordova' }, 'build')).toBe('cordova')
      expect(getPackager({ mode: 'capacitor', target: 'ios' }, 'build')).toBe(
        'xcodebuild'
      )
      expect(
        getPackager({ mode: 'capacitor', target: 'android' }, 'build')
      ).toBe('gradle')
    })
  })

  describe('displayBanner()', () => {
    test('renders the dev banner', async () => {
      const getOutput = captureOutput()

      await displayBanner({ argv: { mode: 'spa' }, ctx: makeCtx(), cmd: 'dev' })

      const output = getOutput()
      expect(output).toContain('Dev mode............... SPA')
      expect(output).toContain('Pkg quasar............. v2.99.0')
      expect(output).toContain(`Pkg @quasar/app-vite... v${cliPkg.version}`)
      expect(output).toContain('Pkg vite............... v7.7.7')
      expect(output).toContain('Debugging.............. enabled')
      expect(output).not.toContain('Build succeeded')
    })

    test('renders the build banner with targets and output folder', async () => {
      const getOutput = captureOutput()

      await displayBanner({
        argv: { mode: 'spa' },
        ctx: makeCtx(),
        cmd: 'build',
        details: {
          buildOutputFolder: '/project/dist/spa',
          target: { browser: ['es2022', 'firefox115'] }
        }
      })

      const output = getOutput()
      expect(output).toContain('Build succeeded')
      expect(output).toContain('Build mode............. SPA')
      expect(output).toContain('Debugging.............. no')
      expect(output).toContain('Browser target......... es2022|firefox115')
      expect(output).not.toContain('Node target')
      expect(output).toContain('Output folder.......... /project/dist/spa')
      expect(output).toContain('quasar serve')
    })

    test('renders the SSR tips using the project package manager', async () => {
      const getOutput = captureOutput()
      const ctx = makeCtx({
        cacheProxy: {
          getModule: moduleName =>
            Promise.resolve(
              moduleName === 'nodePackager' ? { name: 'pnpm' } : void 0
            )
        }
      })

      await displayBanner({
        argv: { mode: 'ssr' },
        ctx,
        cmd: 'build',
        details: {
          buildOutputFolder: '/project/dist/ssr',
          target: { browser: ['es2022'], node: ['node20'] }
        }
      })

      const output = getOutput()
      expect(output).toContain('Node target............ node20')
      expect(output).toContain('"pnpm install"')
      expect(output).toContain('"pnpm start"')
    })

    test('the SSR "start" tip accounts for npm', async () => {
      const getOutput = captureOutput()
      const ctx = makeCtx({
        cacheProxy: { getModule: () => Promise.resolve({ name: 'npm' }) }
      })

      await displayBanner({
        argv: { mode: 'ssr' },
        ctx,
        cmd: 'build',
        details: { buildOutputFolder: '/project/dist/ssr' }
      })

      const output = getOutput()
      expect(output).toContain('"npm install"')
      expect(output).toContain('"npm run start"')
    })

    test('renders the capacitor packaging mode and CLI tip', async () => {
      const getOutput = captureOutput()
      const ctx = makeCtx({
        cacheProxy: { getModule: () => Promise.resolve({ name: 'npm' }) }
      })

      await displayBanner({
        argv: { mode: 'capacitor', target: 'android', 'skip-pkg': true },
        ctx,
        cmd: 'build',
        details: { buildOutputFolder: '/project/dist/capacitor' }
      })

      const output = getOutput()
      expect(output).toContain('Packaging mode......... skip')
      // skip-pkg also skips the output folder section
      expect(output).not.toContain('Output folder')
      expect(output).toContain('"npx capacitor <params>"')
    })

    test('renders the cordova running mode on dev', async () => {
      const getOutput = captureOutput()

      await displayBanner({
        argv: { mode: 'cordova' },
        ctx: makeCtx(),
        cmd: 'dev'
      })

      expect(getOutput()).toContain('Running mode........... IDE (manual)')
    })
  })

  describe('printDevRunningBanner()', () => {
    test('renders the SPA dev banner', () => {
      const getOutput = captureOutput()

      printDevRunningBanner({
        ctx: {
          appPaths: { appDir: '/project' },
          mode: {},
          modeName: 'spa',
          pkg: { quasarPkg: { version: '2.99.0' } }
        },
        devServer: { host: 'localhost' },
        metaConf: { APP_URL: 'http://localhost:9100/' },
        build: { target: { browser: ['es2022'] } }
      })

      const output = getOutput()
      expect(output).toContain('App dir................ /project')
      expect(output).toContain('App URL................ http://localhost:9100/')
      expect(output).toContain('Dev mode............... SPA')
      expect(output).toContain('Pkg quasar............. v2.99.0')
      expect(output).toContain(`Pkg @quasar/app-vite... v${cliPkg.version}`)
      expect(output).toContain('Browser target......... es2022')
      expect(output).not.toContain('Node target')
    })

    test('flags the PWA takeover and the node target for SSR', () => {
      const getOutput = captureOutput()

      printDevRunningBanner({
        ctx: {
          appPaths: { appDir: '/project' },
          mode: { ssr: true, pwa: true },
          modeName: 'ssr',
          pkg: { quasarPkg: { version: '2.99.0' } }
        },
        devServer: { host: 'localhost' },
        metaConf: { APP_URL: 'http://localhost:9100/' },
        build: { target: { browser: ['es2022'], node: ['node20'] } }
      })

      const output = getOutput()
      expect(output).toContain('Dev mode............... SSR + PWA')
      expect(output).toContain('Node target............ node20')
    })

    test.each([
      ['chrome', 'Chrome', '/project/dist/bex'],
      ['firefox', 'Firefox', '/project/dist/bex/manifest.json']
    ])(
      'points the %s BEX target to its dev extension location',
      (targetName, label, folder) => {
        const getOutput = captureOutput()

        printDevRunningBanner({
          ctx: {
            appPaths: { appDir: '/project' },
            mode: { bex: true },
            modeName: 'bex',
            targetName,
            pkg: { quasarPkg: { version: '2.99.0' } }
          },
          devServer: { host: 'localhost' },
          metaConf: { APP_URL: 'http://localhost:9100/' },
          build: {
            target: { browser: ['es2022'] },
            distDir: '/project/dist/bex'
          }
        })

        const output = getOutput()
        expect(output).toContain(`Load the dev extension in ${label} from:`)
        expect(output).toContain(folder)
        // BEX has no dev server URL to expose
        expect(output).not.toContain('App URL')
      }
    )
  })
})
