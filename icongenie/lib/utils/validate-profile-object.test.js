import { describe, expect, test, vi } from 'vitest'

import { modes } from '../modes/index.js'
import { validateProfileObject } from './validate-profile-object.js'
import sampleProfile from '../../samples/icongenie-profile.json' with { type: 'json' }

// an invalid profile exits the process; here it throws instead
vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`exit(${code})`)
})
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'log').mockImplementation(() => {})

function validate(profile, generatingProfileFile) {
  return () => validateProfileObject(profile, generatingProfileFile)
}

describe('validateProfileObject', () => {
  test('every built-in asset list is valid', () => {
    Object.keys(modes).forEach(mode => {
      expect(
        validate({ params: { include: [mode] }, assets: modes[mode].assets }),
        mode
      ).not.toThrow()
    })
  })

  test('the sample profile file is valid, before and after parsing', () => {
    expect(validate(sampleProfile, true)).not.toThrow()
    expect(validate(sampleProfile, false)).not.toThrow()
  })

  test('colors carry the hash only once parsed', () => {
    const hashed = { params: { pngColor: '#1976D2', svgColor: '#fff' } }
    const bare = { params: { pngColor: '1976D2', svgColor: 'fff' } }

    expect(validate(hashed, false)).not.toThrow()
    expect(validate(bare, true)).not.toThrow()
    expect(validate(hashed, true)).toThrow('exit(1)')
    expect(validate(bare, false)).toThrow('exit(1)')
    expect(validate({ params: { pngColor: '#12345' } }, false)).toThrow(
      'exit(1)'
    )
  })

  test('rejects out of range params', () => {
    expect(validate({ params: { quality: 13 } })).toThrow('exit(1)')
    expect(validate({ params: { include: [] } })).toThrow('exit(1)')
    expect(validate({ params: { include: ['nope'] } })).toThrow('exit(1)')
    expect(validate({ params: { filter: 'nope' } })).toThrow('exit(1)')
    expect(validate({ params: { padding: [1, 2, 3] } })).toThrow('exit(1)')
    expect(validate({ params: { padding: ['8px'] } })).toThrow('exit(1)')
    expect(validate({ params: { splashscreenIconRatio: 101 } })).toThrow(
      'exit(1)'
    )
    expect(validate({ params: { unknown: true } })).toThrow('exit(1)')
  })

  test('rejects malformed assets', () => {
    const png = {
      generator: 'png',
      name: 'icon-{size}.png',
      folder: 'public',
      sizes: [16]
    }

    expect(validate({ assets: [png] })).not.toThrow()
    expect(validate({ assets: [{ ...png, generator: 'nope' }] })).toThrow(
      'exit(1)'
    )
    expect(validate({ assets: [{ ...png, sizes: [] }] })).toThrow('exit(1)')
    expect(validate({ assets: [{ ...png, sizes: [[1, 2, 3]] }] })).toThrow(
      'exit(1)'
    )
    expect(validate({ assets: [{ ...png, platform: 'nope' }] })).toThrow(
      'exit(1)'
    )
    expect(validate({ assets: [{ ...png, appearance: 'light' }] })).toThrow(
      'exit(1)'
    )
    // android densities are part of the cordova config.xml entry
    expect(
      validate({ assets: [{ ...png, platform: 'cordova-android' }] })
    ).toThrow('exit(1)')
  })

  test('generator specific fields', () => {
    const launcher = {
      generator: 'launcher',
      name: 'ic_launcher.png',
      folder: 'res',
      sizes: [48]
    }
    expect(validate({ assets: [launcher] })).toThrow('exit(1)')
    expect(
      validate({ assets: [{ ...launcher, variant: 'legacy' }] })
    ).not.toThrow()
    expect(
      validate({
        assets: [{ ...launcher, variant: 'legacy', platform: 'cordova-ios' }]
      })
    ).toThrow('exit(1)')

    const splash = {
      generator: 'splashscreen',
      name: 'splash.png',
      folder: 'res',
      sizes: [[480, 320]],
      platform: 'capacitor-ios'
    }
    expect(validate({ assets: [splash] })).toThrow('exit(1)')
    expect(validate({ assets: [{ ...splash, scale: '2x' }] })).not.toThrow()
    expect(
      validate({ assets: [{ ...splash, scale: '2x', dark: true }] })
    ).not.toThrow()

    // size-less generators
    expect(
      validate({ assets: [{ generator: 'ico', name: 'a.ico', folder: 'x' }] })
    ).not.toThrow()
    expect(
      validate({ assets: [{ generator: 'svg', name: 'a.svg', folder: 'x' }] })
    ).not.toThrow()
  })
})
