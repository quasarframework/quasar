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

import { getFixedDeps } from './get-fixed-deps.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const appDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-fixed-deps-')))

mkdirSync(join(appDir, 'node_modules', 'installed-dep'), { recursive: true })
writeFileSync(
  join(appDir, 'node_modules', 'installed-dep', 'package.json'),
  JSON.stringify({ name: 'installed-dep', version: '1.2.3' })
)

afterAll(() => {
  rmSync(appDir, { recursive: true, force: true })
})

describe('[get-fixed-deps.js]', () => {
  test('pins resolvable dependencies to their installed version', () => {
    expect(getFixedDeps({ 'installed-dep': '^1.0.0' }, appDir)).toEqual({
      'installed-dep': '1.2.3'
    })
  })

  test('keeps the range of unresolvable dependencies', () => {
    expect(getFixedDeps({ 'missing-dep': '^9.0.0' }, appDir)).toEqual({
      'missing-dep': '^9.0.0'
    })
  })

  test('leaves URL-style ranges untouched', () => {
    expect(
      getFixedDeps({ 'installed-dep': 'https://some.url/pkg.tgz' }, appDir)
    ).toEqual({ 'installed-dep': 'https://some.url/pkg.tgz' })
  })

  test('returns an empty object without dependencies', () => {
    expect(getFixedDeps(void 0, appDir)).toEqual({})
  })
})
