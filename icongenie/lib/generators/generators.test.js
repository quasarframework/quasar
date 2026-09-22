import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

import { generators } from './index.js'
import { launcherVariants } from './launcher.js'
import { getFilesOptions } from '../utils/get-files-options.js'
import { getPngSize } from '../utils/get-png-size.js'

const sampleIcon = resolve(
  import.meta.dirname,
  '../../samples/icongenie-icon.png'
)
const workDir = mkdtempSync(join(tmpdir(), 'icongenie-generators-'))

vi.spyOn(console, 'warn').mockImplementation(() => {})

const pngColor = { r: 17, g: 34, b: 51, alpha: 1 }
const splashscreenColor = { r: 0, g: 128, b: 0, alpha: 1 }
const splashscreenDarkColor = { r: 20, g: 20, b: 20, alpha: 1 }

let opts

function generate(generator, file, overrides = {}) {
  const target = {
    ...file,
    absoluteName: join(workDir, file.name),
    relativeName: file.name
  }

  return new Promise(resolveDone => {
    generators[generator](target, { ...opts, ...overrides }, () =>
      resolveDone(target.absoluteName)
    )
  })
}

async function pixels(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info

  return {
    width,
    height,
    // [ r, g, b, alpha ] of the pixel at (x, y)
    at: (x, y) => [...data.subarray((y * width + x) * channels).subarray(0, 4)],
    every: predicate => {
      for (let i = 0; i < data.length; i += channels) {
        if (!predicate([...data.subarray(i, i + 4)])) return false
      }
      return true
    }
  }
}

beforeAll(async () => {
  // the highest quality skips the (lossy) png palette minification,
  // so the pixels can be asserted exactly
  opts = await getFilesOptions({
    quality: 12,
    icon: sampleIcon,
    background: sampleIcon,
    pngColor: '#112233',
    splashscreenColor: '#008000',
    splashscreenDarkColor: '#141414',
    splashscreenIconRatio: 40
  })
})

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

describe('png', () => {
  test('a transparent square of the requested size', async () => {
    const file = await generate('png', {
      name: 'icon-96.png',
      width: 96,
      height: 96
    })
    const img = await pixels(file)

    expect(getPngSize(file)).toEqual({ width: 96, height: 96 })
    expect(img.at(0, 0)[3]).toBe(0)
    expect(img.every(pixel => pixel[3] === 0)).toBe(false)
  })

  test('with a background it is flattened on the png color', async () => {
    const file = await generate('png', {
      name: 'apple-icon.png',
      width: 64,
      height: 64,
      background: true
    })
    const img = await pixels(file)

    expect(img.at(0, 0)).toEqual([pngColor.r, pngColor.g, pngColor.b, 255])
    expect(img.every(pixel => pixel[3] === 255)).toBe(true)
  })

  test('the tinted appearance is grayscale', async () => {
    const file = await generate('png', {
      name: 'icon-tinted.png',
      width: 64,
      height: 64,
      appearance: 'tinted'
    })
    const img = await pixels(file)

    expect(img.every(([r, g, b]) => r === g && g === b)).toBe(true)
  })
})

describe('ico', () => {
  test('mixed layout: small entries as bitmaps, the large one as png', async () => {
    const file = await generate('ico', { name: 'favicon.ico' })
    const buffer = readFileSync(file)

    // ICONDIR: reserved, type 1 (icon), count
    expect(buffer.readUInt16LE(0)).toBe(0)
    expect(buffer.readUInt16LE(2)).toBe(1)
    const count = buffer.readUInt16LE(4)
    expect(count).toBeGreaterThan(1)

    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47])
    const sizes = []

    for (let i = 0; i < count; i++) {
      const entry = 6 + i * 16
      // a width byte of 0 stands for 256
      const width = buffer[entry] || 256
      const offset = buffer.readUInt32LE(entry + 12)
      const isPng = buffer.subarray(offset, offset + 4).equals(pngSignature)

      sizes.push(width)
      expect(isPng, `${width}px entry`).toBe(width > 48)
    }

    expect(sizes).toContain(16)
    expect(sizes).toContain(32)
    expect(sizes).toContain(48)
    expect(sizes).toContain(256)
  })
})

describe('icns', () => {
  test('an icns container', async () => {
    const file = await generate('icns', { name: 'icon.icns' })
    const buffer = readFileSync(file)

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('icns')
    expect(buffer.readUInt32BE(4)).toBe(buffer.length)
    // holds the 512px@2x entry: a full 1024px source
    expect(buffer.includes('ic10')).toBe(true)
  })
})

describe('splashscreen', () => {
  test('the background at the requested size, filled with the color', async () => {
    const file = await generate(
      'splashscreen',
      { name: 'splash.png', width: 200, height: 120 },
      { splashscreenIconRatio: 0, background: opts.backgroundDark }
    )
    const img = await pixels(file)

    expect([img.width, img.height]).toEqual([200, 120])
    // no background file (a transparent canvas): the color only
    const noFile = await pixels(
      await generate(
        'splashscreen',
        { name: 'splash-plain.png', width: 40, height: 40 },
        {
          splashscreenIconRatio: 0,
          background: sharp({
            create: {
              width: 4,
              height: 4,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
          })
        }
      )
    )
    const green = [
      splashscreenColor.r,
      splashscreenColor.g,
      splashscreenColor.b,
      255
    ]
    expect(noFile.every(pixel => pixel.every((v, i) => v === green[i]))).toBe(
      true
    )
  })

  test('the icon is composed at the ratio of the smaller side', async () => {
    const transparent = sharp({
      create: {
        width: 4,
        height: 4,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    const file = await generate(
      'splashscreen',
      { name: 'splash-icon.png', width: 300, height: 100 },
      { background: transparent, splashscreenIconRatio: 50 }
    )
    const img = await pixels(file)
    const green = [
      splashscreenColor.r,
      splashscreenColor.g,
      splashscreenColor.b,
      255
    ]

    // a 50px icon centered in a 300x100 canvas: columns 125 to 175
    expect(img.at(100, 50)).toEqual(green)
    expect(img.at(200, 50)).toEqual(green)
    expect(img.at(150, 50)).not.toEqual(green)
  })

  test('the dark variant uses the dark color and background', async () => {
    const transparent = sharp({
      create: {
        width: 4,
        height: 4,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    const file = await generate(
      'splashscreen',
      { name: 'splash-dark.png', width: 40, height: 40, dark: true },
      { backgroundDark: transparent, splashscreenIconRatio: 0 }
    )
    const img = await pixels(file)

    expect(img.at(0, 0)).toEqual([
      splashscreenDarkColor.r,
      splashscreenDarkColor.g,
      splashscreenDarkColor.b,
      255
    ])
  })
})

describe('svg', () => {
  test('a traced, optimized svg in the svg color', async () => {
    const file = await generate(
      'svg',
      { name: 'safari-pinned-tab.svg' },
      {
        svgColor: '#1976D2'
      }
    )
    const content = readFileSync(file, 'utf8')

    expect(content.startsWith('<svg')).toBe(true)
    expect(content).toMatch(/fill="#1976d2"/i)
    expect(content).toContain('<path')
    // svgo output: single line, no xml prolog
    expect(content).not.toContain('\n')
  })
})

describe('launcher', () => {
  const size = 108
  const safe = Math.round(size * (66 / 108))
  const offset = Math.round((size - safe) / 2)

  test('the variants are the ones the profile schema accepts', () => {
    expect(launcherVariants).toEqual([
      'foreground',
      'background',
      'monochrome',
      'maskable',
      'legacy',
      'round'
    ])
  })

  test('foreground: the icon inside the safe zone of a transparent canvas', async () => {
    const img = await pixels(
      await generate('launcher', {
        name: 'fg.png',
        width: size,
        height: size,
        variant: 'foreground'
      })
    )

    expect([img.width, img.height]).toEqual([size, size])
    expect(img.at(offset - 1, size / 2)[3]).toBe(0)
    expect(img.at(size - offset, size / 2)[3]).toBe(0)
    expect(img.at(size / 2, offset - 1)[3]).toBe(0)
    expect(img.at(size / 2, size / 2)[3]).not.toBe(0)
  })

  test('monochrome: the same geometry, in black', async () => {
    const img = await pixels(
      await generate('launcher', {
        name: 'mono.png',
        width: size,
        height: size,
        variant: 'monochrome'
      })
    )

    expect(img.at(offset - 1, size / 2)[3]).toBe(0)
    expect(img.every(([r, g, b]) => r === 0 && g === 0 && b === 0)).toBe(true)
    expect(img.at(size / 2, size / 2)[3]).not.toBe(0)
  })

  test('background: the background file flattened on the png color', async () => {
    const img = await pixels(
      await generate('launcher', {
        name: 'bg.png',
        width: size,
        height: size,
        variant: 'background'
      })
    )

    expect([img.width, img.height]).toEqual([size, size])
    expect(img.every(pixel => pixel[3] === 255)).toBe(true)
    // the sample icon has transparent corners: the color shows there
    expect(img.at(0, 0)).toEqual([pngColor.r, pngColor.g, pngColor.b, 255])
  })

  test('maskable: the foreground over the background', async () => {
    const img = await pixels(
      await generate('launcher', {
        name: 'maskable.png',
        width: size,
        height: size,
        variant: 'maskable'
      })
    )

    expect(img.every(pixel => pixel[3] === 255)).toBe(true)
    expect(img.at(0, 0)).toEqual([pngColor.r, pngColor.g, pngColor.b, 255])
  })

  test('legacy: the 72dp viewport of the layered canvas', async () => {
    const img = await pixels(
      await generate('launcher', {
        name: 'legacy.png',
        width: 48,
        height: 48,
        variant: 'legacy'
      })
    )

    expect([img.width, img.height]).toEqual([48, 48])
    expect(img.every(pixel => pixel[3] === 255)).toBe(true)
  })

  test('round: the legacy icon clipped to a circle', async () => {
    const img = await pixels(
      await generate('launcher', {
        name: 'round.png',
        width: 48,
        height: 48,
        variant: 'round'
      })
    )

    expect([img.width, img.height]).toEqual([48, 48])
    expect(img.at(0, 0)[3]).toBe(0)
    expect(img.at(47, 47)[3]).toBe(0)
    expect(img.at(24, 24)[3]).toBe(255)
    expect(img.at(24, 1)[3]).toBe(255)
  })
})
