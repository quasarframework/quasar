import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { getPngSize } from './get-png-size.js'

const sampleIcon = resolve(
  import.meta.dirname,
  '../../samples/icongenie-icon.png'
)
const workDir = mkdtempSync(join(tmpdir(), 'icongenie-png-size-'))

beforeAll(async () => {
  await sharp({
    create: { width: 40, height: 24, channels: 4, background: '#0f0' }
  })
    .png()
    .toFile(join(workDir, 'wide.png'))

  writeFileSync(join(workDir, 'fake.png'), 'not a png at all')
})

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

describe('getPngSize', () => {
  test('reads the dimensions from the header', async () => {
    const { width, height } = await sharp(sampleIcon).metadata()

    expect(getPngSize(sampleIcon)).toEqual({ width, height })
    expect(getPngSize(join(workDir, 'wide.png'))).toEqual({
      width: 40,
      height: 24
    })
  })

  test('reports 0x0 for anything that is not a png', () => {
    expect(getPngSize(join(workDir, 'fake.png'))).toEqual({
      width: 0,
      height: 0
    })
  })
})
