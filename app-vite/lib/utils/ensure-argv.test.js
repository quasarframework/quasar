import { afterEach, describe, expect, test, vi } from 'vitest'

import { ensureArgv, ensureElectronArgv } from './ensure-argv.js'

vi.mock('./logger.js', () => ({
  fatal: vi.fn(msg => {
    throw new Error(`FATAL: ${msg}`)
  })
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('[ensure-argv.js]', () => {
  describe('ensureArgv()', () => {
    test('accepts every standalone mode', () => {
      for (const mode of ['spa', 'pwa', 'electron', 'ssr', 'ssg']) {
        expect(() => ensureArgv({ mode }, 'dev')).not.toThrow()
      }
    })

    test('converts the "ios" mode shorthand to capacitor + target', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const argv = { mode: 'ios' }

      ensureArgv(argv, 'dev')

      expect(argv.m).toBe('capacitor')
      expect(argv.mode).toBe('capacitor')
      expect(argv.T).toBe('ios')
      expect(argv.target).toBe('ios')

      logSpy.mockRestore()
    })

    test('converts the "android" mode shorthand to capacitor + target', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const argv = { mode: 'android' }

      ensureArgv(argv, 'dev')

      expect(argv.m).toBe('capacitor')
      expect(argv.mode).toBe('capacitor')
      expect(argv.T).toBe('android')
      expect(argv.target).toBe('android')

      logSpy.mockRestore()
    })

    test('fails on an unknown or missing mode', () => {
      expect(() => ensureArgv({ mode: 'desktop' }, 'dev')).toThrow(
        'FATAL: Unknown mode "desktop"'
      )
      expect(() => ensureArgv({}, 'dev')).toThrow('FATAL: Unknown mode')
    })

    test('requires a target for capacitor', () => {
      expect(() => ensureArgv({ mode: 'capacitor' }, 'dev')).toThrow(
        /FATAL: Please also specify a target/
      )
    })

    test('rejects an unknown capacitor target', () => {
      expect(() =>
        ensureArgv({ mode: 'capacitor', target: 'linux' }, 'dev')
      ).toThrow('FATAL: Unknown target "linux" for Capacitor')
    })

    test('accepts the valid capacitor targets', () => {
      for (const target of ['android', 'ios']) {
        expect(() =>
          ensureArgv({ mode: 'capacitor', target }, 'dev')
        ).not.toThrow()
      }
    })

    test('requires a target for cordova', () => {
      expect(() => ensureArgv({ mode: 'cordova' }, 'dev')).toThrow(
        /FATAL: Please also specify a target/
      )
    })

    test('rejects an unknown cordova target', () => {
      expect(() =>
        ensureArgv({ mode: 'cordova', target: 'fridge' }, 'dev')
      ).toThrow(/FATAL: Unknown target "fridge" for Cordova/)
    })

    test('accepts the valid cordova targets', () => {
      for (const target of ['android', 'ios', 'browser', 'electron']) {
        expect(() =>
          ensureArgv({ mode: 'cordova', target }, 'dev')
        ).not.toThrow()
      }
    })

    test('defaults the bex target to chrome', () => {
      const argv = { mode: 'bex' }

      ensureArgv(argv, 'dev')

      expect(argv.target).toBe('chrome')
    })

    test('keeps an explicitly valid bex target', () => {
      const argv = { mode: 'bex', target: 'firefox' }

      ensureArgv(argv, 'dev')

      expect(argv.target).toBe('firefox')
    })

    test('rejects an unknown bex target', () => {
      expect(() =>
        ensureArgv({ mode: 'bex', target: 'safari' }, 'dev')
      ).toThrow('FATAL: Unknown target "safari" for BEX')
    })

    test('skips target validation for the "inspect" command', () => {
      const argv = { mode: 'capacitor' }

      expect(() => ensureArgv(argv, 'inspect')).not.toThrow()
      expect(argv.target).toBeUndefined()

      // ...but the mode itself is still validated
      expect(() => ensureArgv({ mode: 'nope' }, 'inspect')).toThrow(
        'FATAL: Unknown mode "nope"'
      )
    })

    test('validates the electron bundler on "build" only', () => {
      expect(() =>
        ensureArgv({ mode: 'electron', bundler: 'webpack' }, 'build')
      ).toThrow('FATAL: Unknown bundler "webpack" for Electron')

      for (const bundler of [void 0, 'packager', 'builder']) {
        expect(() =>
          ensureArgv({ mode: 'electron', bundler }, 'build')
        ).not.toThrow()
      }

      // other commands do not care about the bundler
      expect(() =>
        ensureArgv({ mode: 'electron', bundler: 'webpack' }, 'dev')
      ).not.toThrow()
    })
  })

  describe('ensureElectronArgv()', () => {
    test('rejects an unknown bundler', () => {
      expect(() => ensureElectronArgv('webpack', {})).toThrow(
        'FATAL: Unknown bundler "webpack" for Electron'
      )
    })

    test('accepts the valid packager target + arch matrix', () => {
      for (const targetName of [
        void 0,
        'all',
        'darwin',
        'win32',
        'linux',
        'mas'
      ]) {
        for (const archName of [
          void 0,
          'ia32',
          'x64',
          'armv7l',
          'arm64',
          'mips64el',
          'all'
        ]) {
          expect(() =>
            ensureElectronArgv('packager', { targetName, archName })
          ).not.toThrow()
        }
      }
    })

    test('rejects invalid packager targets and architectures', () => {
      // "win"/"mac" are electron-builder aliases; @electron/packager rejects them
      expect(() =>
        ensureElectronArgv('packager', { targetName: 'win' })
      ).toThrow('FATAL: Unknown target "win" for @electron/packager')

      expect(() =>
        ensureElectronArgv('packager', {
          targetName: 'darwin',
          archName: 'mips'
        })
      ).toThrow('FATAL: Unknown architecture "mips" for @electron/packager')
    })

    test('accepts the valid builder target + arch matrix', () => {
      for (const targetName of [
        void 0,
        'all',
        'darwin',
        'win32',
        'linux',
        'win',
        'mac'
      ]) {
        for (const archName of [
          void 0,
          'ia32',
          'x64',
          'armv7l',
          'arm64',
          'all'
        ]) {
          expect(() =>
            ensureElectronArgv('builder', { targetName, archName })
          ).not.toThrow()
        }
      }
    })

    test('rejects invalid builder targets and architectures', () => {
      // "mas" and "mips64el" are packager-only values
      expect(() =>
        ensureElectronArgv('builder', { targetName: 'mas' })
      ).toThrow('FATAL: Unknown target "mas" for electron-builder')

      expect(() =>
        ensureElectronArgv('builder', {
          targetName: 'linux',
          archName: 'mips64el'
        })
      ).toThrow('FATAL: Unknown architecture "mips64el" for electron-builder')
    })
  })
})
