import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, describe, expect, test, vi } from 'vitest'

import {
  getAssetColumnWidth,
  getAssetLines,
  getAssets,
  getHumanSize,
  printBuildSummary
} from './print-build-summary.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-build-summary-'))
)

const distDir = join(rootDir, 'dist')
mkdirSync(join(distDir, 'assets'), { recursive: true })
writeFileSync(
  join(distDir, 'assets', 'app.js'),
  'console.log("app");'.repeat(64)
)
writeFileSync(join(distDir, 'assets', 'app.css'), '.cls{color:red;}'.repeat(32))
writeFileSync(join(distDir, 'index.html'), '<html></html>')
writeFileSync(join(distDir, 'manifest.json'), '{ "name": "app" }')

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

// colors depend on the environment, so strip them before asserting
const ESC = String.fromCodePoint(27)
const ansiRE = new RegExp(`${ESC}\\[[0-9;]*m`, 'g')

describe('[print-build-summary.js]', () => {
  describe('getHumanSize()', () => {
    test('formats bytes as KB with two decimals', () => {
      expect(getHumanSize(0)).toBe('0.00 KB')
      expect(getHumanSize(1024)).toBe('1.00 KB')
      expect(getHumanSize(1536)).toBe('1.50 KB')
      expect(getHumanSize(1024 * 1024)).toBe('1024.00 KB')
    })
  })

  describe('getAssets()', () => {
    test('collects the dist assets grouped by type', () => {
      const assets = getAssets(distDir)

      expect(assets.map(asset => asset.type)).toEqual([
        'js',
        'css',
        'json',
        'html'
      ])

      const js = assets.find(asset => asset.type === 'js')
      expect(js.name).toBe('assets/app.js')
      expect(js.file).toBe(join(distDir, 'assets/app.js'))
      expect(js.size).toBe('console.log("app");'.length * 64)
    })
  })

  describe('getAssetColumnWidth()', () => {
    const asset = (name, type) => ({ name, file: name, size: 1, type })

    test('fits the longest asset name plus spacing', () => {
      const longName = 'assets/a-quite-long-chunk-name.something.js'
      expect(getAssetColumnWidth([asset(longName, 'js')])).toBe(
        longName.length + 2
      )
    })

    test('fits the totals banner with the real file count and plural', () => {
      // the widest banner is the HTML one; its count & plural must be real
      expect(getAssetColumnWidth([asset('a.html', 'html')])).toBe(
        'Total HTML (1 file)'.length + 2
      )
      expect(
        getAssetColumnWidth([asset('a.html', 'html'), asset('b.html', 'html')])
      ).toBe('Total HTML (2 files)'.length + 2)
    })
  })

  describe('getAssetLines()', () => {
    const assetList = [
      { name: 'assets/app.js', file: '', size: 2048, type: 'js' },
      { name: 'vendor.js', file: '', size: 1024, type: 'js' },
      { name: 'assets/app.css', file: '', size: 512, type: 'css' },
      { name: 'manifest.json', file: '', size: 256, type: 'json' },
      { name: 'index.html', file: '', size: 100, type: 'html' }
    ]

    test('inserts separators between asset types and appends totals', () => {
      const lines = getAssetLines(assetList, false)

      expect(lines[0]).toBe('separator')
      expect(lines.filter(line => line === 'separator')).toHaveLength(4)
      expect(lines.at(-4)).toBe('thickSeparator')

      const totals = lines.slice(-3)
      expect(totals[0].asset).toContain('Total JS (2 files)')
      expect(totals[0].size).toBe('3.00 KB')
      expect(totals[1].asset).toContain('Total CSS (1 file)')
      expect(totals[1].size).toBe('0.50 KB')
      expect(totals[2].asset).toContain('Total HTML (1 file)')
      expect(totals[2].size).toBe('0.10 KB')
    })

    test('formats asset lines with folder prefix and plain-text lengths', () => {
      const lines = getAssetLines(assetList, false)
      const appJs = lines[1]

      expect(appJs.asset.replace(ansiRE, '')).toBe('assets/app.js')
      expect(appJs.assetLen).toBe('assets/app.js'.length)
      expect(appJs.size).toBe('2.00 KB')
      expect(appJs.sizeLen).toBe('2.00 KB'.length)
      expect(appJs.gzipped).toBeUndefined()
    })

    test('renders "-" instead of a size when a file cannot be read', () => {
      const lines = getAssetLines(
        [
          {
            name: 'gone.js',
            file: join(distDir, 'does-not-exist.js'),
            size: 100,
            type: 'js'
          }
        ],
        true
      )

      const entry = lines.find(line => line !== 'separator' && line.assetLen)
      expect(entry.gzipped.replace(ansiRE, '')).toBe('-')
      expect(entry.gzippedLen).toBe(1)
    })

    test('computes gzipped sizes only for highlighted types', () => {
      // dist assets: 1 js, 1 css, 1 json, 1 html (in this order)
      const lines = getAssetLines(getAssets(distDir), true)

      const jsEntry = lines[1]
      expect(jsEntry.gzipped.replace(ansiRE, '')).toMatch(/^\d+\.\d\d KB$/)

      const jsonEntry = lines[5]
      expect(jsonEntry.gzipped.replace(ansiRE, '')).toBe('-')
      expect(jsonEntry.gzippedLen).toBe(1)
    })
  })

  describe('printBuildSummary()', () => {
    test('prints an aligned summary table with a gzipped column', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      printBuildSummary(distDir, true)

      const lines = logSpy.mock.calls.map(args =>
        args.join(' ').replace(ansiRE, '')
      )

      expect(lines[0]).toBe('\n Build summary with important files:')

      const tableLines = lines.slice(1).map(line => line.replace(/\n$/, ''))
      expect(tableLines[0].startsWith(' ╔')).toBe(true)
      expect(tableLines[1]).toContain('Asset')
      expect(tableLines[1]).toContain('Size')
      expect(tableLines[1]).toContain('Gzipped')
      expect(tableLines.at(-1).startsWith(' ╚')).toBe(true)

      // every row of the box drawing must be equally wide
      const width = tableLines[0].length
      for (const line of tableLines) {
        expect(line).toHaveLength(width)
      }

      const output = tableLines.join('\n')
      expect(output).toContain('app.js')
      expect(output).toContain('Total JS (1 file)')
      expect(output).toContain('Total CSS (1 file)')
      expect(output).toContain('Total HTML (1 file)')
    })

    test('omits the gzipped column when not requested', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      printBuildSummary(distDir, false)

      const output = logSpy.mock.calls
        .map(args => args.join(' ').replace(ansiRE, ''))
        .join('\n')

      expect(output).toContain('Asset')
      expect(output).not.toContain('Gzipped')
    })
  })
})
