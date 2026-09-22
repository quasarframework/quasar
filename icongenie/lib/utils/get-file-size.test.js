import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { getFileSize } from './get-file-size.js'

const workDir = mkdtempSync(join(tmpdir(), 'icongenie-file-size-'))

function fileOf(bytes) {
  const file = join(workDir, `${bytes}.bin`)
  writeFileSync(file, Buffer.alloc(bytes))
  return file
}

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

describe('getFileSize', () => {
  test('one decimal, in the largest unit reached', () => {
    expect(getFileSize(fileOf(0))).toBe('0.0B')
    expect(getFileSize(fileOf(1023))).toBe('1023.0B')
    expect(getFileSize(fileOf(1024))).toBe('1.0KB')
    expect(getFileSize(fileOf(1536))).toBe('1.5KB')
    expect(getFileSize(fileOf(1024 * 1024 * 2.25))).toBe('2.3MB')
  })
})
