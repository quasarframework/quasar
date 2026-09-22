import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test, vi } from 'vitest'

import { getProfileFiles } from './get-profile-files.js'

const workDir = mkdtempSync(join(tmpdir(), 'icongenie-profile-files-'))

vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`exit(${code})`)
})
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

describe('getProfileFiles', () => {
  test('a file is the only profile', () => {
    const file = join(workDir, 'any-name.json')
    writeFileSync(file, '{}')

    expect(getProfileFiles(file)).toEqual([file])
  })

  test('a folder lists its icongenie-*.json files, not deeper', () => {
    const folder = join(workDir, 'profiles')
    mkdirSync(join(folder, 'nested'), { recursive: true })

    const files = ['icongenie-a.json', 'icongenie-b.json'].map(name => {
      const file = join(folder, name)
      writeFileSync(file, '{}')
      return file
    })
    writeFileSync(join(folder, 'other.json'), '{}')
    writeFileSync(join(folder, 'nested/icongenie-c.json'), '{}')

    expect(getProfileFiles(folder).sort()).toEqual(files)
  })

  test('a folder without profiles is an error', () => {
    const folder = join(workDir, 'empty')
    mkdirSync(folder)

    expect(() => getProfileFiles(folder)).toThrow('exit(1)')
  })
})
