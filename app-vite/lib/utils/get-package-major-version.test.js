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

import { getPackageMajorVersion } from './get-package-major-version.js'

const appViteDir = join(import.meta.dirname, '../..')

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-get-package-major-version-'))
)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

const hostDir = join(rootDir, 'host-app')

// fake-dep@3.4.5 installed in the fixture folder
const fakeDepDir = join(hostDir, 'node_modules', 'fake-dep')
mkdirSync(fakeDepDir, { recursive: true })
writeFileSync(
  join(fakeDepDir, 'package.json'),
  JSON.stringify({ name: 'fake-dep', version: '3.4.5' })
)

describe('[get-package-major-version.js]', () => {
  test('extracts the major version of a fixture package', () => {
    expect(getPackageMajorVersion('fake-dep', hostDir)).toBe(3)
  })

  test('extracts the major version of a real dependency', () => {
    const major = getPackageMajorVersion('vite', appViteDir)
    expect(Number.isInteger(major)).toBe(true)
  })

  test('returns undefined for packages that cannot be resolved', () => {
    expect(
      getPackageMajorVersion('surely-not-installed-pkg', hostDir)
    ).toBeUndefined()
  })
})
