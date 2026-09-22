import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest'

// the project folder is detected from the cwd when the module loads;
// without a quasar.config file up the tree, the cwd itself is used
const projectFolder = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-mount-capacitor-'))
)
process.chdir(projectFolder)

const log = vi.spyOn(console, 'log').mockImplementation(() => {})
const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

const installPackage = vi.fn(() => Promise.resolve(true))
vi.mock('../utils/package-manager.js', () => ({
  createInstance: () => ({ installPackage })
}))

const { isCapacitorFile, mountCapacitor, verifyCapacitor } =
  await import('./mount-capacitor.js')
const { getAssetsFiles } = await import('../utils/get-assets-files.js')
const { modes } = await import('../modes/index.js')

// oxlint-disable-next-line no-control-regex -- stripping ANSI SGR sequences is the point
const stripAnsi = str => str.replaceAll(/\u001B\[\d+m/g, '')

const files = getAssetsFiles(modes.capacitor.assets)
const android = files.filter(file => file.platform === 'capacitor-android')
const ios = files.filter(file => file.platform === 'capacitor-ios')

const srcCapacitor = join(projectFolder, 'src-capacitor')
const androidMain = join(srcCapacitor, 'android/app/src/main')
const androidRes = join(androidMain, 'res')
const xcassets = join(srcCapacitor, 'ios/App/App/Assets.xcassets')

function touch(list) {
  list.forEach(file => {
    mkdirSync(dirname(file.absoluteName), { recursive: true })
    writeFileSync(file.absoluteName, '')
  })
}

function readXcassets(folder) {
  return JSON.parse(
    readFileSync(join(xcassets, folder, 'Contents.json'), 'utf8')
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  process.chdir(tmpdir())
  rmSync(projectFolder, { recursive: true, force: true })
})

describe('isCapacitorFile', () => {
  test('by platform', () => {
    expect(isCapacitorFile({ platform: 'capacitor-android' })).toBe(true)
    expect(isCapacitorFile({ platform: 'capacitor-ios' })).toBe(true)
    expect(isCapacitorFile({ platform: 'cordova-ios' })).toBe(false)
    expect(isCapacitorFile({})).toBe(false)
  })
})

describe('mountCapacitor', () => {
  test('ignores non Capacitor files', async () => {
    await mountCapacitor([{ generator: 'png', name: 'favicon.png' }])

    expect(existsSync(srcCapacitor)).toBe(false)
  })

  test('Android: writes the adaptive icon for each launcher name', async () => {
    touch(android)
    writeFileSync(
      join(srcCapacitor, 'package.json'),
      JSON.stringify({ dependencies: { '@capacitor/splash-screen': '^8' } })
    )

    await mountCapacitor(android)

    const folder = join(androidRes, 'mipmap-anydpi-v26')
    const xml = readFileSync(join(folder, 'ic_launcher.xml'), 'utf8')

    expect(xml).toContain(
      '<background android:drawable="@mipmap/ic_launcher_background"/>'
    )
    expect(xml).toContain(
      '<foreground android:drawable="@mipmap/ic_launcher_foreground"/>'
    )
    expect(xml).toContain(
      '<monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>'
    )
    expect(xml.indexOf('<background')).toBeLessThan(xml.indexOf('<foreground'))
    expect(readFileSync(join(folder, 'ic_launcher_round.xml'), 'utf8')).toBe(
      xml
    )

    // the plugin is already a dependency
    expect(installPackage).not.toHaveBeenCalled()
  })

  test('Android: the monochrome layer is optional', async () => {
    const withoutMonochrome = android.filter(
      file => file.variant !== 'monochrome'
    )

    await mountCapacitor(withoutMonochrome)

    const xml = readFileSync(
      join(androidRes, 'mipmap-anydpi-v26/ic_launcher.xml'),
      'utf8'
    )
    expect(xml).not.toContain('<monochrome')
  })

  test('Android: both layers are needed for the adaptive icon', async () => {
    rmSync(join(androidRes, 'mipmap-anydpi-v26'), { recursive: true })

    await mountCapacitor(android.filter(file => file.variant !== 'background'))

    expect(existsSync(join(androidRes, 'mipmap-anydpi-v26'))).toBe(false)
    expect(warn.mock.calls[0][0]).toContain('"background"')
  })

  test('unchanged files are left alone', async () => {
    await mountCapacitor(android)
    const target = join(androidRes, 'mipmap-anydpi-v26/ic_launcher.xml')
    const { mtimeMs } = statSync(target)
    log.mockClear()

    await mountCapacitor(android)

    expect(statSync(target).mtimeMs).toBe(mtimeMs)
    expect(log.mock.calls.some(call => call[0].includes('Updated'))).toBe(false)
  })

  test('iOS: writes the Contents.json of each imageset', async () => {
    touch(ios)

    await mountCapacitor(ios)

    const appIcon = readXcassets('AppIcon.appiconset')
    expect(appIcon.info).toEqual({ author: 'xcode', version: 1 })
    expect(appIcon.images).toEqual([
      {
        filename: 'AppIcon-512@2x.png',
        idiom: 'universal',
        platform: 'ios',
        size: '1024x1024'
      },
      {
        appearances: [{ appearance: 'luminosity', value: 'dark' }],
        filename: 'AppIcon-512@2x-dark.png',
        idiom: 'universal',
        platform: 'ios',
        size: '1024x1024'
      },
      {
        appearances: [{ appearance: 'luminosity', value: 'tinted' }],
        filename: 'AppIcon-512@2x-tinted.png',
        idiom: 'universal',
        platform: 'ios',
        size: '1024x1024'
      }
    ])

    const splash = readXcassets('Splash.imageset')
    expect(splash.images.map(entry => entry.filename)).toEqual([
      'splash-2732x2732-2.png',
      'splash-2732x2732-1.png',
      'splash-2732x2732.png',
      'splash-2732x2732-2-dark.png',
      'splash-2732x2732-1-dark.png',
      'splash-2732x2732-dark.png'
    ])
    expect(splash.images[0]).toEqual({
      filename: 'splash-2732x2732-2.png',
      idiom: 'universal',
      scale: '1x'
    })
    expect(splash.images[5].appearances).toEqual([
      { appearance: 'luminosity', value: 'dark' }
    ])
  })

  test('iOS: Xcode serialization, so that Xcode does not rewrite it', () => {
    const raw = readFileSync(
      join(xcassets, 'AppIcon.appiconset/Contents.json'),
      'utf8'
    )

    expect(raw).toContain('"images" : [')
    expect(raw).toContain('"idiom" : "universal"')
    expect(raw.endsWith('}\n')).toBe(true)
  })

  test('iOS: the light variants only, once the dark ones are dropped', async () => {
    await mountCapacitor(ios.filter(file => file.dark !== true))

    expect(readXcassets('Splash.imageset').images).toHaveLength(3)
  })

  test('iOS: a malformed Contents.json is replaced', async () => {
    writeFileSync(join(xcassets, 'Splash.imageset/Contents.json'), '{ oops')

    await mountCapacitor(ios)

    expect(warn.mock.calls[0][0]).toContain('Malformed')
    expect(readXcassets('Splash.imageset').images).toHaveLength(6)
  })

  test('installs the splash screen plugin when missing', async () => {
    writeFileSync(
      join(srcCapacitor, 'package.json'),
      JSON.stringify({ dependencies: {} })
    )

    await mountCapacitor(ios)
    expect(installPackage).toHaveBeenCalledWith('@capacitor/splash-screen')

    installPackage.mockClear()
    // icons alone do not need it
    await mountCapacitor(android.filter(file => file.generator === 'launcher'))
    expect(installPackage).not.toHaveBeenCalled()
  })

  test('warns when the plugin install fails', async () => {
    installPackage.mockResolvedValueOnce(false)

    await mountCapacitor(ios)

    expect(
      warn.mock.calls.some(call => call[0]?.includes('Please do it manually'))
    ).toBe(true)
  })
})

describe('verifyCapacitor', () => {
  test('Android launcher layers: referenced by an adaptive icon', async () => {
    await mountCapacitor(android)

    const foreground = android.find(file => file.variant === 'foreground')
    expect(stripAnsi(verifyCapacitor(foreground))).toBe('mounted')

    rmSync(join(androidRes, 'mipmap-anydpi-v26'), { recursive: true })
    expect(stripAnsi(verifyCapacitor(foreground))).toContain('ERROR')
  })

  test('Android launcher icons: referenced by the manifest', () => {
    const legacy = android.find(file => file.variant === 'legacy')
    const round = android.find(file => file.variant === 'round')

    expect(stripAnsi(verifyCapacitor(legacy))).toContain('AndroidManifest.xml')

    writeFileSync(
      join(androidMain, 'AndroidManifest.xml'),
      '<application android:icon="@mipmap/ic_launcher" />'
    )
    expect(stripAnsi(verifyCapacitor(legacy))).toBe('mounted')
    expect(stripAnsi(verifyCapacitor(round))).toContain('ERROR')
  })

  test('Android splash screens: referenced by the styles', () => {
    const splash = android.find(file => file.generator === 'splashscreen')

    expect(stripAnsi(verifyCapacitor(splash))).toContain('styles.xml')

    mkdirSync(join(androidRes, 'values'), { recursive: true })
    writeFileSync(
      join(androidRes, 'values/styles.xml'),
      '<item name="android:background">@drawable/splash</item>'
    )
    expect(stripAnsi(verifyCapacitor(splash))).toBe('mounted')
  })

  test('iOS: listed in the Contents.json of its folder', async () => {
    await mountCapacitor(ios)
    const dark = ios.find(file => file.dark === true)

    expect(stripAnsi(verifyCapacitor(dark))).toBe('mounted')

    await mountCapacitor(ios.filter(file => file.dark !== true))
    expect(stripAnsi(verifyCapacitor(dark))).toContain('Contents.json')
  })
})
