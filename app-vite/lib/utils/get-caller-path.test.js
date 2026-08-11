import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterAll, describe, expect, test } from 'vitest'

import { getCallerPath } from './get-caller-path.js'

const testDir = import.meta.dirname

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const fixtureDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-caller-path-'))
)

afterAll(() => {
  rmSync(fixtureDir, { recursive: true, force: true })
})

describe('[get-caller-path.js]', () => {
  test('returns the directory of the calling file', () => {
    expect(getCallerPath()).toBe(testDir)
  })

  test('the index param selects a deeper stack frame', async () => {
    const libUrl = pathToFileURL(join(testDir, 'get-caller-path.js')).href

    const fixtureFile = join(fixtureDir, 'fixture.mjs')
    writeFileSync(
      fixtureFile,
      `import { getCallerPath } from ${JSON.stringify(libUrl)}
export const ownDir = getCallerPath()
export function fromCaller() {
  return getCallerPath(1)
}
`
    )

    const fixture = await import(pathToFileURL(fixtureFile).href)

    // index 0 -> the fixture module itself
    expect(fixture.ownDir).toBe(fixtureDir)
    // index 1 -> the file that called into the fixture (this test file)
    expect(fixture.fromCaller()).toBe(testDir)
  })

  test('restores Error.prepareStackTrace', () => {
    const original = Error.prepareStackTrace
    const marker = () => 'marker'
    Error.prepareStackTrace = marker

    try {
      getCallerPath()
      expect(Error.prepareStackTrace).toBe(marker)
    } finally {
      Error.prepareStackTrace = original
    }
  })
})
