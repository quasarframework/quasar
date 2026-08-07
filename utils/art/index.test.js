import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'

import { showCliBanner } from './index.js'

const assetsDir = join(import.meta.dirname, 'assets')
const rawAsset = readFileSync(join(assetsDir, 'cli-banner.raw.txt'), 'utf8')
const colorAsset = readFileSync(join(assetsDir, 'cli-banner.color.txt'), 'utf8')

// the gradient endpoints of scripts/build.js (which carries the
// breadcrumb back here); Quasar brand blue -> the red end
const gradientEndpoints = { from: [25, 118, 210], to: [168, 47, 55] }

// oxlint-disable-next-line no-control-regex -- stripping ANSI SGR sequences is the point
const sgrRE = /\u001B\[[0-9;]*m/g
const truecolorRE = /38;2;(\d+);(\d+);(\d+)/g

// showCliBanner prints through console.log; capture what it writes
function captureBanner(forceColor) {
  const original = process.env.FORCE_COLOR
  if (forceColor === void 0) {
    delete process.env.FORCE_COLOR
  } else {
    process.env.FORCE_COLOR = forceColor
  }

  const originalLog = console.log
  const lines = []
  console.log = (...args) => {
    lines.push(args.join(' '))
  }
  try {
    showCliBanner()
  } finally {
    console.log = originalLog
    if (original === void 0) {
      delete process.env.FORCE_COLOR
    } else {
      process.env.FORCE_COLOR = original
    }
  }
  return lines.join('\n')
}

test('prints the color asset byte-for-byte by default', () => {
  expect(captureBanner()).toBe(colorAsset)
})

test('FORCE_COLOR=1 keeps the color asset', () => {
  expect(captureBanner('1')).toBe(colorAsset)
})

test('FORCE_COLOR=0 prints the raw asset byte-for-byte', () => {
  expect(captureBanner('0')).toBe(rawAsset)
})

test('the color asset is exactly the raw asset with colors applied', () => {
  expect(colorAsset.replace(sgrRE, '')).toBe(rawAsset)
})

test('the color gradient runs between the brand endpoints', () => {
  const colors = [...colorAsset.matchAll(truecolorRE)].map(match =>
    match.slice(1, 4).map(Number)
  )

  expect(colors.length, 'no truecolor sequences found').toBeGreaterThan(0)
  expect(colors[0]).toEqual(gradientEndpoints.from)
  expect(colors.at(-1)).toEqual(gradientEndpoints.to)
})

test('the raw asset is a real banner, not an empty or one-line file', () => {
  const artLines = rawAsset.split('\n').filter(line => line.trim() !== '')
  expect(artLines.length).toBeGreaterThanOrEqual(5)
})

test('the committed assets match what the generator produces', () => {
  const outDir = mkdtempSync(join(tmpdir(), 'quasar-art-'))
  try {
    execFileSync(
      process.execPath,
      [join(import.meta.dirname, 'scripts/build.js'), outDir],
      { stdio: 'ignore' }
    )

    expect(
      readFileSync(join(outDir, 'cli-banner.raw.txt'), 'utf8'),
      'raw asset drifted from the generator — run "pnpm build" in utils/art'
    ).toBe(rawAsset)
    expect(
      readFileSync(join(outDir, 'cli-banner.color.txt'), 'utf8'),
      'color asset drifted from the generator — run "pnpm build" in utils/art'
    ).toBe(colorAsset)
  } finally {
    rmSync(outDir, { recursive: true, force: true })
  }
})
