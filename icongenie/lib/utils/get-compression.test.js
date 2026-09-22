import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  BEZIER,
  BICUBIC,
  BICUBIC2,
  BILINEAR,
  HERMITE,
  NEAREST_NEIGHBOR
} from 'png2icons'
import sharp from 'sharp'
import { afterAll, describe, expect, test } from 'vitest'

import { getIcoCompression, getPngCompression } from './get-compression.js'
import { getPngSize } from './get-png-size.js'

const workDir = mkdtempSync(join(tmpdir(), 'icongenie-compression-'))

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

describe('getIcoCompression', () => {
  test('maps the quality levels onto the png2icons interpolations', () => {
    const expected = {
      1: NEAREST_NEIGHBOR,
      2: NEAREST_NEIGHBOR,
      3: BILINEAR,
      4: BILINEAR,
      5: BICUBIC2,
      6: BICUBIC2,
      7: BICUBIC,
      8: BICUBIC,
      9: BEZIER,
      10: BEZIER,
      11: HERMITE,
      12: HERMITE
    }

    Object.keys(expected).forEach(level => {
      expect(getIcoCompression(Number(level)), level).toBe(expected[level])
    })
  })
})

describe('getPngCompression', () => {
  test('the highest level leaves the file alone', () => {
    expect(getPngCompression(12)('unused')).toBeUndefined()
  })

  test('the other levels rewrite the file as a palette png', async () => {
    const file = join(workDir, 'gradient.png')

    // a smooth gradient: a truecolor png
    await sharp(
      Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
          '<defs><linearGradient id="g"><stop offset="0" stop-color="#f00"/>' +
          '<stop offset="1" stop-color="#00f"/></linearGradient></defs>' +
          '<rect width="256" height="256" fill="url(#g)"/></svg>'
      )
    )
      .png({ palette: false })
      .toFile(file)

    // the IHDR color type: 2 (rgb) or 6 (rgba) before, 3 (palette) after
    expect([2, 6]).toContain(readFileSync(file)[25])

    await getPngCompression(1)(file)

    const after = readFileSync(file)
    expect(getPngSize(file)).toEqual({ width: 256, height: 256 })
    expect(after[25]).toBe(3)
  })
})
