import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test, vi } from 'vitest'

const originalCwd = process.cwd()
const rootDir = mkdtempSync(join(tmpdir(), 'quasar-cli-packager-'))

function makeProjectDir(name, lockFile) {
  const dir = join(rootDir, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'quasar.config.js'), 'export default {}')
  if (lockFile) writeFileSync(join(dir, lockFile), '')
  return dir
}

// the module resolves the project's package manager at import time,
// so it must be imported from within a project folder
const pnpmProjectDir = makeProjectDir('pnpm-project', 'pnpm-lock.yaml')
process.chdir(pnpmProjectDir)
const { getNodePackager, nodePackager } =
  await import('../../lib/node-packager.js')
process.chdir(originalCwd)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

describe('[node-packager.js]', () => {
  describe('getNodePackager()', () => {
    test('picks the package manager matching the project lock file', () => {
      expect(nodePackager.name).toBe('pnpm')
      expect(
        getNodePackager(makeProjectDir('npm-project', 'package-lock.json')).name
      ).toBe('npm')
    })

    test('detects the lock file in an ancestor directory', () => {
      const projectDir = makeProjectDir('ancestor', 'package-lock.json')
      const nested = join(projectDir, 'src', 'components')
      mkdirSync(nested, { recursive: true })

      expect(getNodePackager(nested).name).toBe('npm')
    })

    test('falls back to an installed package manager without a lock file', () => {
      const pm = getNodePackager(makeProjectDir('lockless'))
      expect(['yarn', 'pnpm', 'npm', 'bun']).toContain(pm.name)
    })

    test('works without a project folder at all', () => {
      const pm = getNodePackager(void 0)
      expect(['yarn', 'pnpm', 'npm', 'bun']).toContain(pm.name)
    })
  })

  describe('install params', () => {
    const pnpm = nodePackager
    const npm = getNodePackager(
      makeProjectDir('npm-params', 'package-lock.json')
    )

    test('build the package manager specific install arguments', () => {
      expect(pnpm.getInstallParams('development')).toEqual(['install'])
      expect(pnpm.getInstallParams('production')).toEqual(['install', '--prod'])
      expect(npm.getInstallParams('development')).toEqual(['install'])
    })

    test('build the add/remove package arguments', () => {
      expect(pnpm.getInstallPackageParams(['quasar'], false)).toEqual([
        'add',
        '',
        'quasar'
      ])
      expect(pnpm.getInstallPackageParams(['quasar'], true)).toEqual([
        'add',
        '--save-dev',
        'quasar'
      ])
      expect(pnpm.getUninstallPackageParams(['quasar'])).toEqual([
        'remove',
        'quasar'
      ])

      expect(npm.getInstallPackageParams(['quasar'], true)).toEqual([
        'install',
        '--save-dev',
        'quasar'
      ])
      expect(npm.getUninstallPackageParams(['quasar'])).toEqual([
        'uninstall',
        'quasar'
      ])
    })
  })

  describe('getPackageLatestVersion()', () => {
    const registryUrl = 'https://registry.example.org/'

    function mockRegistry(versions) {
      vi.stubGlobal(
        'fetch',
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                versions: Object.fromEntries(versions.map(v => [v, {}]))
              })
          })
        )
      )
    }

    afterAll(() => {
      vi.unstubAllGlobals()
    })

    test('returns the latest version matching the current major', async () => {
      mockRegistry(['2.0.0', '2.1.0', '2.2.0-beta.1', '3.0.0'])

      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl,
          currentVersion: '2.0.0'
        })
      ).toBe('2.1.0')
    })

    test('includes newer majors when majorVersion is set', async () => {
      mockRegistry(['2.0.0', '2.1.0', '3.0.0'])

      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl,
          currentVersion: '2.0.0',
          majorVersion: true
        })
      ).toBe('3.0.0')
    })

    test('includes pre-releases when preReleaseVersion is set', async () => {
      mockRegistry(['2.0.0', '2.1.0', '2.2.0-beta.1'])

      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl,
          currentVersion: '2.0.0',
          preReleaseVersion: true
        })
      ).toBe('2.2.0-beta.1')
    })

    test('returns the very latest version without a currentVersion', async () => {
      mockRegistry(['1.0.0', '2.5.0', '3.0.0-alpha.1'])

      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl
        })
      ).toBe('3.0.0-alpha.1')
    })

    test('picks the highest version, not the last published one', async () => {
      // the registry lists versions in publish order; a patch for an
      // older minor version can get released after a newer minor version
      mockRegistry(['2.0.0', '2.9.0', '2.10.0', '2.9.5'])

      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl,
          currentVersion: '2.0.0'
        })
      ).toBe('2.10.0')

      mockRegistry(['1.0.0', '2.1.0', '1.5.0'])
      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl
        })
      ).toBe('2.1.0')
    })

    test('prefers a stable release over its own pre-releases', async () => {
      mockRegistry(['2.0.0', '2.1.0-beta.2', '2.1.0', '2.1.0-beta.1'])

      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl,
          currentVersion: '2.0.0',
          preReleaseVersion: true
        })
      ).toBe('2.1.0')
    })

    test('orders pre-releases numerically', async () => {
      mockRegistry(['2.1.0-beta.2', '2.1.0-beta.10', '2.1.0-beta.9'])

      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl,
          currentVersion: '2.0.0',
          preReleaseVersion: true
        })
      ).toBe('2.1.0-beta.10')
    })

    test('returns null on registry errors or invalid input', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() => Promise.resolve({ ok: false }))
      )
      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl
        })
      ).toBeNull()

      mockRegistry(['2.0.0'])
      expect(
        await nodePackager.getPackageLatestVersion({
          packageName: 'quasar',
          npmRegistryUrl: registryUrl,
          currentVersion: 'not-a-version'
        })
      ).toBeNull()
    })
  })
})
