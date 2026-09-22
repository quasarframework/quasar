import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test, vi } from 'vitest'

// the project folder is detected from the cwd when the module loads;
// without a quasar.config file up the tree, the cwd itself is used
// (realpath: process.cwd() reports the resolved path on macOS)
const projectFolder = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-assets-files-'))
)
process.chdir(projectFolder)

const { getAssetsFiles } = await import('./get-assets-files.js')

// an asset outside the project exits the process; here it throws instead
vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`exit(${code})`)
})
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})

afterAll(() => {
  process.chdir(tmpdir())
  rmSync(projectFolder, { recursive: true, force: true })
})

describe('getAssetsFiles', () => {
  test('expands each size into a file, square or not', () => {
    const files = getAssetsFiles([
      {
        generator: 'png',
        name: 'icon-{size}x{size}.png',
        folder: 'public/icons',
        sizes: [16, 32]
      },
      {
        generator: 'splashscreen',
        name: 'launch-{size}.png',
        folder: 'public/icons',
        sizes: [[1668, 2388]]
      }
    ])

    expect(files).toEqual([
      {
        generator: 'png',
        name: 'icon-16x16.png',
        folder: 'public/icons',
        width: 16,
        height: 16,
        relativeName: join('public/icons', 'icon-16x16.png'),
        absoluteName: join(projectFolder, 'public/icons', 'icon-16x16.png')
      },
      {
        generator: 'png',
        name: 'icon-32x32.png',
        folder: 'public/icons',
        width: 32,
        height: 32,
        relativeName: join('public/icons', 'icon-32x32.png'),
        absoluteName: join(projectFolder, 'public/icons', 'icon-32x32.png')
      },
      {
        generator: 'splashscreen',
        name: 'launch-1668x2388.png',
        folder: 'public/icons',
        width: 1668,
        height: 2388,
        relativeName: join('public/icons', 'launch-1668x2388.png'),
        absoluteName: join(
          projectFolder,
          'public/icons',
          'launch-1668x2388.png'
        )
      }
    ])
  })

  test('keeps the other fields and size-less assets as they are', () => {
    const files = getAssetsFiles([
      {
        generator: 'launcher',
        name: 'ic_launcher.png',
        folder: 'res/mipmap-mdpi',
        platform: 'capacitor-android',
        variant: 'legacy',
        sizes: [48]
      },
      { generator: 'ico', name: 'favicon.ico', folder: 'public' }
    ])

    expect(files[0]).toMatchObject({
      platform: 'capacitor-android',
      variant: 'legacy',
      width: 48,
      height: 48
    })
    expect(files[1]).toEqual({
      generator: 'ico',
      name: 'favicon.ico',
      folder: 'public',
      relativeName: join('public', 'favicon.ico'),
      absoluteName: join(projectFolder, 'public', 'favicon.ico')
    })
  })

  test('fills the tag placeholders from the resulting file', () => {
    const [file] = getAssetsFiles([
      {
        generator: 'png',
        name: 'favicon-{size}x{size}.png',
        folder: 'public/icons',
        sizes: [96],
        tag: '<link sizes="{size}x{size}" href="icons/{name}">'
      }
    ])

    expect(file.tag).toBe('<link sizes="96x96" href="icons/favicon-96x96.png">')
  })

  test('rejects assets that resolve outside the project folder', () => {
    const asset = { generator: 'ico', name: 'favicon.ico' }

    expect(() => getAssetsFiles([{ ...asset, folder: '../' }])).toThrow(
      'exit(1)'
    )
    expect(() => getAssetsFiles([{ ...asset, folder: tmpdir() }])).toThrow(
      'exit(1)'
    )
    expect(() =>
      getAssetsFiles([{ ...asset, folder: 'public/../../' }])
    ).toThrow('exit(1)')
    // the project folder itself is not a file
    expect(() => getAssetsFiles([{ ...asset, folder: '', name: '' }])).toThrow(
      'exit(1)'
    )
  })

  test('rejects a symbolic link pointing outside the project folder', () => {
    const outside = mkdtempSync(join(tmpdir(), 'icongenie-outside-'))
    mkdirSync(join(projectFolder, 'src'))
    symlinkSync(outside, join(projectFolder, 'src/statics'))

    try {
      expect(() =>
        getAssetsFiles([
          { generator: 'ico', name: 'favicon.ico', folder: 'src/statics' }
        ])
      ).toThrow('exit(1)')
      // not yet existing files are resolved through their closest
      // existing ancestor
      expect(() =>
        getAssetsFiles([
          { generator: 'ico', name: 'favicon.ico', folder: 'src/statics/icons' }
        ])
      ).toThrow('exit(1)')
      expect(() =>
        getAssetsFiles([
          { generator: 'ico', name: 'favicon.ico', folder: 'src/icons' }
        ])
      ).not.toThrow()
    } finally {
      rmSync(outside, { recursive: true, force: true })
    }
  })
})
