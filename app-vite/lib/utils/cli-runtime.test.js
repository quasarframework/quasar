import { join, resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

import { cliDir, cliPkg, resolveToCliDir } from './cli-runtime.js'

const testDir = import.meta.dirname

describe('[cli-runtime.js]', () => {
  test('cliDir points at the package root', () => {
    expect(cliDir).toBe(resolve(testDir, '../..'))
  })

  test('cliPkg is the package.json of the CLI', () => {
    expect(cliPkg.name).toBe('@quasar/app-vite')
    expect(cliPkg.version).toBeTypeOf('string')
  })

  test('resolveToCliDir() resolves relative to the package root', () => {
    expect(resolveToCliDir('lib/utils')).toBe(join(cliDir, 'lib/utils'))
    expect(resolveToCliDir('.')).toBe(cliDir)
  })
})
