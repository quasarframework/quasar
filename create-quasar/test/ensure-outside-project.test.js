import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, describe, expect, test } from 'vitest'

import { isInsideQuasarProject } from '../lib/ensure-outside-project.js'

const originalCwd = process.cwd()
const rootDir = mkdtempSync(join(tmpdir(), 'create-quasar-ensure-'))

afterEach(() => {
  process.chdir(originalCwd)
})

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

function makeDir(...segments) {
  const dir = join(rootDir, ...segments)
  mkdirSync(dir, { recursive: true })
  return dir
}

describe('[ensure-outside-project.js]', () => {
  describe('isInsideQuasarProject()', () => {
    test('returns false outside of any Quasar project', () => {
      process.chdir(makeDir('plain'))
      expect(isInsideQuasarProject()).toBe(false)
    })

    test.each([
      'quasar.config.js',
      'quasar.config.mjs',
      'quasar.config.ts',
      'quasar.config.cjs',
      'quasar.conf.js'
    ])('detects %s in the current directory', filename => {
      const dir = makeDir(`direct-${filename}`)
      writeFileSync(join(dir, filename), 'export default {}')

      process.chdir(dir)
      expect(isInsideQuasarProject()).toBe(true)
    })

    test('detects a Quasar config in an ancestor directory', () => {
      const projectDir = makeDir('ancestor')
      writeFileSync(join(projectDir, 'quasar.config.js'), 'export default {}')

      process.chdir(makeDir('ancestor', 'src', 'components'))
      expect(isInsideQuasarProject()).toBe(true)
    })

    test('ignores unrelated config files', () => {
      const dir = makeDir('unrelated')
      writeFileSync(join(dir, 'vite.config.js'), 'export default {}')

      process.chdir(dir)
      expect(isInsideQuasarProject()).toBe(false)
    })
  })
})
