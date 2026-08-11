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

import { getPackagePath } from './get-package-path.js'

const appViteDir = join(import.meta.dirname, '../..')

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-get-package-path-'))
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

// has an "exports" field which does NOT list ./data.json or ./package.json
installFakePackage(
  hostDir,
  'guarded-exports',
  { name: 'guarded-exports', version: '1.0.0', exports: { '.': './index.js' } },
  { 'index.js': '', 'data.json': '{ "hello": "world" }\n' }
)

describe('[get-package-path.js]', () => {
  test('resolves a package installed in the given folder', () => {
    const path = getPackagePath('kolorist', appViteDir)
    expect(path).toBeTypeOf('string')
    expect(dirname(path)).toContain('kolorist')
  })

  test('resolves package subpaths', () => {
    expect(getPackagePath('kolorist/package.json', appViteDir)).toBeTypeOf(
      'string'
    )
  })

  test('resolves a package from a controlled fixture folder', () => {
    expect(getPackagePath('fake-dep', hostDir)).toBe(
      join(hostDir, 'node_modules', 'fake-dep', 'index.js')
    )
  })

  test('falls back to node_modules lookup for files hidden by "exports"', () => {
    expect(getPackagePath('guarded-exports/data.json', hostDir)).toBe(
      join(hostDir, 'node_modules', 'guarded-exports', 'data.json')
    )
  })

  test('returns undefined for packages that cannot be resolved', () => {
    expect(getPackagePath('surely-not-installed-pkg', hostDir)).toBeUndefined()
  })
})
