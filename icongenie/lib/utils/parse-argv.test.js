import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

// the project folder is detected from the cwd when the module loads;
// without a quasar.config file up the tree, the cwd itself is used
// (realpath: process.cwd() reports the resolved path on macOS)
const projectFolder = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-parse-argv-'))
)
process.chdir(projectFolder)

const { parseArgv } = await import('./parse-argv.js')
const { defaultParams } = await import('./default-params.js')
const { modes } = await import('../modes/index.js')

const sampleIcon = resolve(
  import.meta.dirname,
  '../../samples/icongenie-icon.png'
)
const modesList = Object.keys(modes)

// a rejected param exits the process; here it throws instead
vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`exit(${code})`)
})
const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

function lastWarning() {
  // die() warns the reason, then an empty line
  return warnSpy.mock.calls.at(-2)[0]
}

function parse(argv, list) {
  parseArgv(argv, list)
  return argv
}

beforeAll(async () => {
  await sharp({
    create: { width: 32, height: 32, channels: 4, background: '#f00' }
  })
    .png()
    .toFile(join(projectFolder, 'small.png'))

  writeFileSync(join(projectFolder, 'not-a-png.png'), 'plain text')
})

afterAll(() => {
  rmSync(projectFolder, { recursive: true, force: true })
})

describe('parseArgv', () => {
  test('rejects an unknown param name', () => {
    expect(() => parse({}, ['bogus'])).toThrow('exit(1)')
  })

  describe('mode / include / assets', () => {
    test('default to every mode', () => {
      expect(parse({}, ['mode']).mode).toEqual(modesList)
      expect(parse({}, ['assets']).assets).toEqual([])
      expect(parse({}, ['include']).include).toBeUndefined()
    })

    test('"all" expands to every mode', () => {
      expect(parse({ mode: 'all' }, ['mode']).mode).toEqual(modesList)
      expect(parse({ assets: 'spa,all' }, ['assets']).assets).toEqual(modesList)
      expect(parse({ include: ['all'] }, ['include']).include).toEqual(
        modesList
      )
    })

    test('a comma separated list is split', () => {
      expect(parse({ mode: 'spa,pwa' }, ['mode']).mode).toEqual(['spa', 'pwa'])
      expect(parse({ assets: 'bex' }, ['assets']).assets).toEqual(['bex'])
      // the profile file already holds an array
      expect(parse({ include: ['spa'] }, ['include']).include).toEqual(['spa'])
    })

    test('rejects an unknown mode', () => {
      expect(() => parse({ mode: 'spa,nope' }, ['mode'])).toThrow('exit(1)')
      expect(() => parse({ assets: 'nope' }, ['assets'])).toThrow('exit(1)')
      expect(() => parse({ include: ['nope'] }, ['include'])).toThrow('exit(1)')
    })
  })

  describe('quality', () => {
    test('defaults and parses the number', () => {
      expect(parse({}, ['quality']).quality).toBe(defaultParams.quality)
      expect(parse({ quality: '7' }, ['quality']).quality).toBe(7)
    })

    test('rejects values outside 1 - 12', () => {
      expect(() => parse({ quality: '0' }, ['quality'])).toThrow('exit(1)')
      expect(() => parse({ quality: '13' }, ['quality'])).toThrow('exit(1)')
      expect(() => parse({ quality: 'high' }, ['quality'])).toThrow('exit(1)')
    })
  })

  describe('filter', () => {
    test('accepts a generator name only', () => {
      expect(parse({ filter: 'png' }, ['filter']).filter).toBe('png')
      expect(() => parse({ filter: 'nope' }, ['filter'])).toThrow('exit(1)')
    })
  })

  describe('padding', () => {
    test('defaults to none', () => {
      expect(parse({}, ['padding']).padding).toEqual([0, 0])
    })

    test('one value applies to both axes', () => {
      expect(parse({ padding: '10' }, ['padding']).padding).toEqual([10, 10])
      expect(parse({ padding: '8%' }, ['padding']).padding).toEqual([
        '8%',
        '8%'
      ])
    })

    test('two values are horizontal then vertical, pixels or percentages', () => {
      expect(parse({ padding: '10,5' }, ['padding']).padding).toEqual([10, 5])
      expect(parse({ padding: '12.5%, 4' }, ['padding']).padding).toEqual([
        '12.5%',
        4
      ])
      // the profile file holds it as an array
      expect(parse({ padding: [3, '4%'] }, ['padding']).padding).toEqual([
        3,
        '4%'
      ])
    })

    test('rejects negative sizes, percentages of 50 and above, and a third value', () => {
      expect(() => parse({ padding: '-1' }, ['padding'])).toThrow('exit(1)')
      expect(() => parse({ padding: '50%' }, ['padding'])).toThrow('exit(1)')
      expect(() => parse({ padding: 'abc' }, ['padding'])).toThrow('exit(1)')
      expect(() => parse({ padding: '1,2,3' }, ['padding'])).toThrow('exit(1)')
    })
  })

  describe('icon files', () => {
    test('falls back to the sample icon', () => {
      expect(parse({}, ['icon']).icon).toBe(sampleIcon)
    })

    test('resolves a relative path against the cwd, then the project folder', () => {
      const nested = join(projectFolder, 'nested')
      mkdirSync(nested)
      process.chdir(nested)

      try {
        // found in the project folder (the cwd has no such file),
        // then rejected for its size
        expect(() => parse({ icon: 'small.png' }, ['icon'])).toThrow('exit(1)')
        expect(lastWarning()).toContain('minimum 64x64')
      } finally {
        process.chdir(projectFolder)
      }

      expect(parse({ icon: sampleIcon }, ['icon']).icon).toBe(sampleIcon)
    })

    test('rejects a missing, non-png or too small icon', () => {
      expect(() => parse({ icon: 'missing.png' }, ['icon'])).toThrow('exit(1)')
      expect(lastWarning()).toContain('does not exists')

      expect(() => parse({ icon: 'not-a-png.png' }, ['icon'])).toThrow(
        'exit(1)'
      )
      expect(lastWarning()).toContain('not a PNG')

      expect(() => parse({ icon: 'small.png' }, ['icon'])).toThrow('exit(1)')
      expect(lastWarning()).toContain('minimum 64x64')
      expect(() =>
        parse({ iconMonochrome: 'small.png' }, ['iconMonochrome'])
      ).toThrow('exit(1)')
    })

    test('the optional files stay unset without a value', () => {
      const argv = parse({}, ['iconMonochrome', 'background', 'backgroundDark'])
      expect(argv).toEqual({})
    })

    test('backgrounds need 128px, not 64px', () => {
      expect(() => parse({ background: 'small.png' }, ['background'])).toThrow(
        'exit(1)'
      )
      expect(
        parse({ backgroundDark: sampleIcon }, ['backgroundDark']).backgroundDark
      ).toBe(sampleIcon)
    })
  })

  describe('colors', () => {
    const list = [
      'themeColor',
      'pngColor',
      'splashscreenColor',
      'splashscreenDarkColor',
      'svgColor'
    ]

    test('applies the defaults and no dark color', () => {
      expect(parse({}, list)).toEqual({
        themeColor: void 0,
        pngColor: defaultParams.pngColor,
        splashscreenColor: defaultParams.splashscreenColor,
        svgColor: defaultParams.svgColor
      })
    })

    test('the theme color backs every unset generator color', () => {
      const argv = parse({ themeColor: 'abc', svgColor: '1976D2' }, list)

      expect(argv.themeColor).toBe('#abc')
      expect(argv.pngColor).toBe('#abc')
      expect(argv.splashscreenColor).toBe('#abc')
      expect(argv.svgColor).toBe('#1976D2')
      expect(argv.splashscreenDarkColor).toBeUndefined()
    })

    test('the dark color is only ever explicit', () => {
      expect(
        parse({ themeColor: 'abc', splashscreenDarkColor: '000' }, list)
          .splashscreenDarkColor
      ).toBe('#000')
    })

    test('rejects anything but 3 or 6 hex digits', () => {
      expect(() => parse({ pngColor: '#abc' }, ['pngColor'])).toThrow('exit(1)')
      expect(() => parse({ pngColor: 'abcd' }, ['pngColor'])).toThrow('exit(1)')
      expect(() => parse({ svgColor: 'red' }, ['svgColor'])).toThrow('exit(1)')
    })
  })

  describe('splashscreenIconRatio', () => {
    test('defaults, keeps an explicit 0 and parses the number', () => {
      const name = 'splashscreenIconRatio'

      expect(parse({}, [name])[name]).toBe(defaultParams.splashscreenIconRatio)
      expect(parse({ [name]: 0 }, [name])[name]).toBe(0)
      expect(parse({ [name]: '0' }, [name])[name]).toBe(0)
      expect(parse({ [name]: '33.3' }, [name])[name]).toBe(33.3)
    })

    test('rejects values outside 0 - 100', () => {
      const name = 'splashscreenIconRatio'

      expect(() => parse({ [name]: '101' }, [name])).toThrow('exit(1)')
      expect(() => parse({ [name]: 'big' }, [name])).toThrow('exit(1)')
    })
  })

  describe('profile', () => {
    test('resolves a json file or a folder against the cwd', () => {
      const file = join(projectFolder, 'icongenie-test.json')
      writeFileSync(file, '{}')

      expect(
        parse({ profile: 'icongenie-test.json' }, ['profile']).profile
      ).toBe(file)
      expect(parse({ profile: '.' }, ['profile']).profile).toBe(projectFolder)
    })

    test('rejects a missing path or a non-json file', () => {
      expect(() => parse({ profile: 'missing.json' }, ['profile'])).toThrow(
        'exit(1)'
      )
      expect(() => parse({ profile: 'quasar.config.js' }, ['profile'])).toThrow(
        'exit(1)'
      )
    })
  })

  test('the output param is required', () => {
    expect(() => parse({}, ['output'])).toThrow('exit(1)')
    expect(parse({ output: 'x' }, ['output']).output).toBe('x')
  })
})
