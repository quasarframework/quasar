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

import { getPackage } from './get-package.js'

const appViteDir = join(import.meta.dirname, '../..')

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-get-package-'))
)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

const hostDir = join(rootDir, 'host-app')

// fake-dep installed in the fixture folder, with an importable entry point
const fakeDepDir = join(hostDir, 'node_modules', 'fake-dep')
mkdirSync(fakeDepDir, { recursive: true })
writeFileSync(
  join(fakeDepDir, 'package.json'),
  JSON.stringify({
    name: 'fake-dep',
    version: '3.4.5',
    type: 'module',
    main: 'index.js'
  })
)
writeFileSync(join(fakeDepDir, 'index.js'), 'export const answer = 42\n')

describe('[get-package.js]', () => {
  test('imports the entry point of a package', async () => {
    const mod = await getPackage('fake-dep', hostDir)
    expect(mod.answer).toBe(42)
  })

  test('parses .json targets instead of importing them', async () => {
    const pkg = await getPackage('fake-dep/package.json', hostDir)
    expect(pkg.version).toBe('3.4.5')
  })

  test('imports a real dependency', async () => {
    const mod = await getPackage('kolorist', appViteDir)
    expect(mod.red).toBeTypeOf('function')
  })

  test('returns undefined for packages that cannot be resolved', async () => {
    const mod = await getPackage('surely-not-installed-pkg', hostDir)
    expect(mod).toBeUndefined()
  })
})
