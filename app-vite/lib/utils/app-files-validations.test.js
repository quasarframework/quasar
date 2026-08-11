import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, describe, expect, test, vi } from 'vitest'

import { appFilesValidations } from './app-files-validations.js'
import { warn } from './logger.js'
import { attachMarkup, entryPointMarkup } from '../plugins/vite.html.js'

vi.mock('./logger.js', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  fatal: vi.fn(msg => {
    throw new Error(`FATAL: ${msg}`)
  })
}))

const rootDir = mkdtempSync(join(tmpdir(), 'app-vite-files-validations-'))

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('[app-files-validations.js]', () => {
  let dirId = 0

  function makeApp(indexHtmlContent) {
    const appDir = join(rootDir, `app-${dirId++}`)
    mkdirSync(appDir)

    if (indexHtmlContent !== void 0) {
      writeFileSync(join(appDir, 'index.html'), indexHtmlContent)
    }

    return {
      resolve: {
        app: file => join(appDir, file)
      }
    }
  }

  test('passes a valid index.html', () => {
    const appPaths = makeApp(`<body>${entryPointMarkup}</body>`)

    expect(appFilesValidations(appPaths)).toBe(true)
    expect(warn).not.toHaveBeenCalled()
  })

  test('fails when index.html is missing', () => {
    const appPaths = makeApp(void 0)

    expect(appFilesValidations(appPaths)).toBe(false)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('missing'))
  })

  test('fails when the attach markup is present', () => {
    const appPaths = makeApp(`<body>${entryPointMarkup}${attachMarkup}</body>`)

    expect(appFilesValidations(appPaths)).toBe(false)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(attachMarkup))
  })

  test('fails when the entry point markup is absent', () => {
    const appPaths = makeApp('<body></body>')

    expect(appFilesValidations(appPaths)).toBe(false)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(entryPointMarkup))
  })
})
