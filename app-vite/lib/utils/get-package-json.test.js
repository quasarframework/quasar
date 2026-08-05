import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { getPackageJson } from './get-package-json.js'

const appViteDir = join(import.meta.dirname, '../..')

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-get-package-json-'))
)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

function installFakePackage(dir, name, pkgJson, files = {}) {
  const pkgDir = join(dir, 'node_modules', name)
  mkdirSync(pkgDir, { recursive: true })
  writeFileSync(join(pkgDir, 'package.json'), JSON.stringify(pkgJson))

  for (const [file, content] of Object.entries(files)) {
    const filePath = join(pkgDir, file)
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, content)
  }
}

const hostDir = join(rootDir, 'host-app')

installFakePackage(
  hostDir,
  'fake-dep',
  { name: 'fake-dep', version: '3.4.5', type: 'module', main: 'index.js' },
  { 'index.js': 'export const answer = 42\n' }
)

// has an "exports" field which does NOT list ./package.json
installFakePackage(
  hostDir,
  'guarded-exports',
  { name: 'guarded-exports', version: '1.0.0', exports: { '.': './index.js' } },
  { 'index.js': '' }
)

describe('[get-package-json.js]', () => {
  test('reads the package.json of a resolvable package', () => {
    const pkg = getPackageJson('kolorist', appViteDir)
    expect(pkg.name).toBe('kolorist')
    expect(pkg.version).toBeTypeOf('string')
  })

  test('reads a fixture package.json with a controlled version', () => {
    const pkg = getPackageJson('fake-dep', hostDir)
    expect(pkg).toEqual({
      name: 'fake-dep',
      version: '3.4.5',
      type: 'module',
      main: 'index.js'
    })
  })

  test('works even when "exports" does not list ./package.json', () => {
    const pkg = getPackageJson('guarded-exports', hostDir)
    expect(pkg.version).toBe('1.0.0')
  })

  test('returns undefined for packages that cannot be resolved', () => {
    expect(getPackageJson('surely-not-installed-pkg', hostDir)).toBeUndefined()
  })
})
