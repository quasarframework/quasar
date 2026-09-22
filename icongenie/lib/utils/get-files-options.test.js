import { resolve } from 'node:path'
import { BICUBIC2, HERMITE } from 'png2icons'
import sharp from 'sharp'
import { describe, expect, test } from 'vitest'

import { getFilesOptions } from './get-files-options.js'

const icon = resolve(import.meta.dirname, '../../samples/icongenie-icon.png')

const baseParams = {
  quality: 5,
  icon,
  pngColor: '#fff',
  splashscreenColor: '#fff'
}

describe('getFilesOptions', () => {
  test('parses the colors to rgb, the dark one only when given', async () => {
    const opts = await getFilesOptions({
      ...baseParams,
      pngColor: '#abc',
      splashscreenColor: '#112233'
    })

    expect(opts.pngColor).toEqual({ r: 170, g: 187, b: 204, alpha: 1 })
    expect(opts.splashscreenColor).toEqual({ r: 17, g: 34, b: 51, alpha: 1 })
    expect(opts.splashscreenDarkColor).toBeNull()

    const dark = await getFilesOptions({
      ...baseParams,
      splashscreenDarkColor: '#000'
    })
    expect(dark.splashscreenDarkColor).toEqual({ r: 0, g: 0, b: 0, alpha: 1 })
  })

  test('normalizes the padding pair', async () => {
    const cases = [
      [void 0, { horiz: 0, vert: 0 }],
      [['8%'], { horiz: '8%', vert: '8%' }],
      [[10, 5], { horiz: 10, vert: 5 }]
    ]

    for (const [padding, expected] of cases) {
      const { padding: computed } = await getFilesOptions({
        ...baseParams,
        padding
      })
      expect(computed).toEqual(expected)
    }
  })

  test('picks the compression from the quality level', async () => {
    const mid = await getFilesOptions(baseParams)
    expect(mid.compression.ico).toBe(BICUBIC2)
    expect(mid.compression.png).toBeInstanceOf(Function)

    // the string form of a profile file
    const max = await getFilesOptions({ ...baseParams, quality: '12' })
    expect(max.compression.ico).toBe(HERMITE)
    // the highest level skips the png minification
    expect(max.compression.png('unused')).toBeUndefined()
  })

  test('derives the monochrome layer from the icon shape', async () => {
    const opts = await getFilesOptions(baseParams)

    // the icon buffer is the trimmed icon
    const { width, height } = await sharp(opts.iconBuffer).metadata()
    const { data, info } = await opts.iconMonochrome
      .raw()
      .toBuffer({ resolveWithObject: true })

    expect([info.width, info.height]).toEqual([width, height])
    expect(info.channels).toBe(4)

    const iconAlpha = await sharp(opts.iconBuffer)
      .ensureAlpha()
      .extractChannel(3)
      .raw()
      .toBuffer()

    for (let i = 0; i < data.length; i += 4) {
      // black everywhere, with the icon's own alpha
      expect(data[i] | data[i + 1] | data[i + 2]).toBe(0)
      expect(data[i + 3]).toBe(iconAlpha[i / 4])
    }
  })

  test('uses the given monochrome icon as is', async () => {
    const opts = await getFilesOptions({
      ...baseParams,
      iconMonochrome: icon,
      skipTrim: true
    })

    const { data: a } = await opts.iconMonochrome
      .raw()
      .toBuffer({ resolveWithObject: true })
    const { data: b } = await sharp(icon)
      .raw()
      .toBuffer({ resolveWithObject: true })

    expect(Buffer.compare(a, b)).toBe(0)
  })

  test('without a background file, the background is a transparent canvas', async () => {
    const opts = await getFilesOptions(baseParams)
    const stats = await opts.background.stats()

    expect(stats.isOpaque).toBe(false)
    expect(stats.channels[3].max).toBe(0)
    // the dark background falls back to the light one
    expect(opts.backgroundDark).toBe(opts.background)
  })
})
