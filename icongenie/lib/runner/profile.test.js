import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test, vi } from 'vitest'

// the project folder is detected from the cwd when the module loads;
// without a quasar.config file up the tree, the cwd itself is used
const projectFolder = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-runner-profile-'))
)
process.chdir(projectFolder)

vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`exit(${code})`)
})
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})

const { profile } = await import('./profile.js')
const { modes } = await import('../modes/index.js')

function read(name) {
  return JSON.parse(readFileSync(join(projectFolder, name), 'utf8'))
}

afterAll(() => {
  process.chdir(tmpdir())
  rmSync(projectFolder, { recursive: true, force: true })
})

describe('profile', () => {
  test('writes the params and the assets of the requested modes', () => {
    profile({
      output: 'my',
      assets: ['spa', 'bex'],
      include: 'spa,bex',
      quality: 7,
      padding: [4, '2%'],
      themeColor: '1976D2'
    })

    expect(read('icongenie-my.json')).toEqual({
      params: {
        include: ['spa', 'bex'],
        quality: 7,
        padding: [4, '2%'],
        themeColor: '1976D2'
      },
      assets: [...modes.spa.assets, ...modes.bex.assets]
    })
  })

  test('the file name gets the icongenie- prefix and the .json suffix', () => {
    profile({ output: 'icongenie-a.json', assets: [] })
    profile({ output: 'b.json', assets: [] })
    profile({ output: 'icongenie-c', assets: [] })

    expect(read('icongenie-a.json')).toEqual({ params: {}, assets: [] })
    expect(existsSync(join(projectFolder, 'icongenie-b.json'))).toBe(true)
    expect(existsSync(join(projectFolder, 'icongenie-c.json'))).toBe(true)
  })

  test('a relative icon path is made relative to the project folder', () => {
    profile({ output: 'icon', assets: [], icon: 'src/icon.png' })
    expect(read('icongenie-icon.json').params.icon).toBe(
      join('src', 'icon.png')
    )

    profile({ output: 'abs', assets: [], icon: join(projectFolder, 'x.png') })
    expect(read('icongenie-abs.json').params.icon).toBe(
      join(projectFolder, 'x.png')
    )
  })

  test('the params are validated as unparsed (no color hash)', () => {
    expect(() =>
      profile({ output: 'bad', assets: [], pngColor: '#fff' })
    ).toThrow('exit(1)')
    expect(() => profile({ output: 'bad', assets: [], quality: 13 })).toThrow(
      'exit(1)'
    )
    expect(existsSync(join(projectFolder, 'icongenie-bad.json'))).toBe(false)
  })

  test('writes into a folder that does not exist yet', () => {
    profile({ output: 'nested/deep/x', assets: ['electron'] })

    expect(read('nested/deep/icongenie-x.json').assets).toEqual(
      modes.electron.assets
    )
  })
})
