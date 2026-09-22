import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test, vi } from 'vitest'

// the project folder is detected from the cwd when the module loads;
// without a quasar.config file up the tree, the cwd itself is used
const projectFolder = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-profile-content-'))
)
process.chdir(projectFolder)

vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`exit(${code})`)
})
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})

const { getProfileContent } = await import('./get-profile-content.js')

afterAll(() => {
  process.chdir(tmpdir())
  rmSync(projectFolder, { recursive: true, force: true })
})

describe('getProfileContent', () => {
  test('parses the file, relative to the project folder', () => {
    writeFileSync(
      join(projectFolder, 'icongenie-test.json'),
      '{ "params": { "quality": 3 }, "assets": [] }'
    )

    expect(getProfileContent('icongenie-test.json')).toEqual({
      params: { quality: 3 },
      assets: []
    })
    expect(
      getProfileContent(join(projectFolder, 'icongenie-test.json'))
    ).toEqual({ params: { quality: 3 }, assets: [] })
  })

  test('a syntax error or a missing file is fatal', () => {
    writeFileSync(join(projectFolder, 'broken.json'), '{ "params": ')

    expect(() => getProfileContent('broken.json')).toThrow('exit(1)')
    expect(() => getProfileContent('missing.json')).toThrow('exit(1)')
  })
})
