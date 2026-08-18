import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { getModeDepsAliases } from './config-tools.js'

// minimal stand-in for a real Quasar app dir; isModeInstalled() checks
// appPaths.capacitorDir on disk, so the fixture creates/omits it for real
const appDir = mkdtempSync(join(tmpdir(), 'qav-config-tools-'))
const appPaths = {
  capacitorDir: join(appDir, 'src-capacitor'),
  resolve: { app: dir => join(appDir, dir) }
}

afterAll(() => {
  rmSync(appDir, { recursive: true, force: true })
})

describe('[config-tools.js] getModeDepsAliases()', () => {
  test('returns no aliases without installed modes or modeDeps', () => {
    expect(getModeDepsAliases(appPaths, { capacitorPkg: {} }, null)).toEqual({})
  })

  test('aliases explicit modeDeps into their src-<mode> folder', () => {
    const aliases = getModeDepsAliases(appPaths, { capacitorPkg: {} }, [
      { dir: 'src-pwa', deps: { 'register-service-worker': '^1.0.0' } },
      { dir: 'src-anything', deps: void 0 } // deps not installed yet
    ])

    expect(aliases).toEqual({
      'register-service-worker': join(
        appDir,
        'src-pwa/node_modules/register-service-worker'
      )
    })
  })

  describe('with Capacitor mode installed', () => {
    const capacitorPkg = {
      dependencies: {
        '@capacitor/app': '^8.0.0',
        '@capacitor/cli': '^8.0.0',
        '@capacitor/core': '^8.0.0'
      }
    }

    beforeAll(() => {
      mkdirSync(appPaths.capacitorDir)
    })

    test('aliases Capacitor deps no matter the mode being built', () => {
      // no modeDeps, like any non-Capacitor mode (SPA, SSR, ...) #17681
      const aliases = getModeDepsAliases(appPaths, { capacitorPkg }, null)

      expect(aliases).toEqual({
        '@capacitor/app': join(
          appDir,
          'src-capacitor/node_modules/@capacitor/app'
        ),
        '@capacitor/cli': join(
          appDir,
          'src-capacitor/node_modules/@capacitor/cli'
        ),
        '@capacitor/core': join(
          appDir,
          'src-capacitor/node_modules/@capacitor/core'
        )
      })
    })

    test("a mode's own deps win on a name clash", () => {
      const aliases = getModeDepsAliases(appPaths, { capacitorPkg }, [
        { dir: 'src-pwa', deps: { '@capacitor/app': '^8.0.0' } }
      ])

      expect(aliases['@capacitor/app']).toBe(
        join(appDir, 'src-pwa/node_modules/@capacitor/app')
      )
    })

    test('handles a not-yet-populated src-capacitor/package.json', () => {
      // ctx.pkg.capacitorPkg getter yields {} when the file is missing
      expect(getModeDepsAliases(appPaths, { capacitorPkg: {} }, null)).toEqual(
        {}
      )
    })
  })
})
