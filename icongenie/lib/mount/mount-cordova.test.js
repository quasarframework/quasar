import elementTree from 'elementtree'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest'

// the project folder is detected from the cwd when the module loads;
// without a quasar.config file up the tree, the cwd itself is used
const projectFolder = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-mount-cordova-'))
)
process.chdir(projectFolder)

const log = vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})

const { isCordovaFile, mountCordova, verifyCordova } =
  await import('./mount-cordova.js')
const { getAssetsFiles } = await import('../utils/get-assets-files.js')
const { modes } = await import('../modes/index.js')

// oxlint-disable-next-line no-control-regex -- stripping ANSI SGR sequences is the point
const stripAnsi = str => str.replaceAll(/\u001B\[\d+m/g, '')

const files = getAssetsFiles(modes.cordova.assets)
const android = files.filter(file => file.platform === 'cordova-android')
const ios = files.filter(file => file.platform === 'cordova-ios')

const srcCordova = join(projectFolder, 'src-cordova')
const configXml = join(srcCordova, 'config.xml')

const params = { splashscreenColor: '#abc' }

const legacyConfig = `<?xml version='1.0' encoding='utf-8'?>
<widget id="org.quasar.test" version="0.0.1" xmlns="http://www.w3.org/ns/widgets">
    <name>Test</name>
    <platform name="android">
        <icon density="ldpi" src="res/android/ldpi.png" />
        <icon src="res/android/gone.png" />
        <splash density="land-mdpi" src="res/screen/android/splash-land-mdpi.png" />
    </platform>
    <preference name="SplashMaintainAspectRatio" value="true" />
</widget>
`

function touch(list) {
  list.forEach(file => {
    mkdirSync(dirname(file.absoluteName), { recursive: true })
    writeFileSync(file.absoluteName, '')
  })
}

function readConfig() {
  return elementTree.parse(readFileSync(configXml, 'utf8')).getroot()
}

function platformNode(name) {
  return readConfig().find(`platform[@name="${name}"]`)
}

beforeEach(() => {
  log.mockClear()
})

afterAll(() => {
  process.chdir(tmpdir())
  rmSync(projectFolder, { recursive: true, force: true })
})

describe('isCordovaFile', () => {
  test('by platform and generator', () => {
    expect(
      isCordovaFile({ platform: 'cordova-android', generator: 'png' })
    ).toBe(true)
    expect(
      isCordovaFile({ platform: 'cordova-ios', generator: 'splashscreen' })
    ).toBe(true)
    expect(
      isCordovaFile({ platform: 'cordova-android', generator: 'launcher' })
    ).toBe(true)
    expect(isCordovaFile({ platform: 'cordova-ios', generator: 'svg' })).toBe(
      false
    )
    expect(isCordovaFile({ platform: 'capacitor-ios', generator: 'png' })).toBe(
      false
    )
  })
})

describe('mountCordova', () => {
  test('does nothing without a config.xml', () => {
    mountCordova(files, params)

    expect(log).not.toHaveBeenCalled()
    expect(stripAnsi(verifyCordova(android[0]))).toBe('')
  })

  test('registers every Android and iOS asset in config.xml', () => {
    mkdirSync(srcCordova, { recursive: true })
    writeFileSync(configXml, legacyConfig)
    touch(files)

    mountCordova(files, params)

    const androidNode = platformNode('android')
    const iosNode = platformNode('ios')
    expect(iosNode).toBeTruthy()

    // one <icon> per density, holding every launcher variant
    const icons = androidNode.findall('icon')
    expect(icons.map(node => node.get('density'))).toEqual([
      'ldpi',
      'mdpi',
      'hdpi',
      'xhdpi',
      'xxhdpi',
      'xxxhdpi'
    ])
    expect(icons[1].attrib).toEqual({
      density: 'mdpi',
      src: 'res/android/mdpi.png',
      foreground: 'res/android/mdpi-foreground.png',
      background: 'res/android/mdpi-background.png',
      monochrome: 'res/android/mdpi-monochrome.png'
    })

    // the Android 12 splash screen preferences
    expect(
      androidNode
        .find('preference[@name="AndroidWindowSplashScreenAnimatedIcon"]')
        .get('value')
    ).toBe('res/screen/android/splashscreen.png')
    expect(
      androidNode
        .find('preference[@name="AndroidWindowSplashScreenBackground"]')
        .get('value')
    ).toBe('#aabbcc')

    // the iOS icon with its appearance variants
    const iosIcons = iosNode.findall('icon')
    expect(iosIcons.map(node => node.attrib)).toEqual([
      { src: 'res/ios/icon.png' },
      { src: 'res/ios/icon-dark.png', foreground: 'true' },
      { src: 'res/ios/icon-tinted.png', monochrome: 'true' }
    ])

    // the iOS splash screens, dark ones included
    expect(iosNode.findall('splash')).toHaveLength(
      ios.filter(file => file.generator === 'splashscreen').length
    )
  })

  test('drops the cordova-plugin-splashscreen leftovers and stale entries', () => {
    writeFileSync(configXml, legacyConfig)

    mountCordova(files, params)

    const root = readConfig()
    const androidNode = root.find('platform[@name="android"]')

    expect(androidNode.findall('splash')).toHaveLength(0)
    expect(
      root.findall('preference[@name="SplashMaintainAspectRatio"]')
    ).toHaveLength(0)
    // an entry whose file does not exist
    expect(
      androidNode.findall('icon[@src="res/android/gone.png"]')
    ).toHaveLength(0)
    // the existing density entry was reused, not duplicated
    expect(androidNode.findall('icon[@density="ldpi"]')).toHaveLength(1)

    const messages = log.mock.calls.map(call => stripAnsi(call[0]))
    expect(
      messages.some(msg =>
        msg.includes('Removed the legacy Android <splash> entries')
      )
    ).toBe(true)
    expect(
      messages.some(msg =>
        msg.includes('Removed the SplashMaintainAspectRatio preference')
      )
    ).toBe(true)
    expect(
      messages.some(msg => msg.includes('<icon src="res/android/gone.png">'))
    ).toBe(true)
    expect(
      messages.some(msg =>
        msg.includes('<splash src="res/screen/android/splash-land-mdpi.png">')
      )
    ).toBe(false)
  })

  test('a six digit color is kept as is', () => {
    mountCordova(files, { splashscreenColor: '#123456' })

    expect(
      platformNode('android')
        .find('preference[@name="AndroidWindowSplashScreenBackground"]')
        .get('value')
    ).toBe('#123456')
  })

  test('mounting again does not duplicate entries', () => {
    mountCordova(files, params)
    mountCordova(files, params)

    expect(platformNode('android').findall('icon')).toHaveLength(6)
    expect(platformNode('ios').findall('icon')).toHaveLength(3)
    expect(readConfig().findall('platform')).toHaveLength(2)
  })

  test('creates the platform nodes when missing', () => {
    writeFileSync(
      configXml,
      `<?xml version='1.0' encoding='utf-8'?>\n<widget id="x"><name>Test</name></widget>\n`
    )

    mountCordova(ios, params)

    expect(platformNode('ios').findall('icon')).toHaveLength(3)
    // both platform nodes are created, even when there is nothing to
    // register for one of them
    expect(platformNode('android').findall('icon')).toHaveLength(0)
  })
})

describe('verifyCordova', () => {
  test('every mounted asset', () => {
    writeFileSync(configXml, legacyConfig)
    mountCordova(files, params)

    files.forEach(file => {
      expect(stripAnsi(verifyCordova(file)), file.relativeName).toBe('mounted')
    })
  })

  test('a platform that is not installed', () => {
    writeFileSync(
      configXml,
      `<?xml version='1.0' encoding='utf-8'?>\n<widget id="x"><platform name="ios" /></widget>\n`
    )

    expect(stripAnsi(verifyCordova(android[0]))).toBe(
      'ERROR: platform not installed!'
    )
    expect(stripAnsi(verifyCordova(ios[0]))).toContain('ERROR')
  })

  test('an asset that is not registered', () => {
    writeFileSync(configXml, legacyConfig)
    mountCordova(
      files.filter(file => file.variant !== 'maskable'),
      params
    )

    const maskable = android.find(file => file.variant === 'maskable')
    const dark = ios.find(file => file.dark === true)
    const legacyIcon = android.find(file => file.variant === 'legacy')

    expect(stripAnsi(verifyCordova(maskable))).toContain(
      'AndroidWindowSplashScreenAnimatedIcon'
    )
    expect(stripAnsi(verifyCordova(dark))).toBe('mounted')
    expect(stripAnsi(verifyCordova(legacyIcon))).toBe('mounted')

    // a legacy <splash> is no longer used on Android
    expect(
      stripAnsi(
        verifyCordova({
          platform: 'cordova-android',
          generator: 'splashscreen',
          absoluteName: join(srcCordova, 'res/screen/android/splash.png')
        })
      )
    ).toContain('cordova-android >= 11')
  })
})
