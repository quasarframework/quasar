import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import {
  createUmdPage,
  flavorMatrix,
  listSourceExports,
  version
} from './helpers.js'

// the export listing files index.umd.js spreads onto window.Quasar
const exportGroups = [
  'components',
  'directives',
  'plugins',
  'composables',
  'utils'
]

let browser

beforeAll(async () => {
  browser = await chromium.launch()
})

afterAll(async () => {
  await browser?.close()
})

describe.each(flavorMatrix)('$label', ({ bundlePath, vuePath }) => {
  let page, consoleIssues

  beforeAll(async () => {
    ;({ page, consoleIssues } = await createUmdPage(browser, [
      vuePath,
      bundlePath
    ]))
  })

  afterAll(async () => {
    await page?.close()
  })

  test('exposes the Quasar global at the built version', async () => {
    expect(await page.evaluate(() => window.Quasar.version)).toBe(version)
  })

  test.each(exportGroups)('exposes every public %s export', async group => {
    const expected = listSourceExports(`${group}.js`)
    expect(expected.length).toBeGreaterThan(0)

    const missing = await page.evaluate(
      names => names.filter(name => window.Quasar[name] === void 0),
      expected
    )

    expect(missing).toEqual([])
  })

  test('keeps the deprecated lang/iconSet fallbacks (drop in Qv3)', async () => {
    expect(
      await page.evaluate(
        () =>
          window.Quasar.lang === window.Quasar.Lang &&
          window.Quasar.iconSet === window.Quasar.IconSet
      )
    ).toBe(true)
  })

  test('loads with a clean console', () => {
    expect(consoleIssues).toEqual([])
  })
})
