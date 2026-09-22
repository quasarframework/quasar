import sharp from 'sharp'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { getSquareIcon } from './get-square-icon.js'

// an opaque 2:1 icon: "contain" leaves transparent bands above and
// below it, so every pixel is either fully opaque or fully transparent
const icon = sharp({
  create: {
    width: 64,
    height: 32,
    channels: 4,
    background: { r: 255, g: 0, b: 0, alpha: 1 }
  }
})
const file = { relativeName: 'public/icons/test.png' }

const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

async function render(opts) {
  const { data, info } = await getSquareIcon({ file, icon, ...opts })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info

  return {
    width,
    height,
    // alpha of the pixel at (x, y)
    alphaAt: (x, y) => data[(y * width + x) * channels + channels - 1]
  }
}

beforeEach(() => {
  warnSpy.mockClear()
})

describe('getSquareIcon', () => {
  test('fits the icon in the box, transparent unless a background is given', async () => {
    const img = await render({ size: 100, padding: { horiz: 0, vert: 0 } })

    expect([img.width, img.height]).toEqual([100, 100])
    // the icon spans the width, centered vertically (rows 25 to 75)
    expect(img.alphaAt(0, 24)).toBe(0)
    expect(img.alphaAt(0, 50)).toBe(255)
    expect(img.alphaAt(99, 50)).toBe(255)
    expect(img.alphaAt(0, 76)).toBe(0)

    const opaque = await render({
      size: 100,
      padding: { horiz: 0, vert: 0 },
      background: { r: 0, g: 0, b: 255, alpha: 1 }
    })
    expect(opaque.alphaAt(0, 0)).toBe(255)
    expect(opaque.alphaAt(99, 99)).toBe(255)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  test('pixel padding keeps the box size and clears the border', async () => {
    const img = await render({ size: 100, padding: { horiz: 10, vert: 5 } })

    expect([img.width, img.height]).toEqual([100, 100])
    // 80x90 inner box, the icon fills 80x40 of it: columns 10 to 90,
    // rows 30 to 70
    expect(img.alphaAt(9, 50)).toBe(0)
    expect(img.alphaAt(10, 50)).toBe(255)
    expect(img.alphaAt(89, 50)).toBe(255)
    expect(img.alphaAt(90, 50)).toBe(0)
    expect(img.alphaAt(50, 29)).toBe(0)
    expect(img.alphaAt(50, 30)).toBe(255)
    expect(img.alphaAt(50, 69)).toBe(255)
    expect(img.alphaAt(50, 70)).toBe(0)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  test('percentage padding resolves against the box size', async () => {
    const img = await render({
      size: 200,
      padding: { horiz: '10%', vert: '25%' }
    })

    expect([img.width, img.height]).toEqual([200, 200])
    // 20px and 50px of padding: a 160x100 inner box, the icon fills
    // 160x80 of it: columns 20 to 180, rows 60 to 140
    expect(img.alphaAt(19, 100)).toBe(0)
    expect(img.alphaAt(20, 100)).toBe(255)
    expect(img.alphaAt(179, 100)).toBe(255)
    expect(img.alphaAt(180, 100)).toBe(0)
    expect(img.alphaAt(100, 59)).toBe(0)
    expect(img.alphaAt(100, 60)).toBe(255)
    expect(img.alphaAt(100, 139)).toBe(255)
    expect(img.alphaAt(100, 140)).toBe(0)
  })

  test('padding that leaves no room is dropped with a warning', async () => {
    const img = await render({ size: 100, padding: { horiz: 50, vert: 10 } })

    expect([img.width, img.height]).toEqual([100, 100])
    // the horizontal padding is gone: the icon spans the full width
    // and is centered in the 80px tall inner box (rows 25 to 75)
    expect(img.alphaAt(0, 50)).toBe(255)
    expect(img.alphaAt(99, 50)).toBe(255)
    expect(img.alphaAt(50, 24)).toBe(0)
    expect(img.alphaAt(50, 25)).toBe(255)
    expect(warnSpy).toHaveBeenCalledOnce()
    expect(warnSpy.mock.calls[0][0]).toContain(file.relativeName)
  })
})
