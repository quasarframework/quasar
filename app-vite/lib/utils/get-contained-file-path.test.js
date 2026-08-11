import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { getContainedFilePath } from './get-contained-file-path.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-contained-')))
const outDir = join(rootDir, 'contained')
mkdirSync(outDir)

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

describe('[get-contained-file-path.js]', () => {
  test('resolves relative segments inside the root', async () => {
    expect(await getContainedFilePath(outDir, 'sub', 'file.json')).toBe(
      join(outDir, 'sub', 'file.json')
    )
  })

  test('rejects absolute path segments', async () => {
    await expect(
      getContainedFilePath(outDir, join(rootDir, 'other'))
    ).rejects.toThrow('only relative path segments')
  })

  test('rejects traversal outside the root', async () => {
    await expect(
      getContainedFilePath(outDir, '..', 'escape.json')
    ).rejects.toThrow('inside the output directory')
  })

  test('rejects resolving to the root itself', async () => {
    await expect(getContainedFilePath(outDir, '.')).rejects.toThrow(
      'inside the output directory'
    )
  })

  test('rejects escaping through a symlink', async () => {
    const outside = join(rootDir, 'outside-target')
    mkdirSync(outside)
    symlinkSync(outside, join(outDir, 'sneaky-link'))

    await expect(
      getContainedFilePath(outDir, 'sneaky-link', 'file.json')
    ).rejects.toThrow('symlink')
  })
})
