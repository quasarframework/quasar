import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { resolveExtension } from './resolve-extension.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const dir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-resolve-ext-')))

writeFileSync(join(dir, 'boot.ts'), '')
writeFileSync(join(dir, 'exact'), '')

afterAll(() => {
  rmSync(dir, { recursive: true, force: true })
})

describe('[resolve-extension.js]', () => {
  test('resolves the first matching extension', () => {
    expect(resolveExtension(join(dir, 'boot'))).toBe(join(dir, 'boot.ts'))
  })

  test('an extension-less exact file wins', () => {
    expect(resolveExtension(join(dir, 'exact'))).toBe(join(dir, 'exact'))
  })

  test('supports a custom extension list', () => {
    expect(resolveExtension(join(dir, 'boot'), ['.vue'])).toBeUndefined()
    expect(resolveExtension(join(dir, 'boot'), ['.ts'])).toBe(
      join(dir, 'boot.ts')
    )
  })

  test('returns undefined when nothing matches', () => {
    expect(resolveExtension(join(dir, 'missing'))).toBeUndefined()
  })
})
