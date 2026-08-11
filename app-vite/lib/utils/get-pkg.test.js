import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { getPkg } from './get-pkg.js'

const appViteDir = join(import.meta.dirname, '../..')

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-get-pkg-')))

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

describe('[get-pkg.js]', () => {
  const appDir = join(rootDir, 'pkg-app')
  mkdirSync(join(appDir, 'src-ssr'), { recursive: true })
  writeFileSync(
    join(appDir, 'package.json'),
    JSON.stringify({ name: 'test-app', version: '1.0.0' })
  )
  writeFileSync(
    join(appDir, 'src-ssr', 'package.json'),
    JSON.stringify({ name: 'test-app-ssr' })
  )

  // fake quasar package installed in the app dir
  const quasarPkgDir = join(appDir, 'node_modules', 'quasar')
  mkdirSync(quasarPkgDir, { recursive: true })
  writeFileSync(
    join(quasarPkgDir, 'package.json'),
    JSON.stringify({ name: 'quasar', version: '2.99.0' })
  )

  const appPaths = {
    appDir,
    cliDir: appViteDir,
    resolve: { app: p => join(appDir, p) }
  }

  const pkg = getPkg(appPaths)

  test('resolves quasarPkg from the app dir', () => {
    expect(pkg.quasarPkg.version).toBe('2.99.0')
  })

  test('falls back to the CLI dir for vitePkg', () => {
    // the temp app dir has no vite installed
    expect(pkg.vitePkg.name).toBe('vite')
  })

  test('appPkg reads the app package.json', () => {
    expect(pkg.appPkg.name).toBe('test-app')
    expect(pkg.appPkg.version).toBe('1.0.0')
  })

  test('appPkg is a live getter reflecting file updates', async () => {
    // make sure mtime has a chance to differ
    await new Promise(resolve => {
      setTimeout(resolve, 10)
    })

    writeFileSync(
      join(appDir, 'package.json'),
      JSON.stringify({ name: 'test-app', version: '2.0.0' })
    )

    expect(pkg.appPkg.version).toBe('2.0.0')
  })

  test('mode pkg getters read src-<mode>/package.json', () => {
    expect(pkg.ssrPkg.name).toBe('test-app-ssr')
  })

  test('missing mode packages yield an empty object', () => {
    expect(pkg.bexPkg).toEqual({})
  })

  test('a missing app package.json yields an empty object', () => {
    const emptyDir = join(rootDir, 'empty-app')
    mkdirSync(emptyDir, { recursive: true })

    const emptyPkg = getPkg({
      appDir: emptyDir,
      cliDir: appViteDir,
      resolve: { app: p => join(emptyDir, p) }
    })

    expect(emptyPkg.appPkg).toEqual({})
  })
})
