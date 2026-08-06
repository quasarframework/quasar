import { dirname, join } from 'node:path'
import { describe, expect, test } from 'vitest'

import { getPackagePath } from './get-package-path.js'
import { getPackageJson } from './get-package-json.js'

const cliDir = join(import.meta.dirname, '..')

describe('[get-package-path.js]', () => {
  test('resolves a package installed in the given folder', () => {
    const path = getPackagePath('kolorist', cliDir)
    expect(path).toBeTypeOf('string')
    expect(dirname(path)).toContain('kolorist')
  })

  test('resolves package subpaths', () => {
    expect(getPackagePath('kolorist/package.json', cliDir)).toBeTypeOf('string')
  })

  test('returns undefined for packages that cannot be resolved', () => {
    expect(getPackagePath('surely-not-installed-pkg', cliDir)).toBeUndefined()
  })
})

describe('[get-package-json.js]', () => {
  test('reads the package.json of a resolvable package', () => {
    const pkg = getPackageJson('kolorist', cliDir)
    expect(pkg.name).toBe('kolorist')
    expect(pkg.version).toBeTypeOf('string')
  })

  test('returns undefined for packages that cannot be resolved', () => {
    expect(getPackageJson('surely-not-installed-pkg', cliDir)).toBeUndefined()
  })
})
