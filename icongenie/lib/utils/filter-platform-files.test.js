import { mkdirSync, mkdtempSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest'

// the project folder is detected from the cwd when the module loads;
// without a quasar.config file up the tree, the cwd itself is used
const projectFolder = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-platform-files-'))
)
process.chdir(projectFolder)

const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

const { filterPlatformFiles } = await import('./filter-platform-files.js')

const files = [
  { name: 'favicon.ico' },
  { name: 'ic_launcher.png', platform: 'capacitor-android' },
  { name: 'ic_launcher_round.png', platform: 'capacitor-android' },
  { name: 'AppIcon.png', platform: 'capacitor-ios' },
  { name: 'icon.png', platform: 'cordova-ios' },
  { name: 'mdpi.png', platform: 'cordova-android' }
]

beforeEach(() => {
  warnSpy.mockClear()
})

afterAll(() => {
  process.chdir(tmpdir())
  rmSync(projectFolder, { recursive: true, force: true })
})

describe('filterPlatformFiles', () => {
  test('drops the Capacitor platforms that were not added, once each', () => {
    expect(filterPlatformFiles(files)).toEqual([files[0], files[4], files[5]])

    expect(warnSpy).toHaveBeenCalledTimes(2)
    expect(warnSpy.mock.calls[0][0]).toContain('capacitor-android')
    expect(warnSpy.mock.calls[1][0]).toContain('capacitor-ios')
  })

  test('keeps the files of the platforms present', () => {
    mkdirSync(join(projectFolder, 'src-capacitor/android'), {
      recursive: true
    })

    expect(filterPlatformFiles(files)).toEqual([
      files[0],
      files[1],
      files[2],
      files[4],
      files[5]
    ])
    expect(warnSpy).toHaveBeenCalledOnce()

    mkdirSync(join(projectFolder, 'src-capacitor/ios'), { recursive: true })
    expect(filterPlatformFiles(files)).toEqual(files)
  })
})
