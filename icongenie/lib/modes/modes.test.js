import { mkdirSync, mkdtempSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test, vi } from 'vitest'

import { generators } from '../generators/index.js'
import { getAssetsFiles } from '../utils/get-assets-files.js'
import { modes } from './index.js'
import { retired } from './v2/cordova.js'

vi.spyOn(console, 'warn').mockImplementation(() => {})

const modeNames = Object.keys(modes)

describe('modes', () => {
  test('every mode names its source folder and its assets', () => {
    expect(modeNames).toEqual([
      'spa',
      'pwa',
      'ssr',
      'ssg',
      'bex',
      'cordova',
      'capacitor',
      'electron'
    ])

    modeNames.forEach(name => {
      expect(modes[name].folder, name).toMatch(/^\/src/)
      expect(modes[name].assets.length, name).toBeGreaterThan(0)
    })
  })

  test('every asset uses a known generator and expands to a unique file', () => {
    modeNames.forEach(name => {
      const files = getAssetsFiles(modes[name].assets)
      const paths = files.map(file => file.relativeName)

      expect(new Set(paths).size, name).toBe(paths.length)
      files.forEach(file => {
        expect(Object.keys(generators), file.relativeName).toContain(
          file.generator
        )
        // no placeholder left behind
        expect(file.relativeName).not.toContain('{')
      })
    })
  })

  test('the sized generators get a size, the others never do', () => {
    modeNames.forEach(name => {
      modes[name].assets.forEach(asset => {
        const sized = ['png', 'splashscreen', 'launcher'].includes(
          asset.generator
        )
        expect(asset.sizes !== void 0, `${name}: ${asset.name}`).toBe(sized)
      })
    })
  })

  test('each mode writes into its own folders', () => {
    const roots = {
      spa: ['public'],
      ssr: ['public'],
      ssg: ['public'],
      pwa: ['public'],
      bex: ['src-bex'],
      cordova: ['src-cordova'],
      capacitor: ['src-capacitor'],
      electron: ['src-electron']
    }

    modeNames.forEach(name => {
      modes[name].assets.forEach(asset => {
        expect(
          roots[name].some(root => asset.folder.startsWith(root)),
          `${name}: ${asset.folder}`
        ).toBe(true)
      })
    })
  })

  test('the ssr and ssg assets are the spa ones', () => {
    expect(modes.ssr.assets).toEqual(modes.spa.assets)
    expect(modes.ssg.assets).toEqual(modes.spa.assets)
  })

  test('pwa: the launch images carry a media query tag for their device', () => {
    const launches = modes.pwa.assets.filter(asset =>
      asset.name.startsWith('apple-launch-')
    )

    expect(launches.length).toBeGreaterThan(0)
    launches.forEach(asset => {
      const [[width, height]] = asset.sizes
      const ratio = asset.tag.match(/-webkit-device-pixel-ratio: (\d)\)/)[1]

      expect(asset.tag).toContain(`device-width: ${width / ratio}px`)
      expect(asset.tag).toContain(`device-height: ${height / ratio}px`)
      expect(asset.tag).toContain('<!--')
    })
  })

  test('the cordova dark splash screens mirror the light ones', () => {
    const splashes = modes.cordova.assets.filter(
      asset => asset.generator === 'splashscreen'
    )
    const light = splashes.filter(asset => asset.dark !== true)
    const dark = splashes.filter(asset => asset.dark === true)

    expect(dark.map(asset => asset.name)).toEqual(
      light.map(asset => asset.name.replace(/\.png$/, '~dark.png'))
    )
    expect(dark.map(asset => asset.sizes)).toEqual(
      light.map(asset => asset.sizes)
    )
  })

  test('the capacitor night resources mirror the day ones', () => {
    const splashes = modes.capacitor.assets.filter(
      asset =>
        asset.generator === 'splashscreen' &&
        asset.platform === 'capacitor-android'
    )
    const day = splashes.filter(asset => asset.dark !== true)
    const night = splashes.filter(asset => asset.dark === true)

    expect(night.map(asset => asset.folder)).toEqual(
      day.map(asset =>
        asset.folder.replace(/drawable(-land|-port)?/, 'drawable$1-night')
      )
    )
  })

  test('the retired cordova files are not current ones', () => {
    const current = new Set(
      getAssetsFiles(modes.cordova.assets).map(file => file.relativeName)
    )

    expect(retired.length).toBeGreaterThan(0)
    retired.forEach(name => {
      expect(current.has(name), name).toBe(false)
    })
  })
})

describe('electron', () => {
  const workDir = realpathSync(
    mkdtempSync(join(tmpdir(), 'icongenie-modes-electron-'))
  )

  // the module picks the folder when it loads, from the project's layout
  async function load(layout) {
    const project = join(workDir, layout.replaceAll('/', '-') || 'none')
    mkdirSync(join(project, 'src-electron', layout), { recursive: true })
    process.chdir(project)
    vi.resetModules()
    const { default: assets } = await import('./v2/electron.js')
    return assets
  }

  afterAll(() => {
    process.chdir(tmpdir())
    rmSync(workDir, { recursive: true, force: true })
  })

  test('targets the icons folder of the installed app-vite version', async () => {
    const cases = [
      ['electron-assets/icons', 'src-electron/electron-assets/icons'],
      ['icons', 'src-electron/icons'],
      ['', 'src-electron/electron-assets']
    ]

    for (const [layout, folder] of cases) {
      const [icns] = await load(layout)
      expect(icns.folder, layout).toBe(folder)
    }
  })
})
