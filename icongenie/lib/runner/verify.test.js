import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest'

// the project folder is detected from the cwd when the module loads;
// without a quasar.config file up the tree, the cwd itself is used
const projectFolder = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-runner-verify-'))
)
process.chdir(projectFolder)

const log = vi.spyOn(console, 'log').mockImplementation(() => {})
const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`exit(${code})`)
})

const { verify } = await import('./verify.js')
const { modes } = await import('../modes/index.js')
const { getAssetsFiles } = await import('../utils/get-assets-files.js')

// oxlint-disable-next-line no-control-regex -- stripping ANSI SGR sequences is the point
const stripAnsi = str => str.replaceAll(/\u001B\[\d+m/g, '')

function output() {
  return log.mock.calls.map(call => stripAnsi(String(call[0] ?? ''))).join('\n')
}

function lines(pattern) {
  return output()
    .split('\n')
    .filter(line => line.includes(pattern))
}

async function writeAsset(
  file,
  { width = file.width, height = file.height } = {}
) {
  mkdirSync(dirname(file.absoluteName), { recursive: true })

  if (
    file.generator === 'svg' ||
    file.generator === 'ico' ||
    file.generator === 'icns'
  ) {
    writeFileSync(file.absoluteName, '')
    return
  }

  await sharp({
    create: { width, height, channels: 4, background: '#f00' }
  })
    .png()
    .toFile(file.absoluteName)
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  process.chdir(tmpdir())
  rmSync(projectFolder, { recursive: true, force: true })
})

describe('verify', () => {
  test('only the installed modes are verified', () => {
    verify({ mode: 'spa,bex' })

    expect(warn.mock.calls[0][0]).toContain('No assets to generate')
    expect(output()).not.toContain('Mode SPA')
  })

  test('reports every missing file of a mode', () => {
    mkdirSync(join(projectFolder, 'src'))

    verify({ mode: 'spa' })

    const files = getAssetsFiles(modes.spa.assets)
    expect(output()).toContain('Mode SPA')
    expect(output()).toContain('Assets of....... spa')
    expect(lines('ERROR: missing!')).toHaveLength(files.length)
  })

  test('checks the resolution of the sized files', async () => {
    const files = getAssetsFiles(modes.spa.assets)

    for (const file of files) {
      await writeAsset(file)
    }
    // one wrong size
    const wrong = files.find(file => file.generator === 'png')
    await writeAsset(wrong, { width: wrong.width + 1 })
    // one that is not a png
    const fake = files.findLast(file => file.generator === 'png')
    writeFileSync(fake.absoluteName, 'nope')

    verify({ mode: 'spa' })

    expect(lines('SIZE OK')).toHaveLength(files.length - 2)
    expect(lines('ERROR: incorrect resolution!')).toHaveLength(1)
    expect(lines('ERROR: incorrect resolution!')[0]).toContain(
      wrong.relativeName
    )
    expect(lines('ERROR: not a png!')[0]).toContain(fake.relativeName)
  })

  test('the filter narrows the generators', () => {
    verify({ mode: 'spa', filter: 'ico' })

    expect(lines('ico:')).toHaveLength(1)
    expect(lines('png:')).toHaveLength(0)
    expect(output()).toContain('Assets filter... ico')
  })

  test('dark variants are optional without a dark color', () => {
    mkdirSync(join(projectFolder, 'src-capacitor/android'), { recursive: true })
    const files = getAssetsFiles(modes.capacitor.assets).filter(
      file =>
        file.platform === 'capacitor-android' &&
        file.generator === 'splashscreen'
    )
    const dark = files.filter(file => file.dark === true)

    verify({ mode: 'capacitor', filter: 'splashscreen' })
    expect(lines('not generated (no splashscreen dark color)')).toHaveLength(
      dark.length
    )
    expect(lines('ERROR: missing!')).toHaveLength(files.length - dark.length)

    log.mockClear()
    verify({
      mode: 'capacitor',
      filter: 'splashscreen',
      splashscreenDarkColor: '000'
    })
    expect(lines('not generated')).toHaveLength(0)
    expect(lines('ERROR: missing!')).toHaveLength(files.length)
  })

  test('a profile file drives the asset list, with the CLI params on top', () => {
    const profile = {
      params: { include: ['spa'], filter: 'png' },
      assets: [
        {
          generator: 'png',
          name: 'custom-{size}.png',
          folder: 'public',
          sizes: [10, 20]
        }
      ]
    }
    writeFileSync(
      join(projectFolder, 'icongenie-test.json'),
      JSON.stringify(profile)
    )

    verify({ profile: 'icongenie-test.json', filter: 'ico' })

    expect(output()).toContain('Assets of....... spa | profile')
    expect(output()).toContain('Assets filter... ico')
    expect(lines('ico:')).toHaveLength(1)

    log.mockClear()
    verify({ profile: 'icongenie-test.json' })
    expect(output()).toContain('Mode PROFILE ASSETS')
    expect(lines('custom-10.png')).toHaveLength(1)
    expect(lines('custom-20.png')).toHaveLength(1)
    // the profile's own filter applies
    expect(lines('ico:')).toHaveLength(0)
  })

  test('the params are validated', () => {
    expect(() => verify({ mode: 'spa', filter: 'nope' })).toThrow('exit(1)')
    expect(() => verify({ mode: 'spa', pngColor: 'red' })).toThrow('exit(1)')
  })

  test('the mount status of native assets', async () => {
    mkdirSync(join(projectFolder, 'src-cordova'), { recursive: true })
    writeFileSync(
      join(projectFolder, 'src-cordova/config.xml'),
      `<?xml version='1.0' encoding='utf-8'?>\n<widget id="x"><platform name="ios" /></widget>\n`
    )
    const files = getAssetsFiles(modes.cordova.assets)
    for (const file of files.filter(entry => entry.generator === 'png')) {
      await writeAsset(file)
    }

    verify({ mode: 'cordova', filter: 'png' })

    expect(lines('ERROR: platform not installed!')).toHaveLength(0)
    expect(lines('no entry for it in src-cordova/config.xml')).toHaveLength(3)
    expect(lines('SIZE OK')).toHaveLength(3)
  })
})
