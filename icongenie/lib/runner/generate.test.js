import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest'

// the project folder is detected from the cwd when the module loads;
// without a quasar.config file up the tree, the cwd itself is used
const projectFolder = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-runner-generate-'))
)
process.chdir(projectFolder)

const log = vi.spyOn(console, 'log').mockImplementation(() => {})
const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`exit(${code})`)
})

const { generate } = await import('./generate.js')
const { modes } = await import('../modes/index.js')
const { retired } = await import('../modes/v2/cordova.js')
const { getAssetsFiles } = await import('../utils/get-assets-files.js')
const { getPngSize } = await import('../utils/get-png-size.js')

// oxlint-disable-next-line no-control-regex -- stripping ANSI SGR sequences is the point
const stripAnsi = str => str.replaceAll(/\u001B\[\d+m/g, '')

const sampleIcon = resolve(
  import.meta.dirname,
  '../../samples/icongenie-icon.png'
)

function output() {
  return log.mock.calls.map(call => stripAnsi(String(call[0] ?? ''))).join('\n')
}

function lines(pattern) {
  return output()
    .split('\n')
    .filter(line => line.includes(pattern))
}

function generatedCount() {
  return Number(output().match(/Task done - generated (\d+) file/)[1])
}

function filesOf(mode, predicate = () => true) {
  return getAssetsFiles(modes[mode].assets).filter(predicate)
}

function expectGenerated(files) {
  files.forEach(file => {
    expect(existsSync(file.absoluteName), file.relativeName).toBe(true)

    if (file.width !== void 0 && file.generator !== 'svg') {
      expect(getPngSize(file.absoluteName), file.relativeName).toEqual({
        width: file.width,
        height: file.height
      })
    }
  })
}

// the lowest quality: the fastest run
const base = { icon: sampleIcon, quality: '1' }

beforeEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  process.chdir(tmpdir())
  rmSync(projectFolder, { recursive: true, force: true })
})

describe('generate', () => {
  test('nothing to do without an installed mode', async () => {
    await generate({ ...base, mode: 'spa' })

    expect(
      warn.mock.calls.some(call => call[0].includes('No assets to generate'))
    ).toBe(true)
    expect(generatedCount()).toBe(0)
  })

  test('the assets of the installed modes, with the tags to add', async () => {
    mkdirSync(join(projectFolder, 'src'))
    mkdirSync(join(projectFolder, 'src-bex'))

    await generate({ ...base, mode: 'spa,bex' })

    const files = [...filesOf('spa'), ...filesOf('bex')]
    expectGenerated(files)
    expect(generatedCount()).toBe(files.length)
    expect(lines('Generated ')).toHaveLength(files.length)
    expect(output()).toContain('Assets of................. spa | bex')

    files
      .filter(file => file.tag)
      .forEach(file => {
        expect(output()).toContain(file.tag)
      })
  })

  test('the banner reflects the params', async () => {
    await generate({
      ...base,
      mode: 'bex',
      padding: '4,2%',
      themeColor: 'abc',
      splashscreenDarkColor: '000',
      skipTrim: true
    })

    expect(output()).toContain('Quality level............. 1/12')
    expect(output()).toContain('Icon trimming............. no')
    expect(output()).toContain(
      'Icon padding.............. horizontal: 4; vertical: 2%'
    )
    expect(output()).toContain('Png color................. #abc')
    expect(output()).toContain('Splashscreen dark color... #000')
    expect(output()).toContain(
      'Monochrome icon file...... none (derived from the icon)'
    )
  })

  test('a filter keeps one generator', async () => {
    rmSync(join(projectFolder, 'public'), { recursive: true })

    await generate({ ...base, mode: 'spa', filter: 'ico' })

    const files = filesOf('spa')
    expectGenerated(files.filter(file => file.generator === 'ico'))
    expect(generatedCount()).toBe(1)
    files
      .filter(file => file.generator !== 'ico')
      .forEach(file => {
        expect(existsSync(file.absoluteName), file.relativeName).toBe(false)
      })
  })

  test('cordova: the assets, their config.xml entries and the retired files', async () => {
    mkdirSync(join(projectFolder, 'src-cordova'))
    writeFileSync(
      join(projectFolder, 'src-cordova/config.xml'),
      `<?xml version='1.0' encoding='utf-8'?>\n<widget id="x"><name>Test</name></widget>\n`
    )
    // leftovers of an earlier Icon Genie
    const leftover = join(projectFolder, retired[0])
    mkdirSync(dirname(leftover), { recursive: true })
    writeFileSync(leftover, '')

    await generate({ ...base, mode: 'cordova', splashscreenDarkColor: '000' })

    const files = filesOf('cordova')
    expectGenerated(files)
    expect(generatedCount()).toBe(files.length)

    expect(existsSync(leftover)).toBe(false)
    expect(lines(`Removed ${retired[0]} (obsolete)`)).toHaveLength(1)

    const configXml = readFileSync(
      join(projectFolder, 'src-cordova/config.xml'),
      'utf8'
    )
    expect(configXml).toContain('AndroidWindowSplashScreenAnimatedIcon')
    expect(configXml).toContain('src="res/ios/icon.png"')
    expect(configXml).toContain('Default@2x~universal~anyany~dark.png')
    expect(lines('Updated src-cordova/config.xml')).toHaveLength(1)
  })

  test('dark variants are removed when the dark color is dropped', async () => {
    const dark = filesOf('cordova', file => file.dark === true)
    const light = filesOf('cordova', file => file.dark !== true)

    await generate({ ...base, mode: 'cordova' })

    expect(generatedCount()).toBe(light.length)
    dark.forEach(file => {
      expect(existsSync(file.absoluteName), file.relativeName).toBe(false)
      expect(
        lines(`Removed ${file.relativeName} (no splashscreen dark color)`)
      ).toHaveLength(1)
    })
    // the config.xml entries of the removed files are pruned
    expect(
      readFileSync(join(projectFolder, 'src-cordova/config.xml'), 'utf8')
    ).not.toContain('~dark.png')
  })

  test('capacitor: only the platforms added to the project', async () => {
    mkdirSync(join(projectFolder, 'src-capacitor/android/app/src/main/res'), {
      recursive: true
    })
    writeFileSync(
      join(projectFolder, 'src-capacitor/package.json'),
      JSON.stringify({ dependencies: { '@capacitor/splash-screen': '^8' } })
    )

    await generate({ ...base, mode: 'capacitor', splashscreenDarkColor: '000' })

    const android = filesOf(
      'capacitor',
      file => file.platform === 'capacitor-android'
    )
    const ios = filesOf('capacitor', file => file.platform === 'capacitor-ios')
    expectGenerated(android)
    expect(generatedCount()).toBe(android.length)
    ios.forEach(file => {
      expect(existsSync(file.absoluteName), file.relativeName).toBe(false)
    })
    expect(
      warn.mock.calls.some(call => call[0].includes('Skipping capacitor-ios'))
    ).toBe(true)

    // the night resources and the adaptive icon are in place
    expect(
      existsSync(
        join(
          projectFolder,
          'src-capacitor/android/app/src/main/res/drawable-night/splash.png'
        )
      )
    ).toBe(true)
    expect(
      existsSync(
        join(
          projectFolder,
          'src-capacitor/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml'
        )
      )
    ).toBe(true)
  })

  test('a profile file: its assets, its params and the CLI params on top', async () => {
    const profile = {
      // a profile file holds the colors without the hash
      params: { include: ['bex'], quality: 12, pngColor: 'f00' },
      assets: [
        {
          generator: 'png',
          name: 'custom-{size}x{size}.png',
          folder: 'public/custom',
          sizes: [10, 20]
        },
        { generator: 'svg', name: 'custom.svg', folder: 'public/custom' }
      ]
    }
    writeFileSync(
      join(projectFolder, 'icongenie-test.json'),
      JSON.stringify(profile)
    )

    await generate({ ...base, profile: 'icongenie-test.json' })

    const custom = getAssetsFiles(profile.assets)
    expectGenerated([...custom, ...filesOf('bex')])
    expect(generatedCount()).toBe(custom.length + filesOf('bex').length)
    expect(output()).toContain('Assets of................. bex | profile')
    // the CLI quality wins over the profile's, its color stands
    expect(output()).toContain('Quality level............. 1/12')
    expect(output()).toContain('Png color................. #f00')
  })

  test('a profile without params generates its assets only', async () => {
    writeFileSync(
      join(projectFolder, 'icongenie-assets.json'),
      JSON.stringify({
        assets: [
          { generator: 'png', name: 'only.png', folder: 'public', sizes: [8] }
        ]
      })
    )

    await generate({ ...base, profile: 'icongenie-assets.json' })

    expect(generatedCount()).toBe(1)
    expect(getPngSize(join(projectFolder, 'public/only.png'))).toEqual({
      width: 8,
      height: 8
    })
  })

  test('the same file requested twice is generated once', async () => {
    writeFileSync(
      join(projectFolder, 'icongenie-dupe.json'),
      JSON.stringify({
        params: { include: ['spa'] },
        assets: [modes.spa.assets.find(asset => asset.generator === 'ico')]
      })
    )

    await generate({ ...base, profile: 'icongenie-dupe.json' })

    expect(generatedCount()).toBe(filesOf('spa').length)
  })

  test('the params are validated before anything is written', () => {
    rmSync(join(projectFolder, 'public'), { recursive: true })

    // the params are parsed synchronously, ahead of any file work
    expect(() => generate({ ...base, mode: 'spa', quality: '13' })).toThrow(
      'exit(1)'
    )
    expect(() => generate({ ...base, mode: 'nope' })).toThrow('exit(1)')
    expect(() => generate({ ...base, profile: 'missing.json' })).toThrow(
      'exit(1)'
    )
    expect(() => generate({ ...base, mode: 'spa', pngColor: '#fff' })).toThrow(
      'exit(1)'
    )

    expect(existsSync(join(projectFolder, 'public'))).toBe(false)
  })
})
