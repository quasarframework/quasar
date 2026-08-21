import { chromium } from 'playwright'
import { afterAll, beforeAll, expect, test } from 'vitest'

import {
  bundleFlavors,
  countSourceAssets,
  createUmdPage,
  listUmdAssets,
  vueBuilds
} from './helpers.js'

// The lang packs and icon sets only ship as .umd.prod assets, so one
// bundle flavor suffices here; the bundles themselves are covered by
// the other suite files.
const langs = listUmdAssets('lang')
const iconSets = listUmdAssets('icon-set')
const langAliases = {
  'kur-CKB': 'ckb',
  mm: 'my',
  'sr-CYR': 'sr-Cyrl'
}

let browser, page, consoleIssues

beforeAll(async () => {
  browser = await chromium.launch()
  // dev Vue build: maximum warning surface for the clean-console check
  ;({ page, consoleIssues } = await createUmdPage(browser, [
    vueBuilds[0].vuePath,
    bundleFlavors[0].path,
    ...langs.map(asset => asset.path),
    ...iconSets.map(asset => asset.path)
  ]))

  // a probe app reading the reactive Lang/IconSet plugin state, plus a
  // QRating whose stars render from $q.iconSet
  await page.evaluate(() => {
    const host = document.createElement('div')
    document.body.append(host)

    window.Vue.createApp({
      template: `
        <div id="probe">{{ $q.lang.isoName }}|{{ $q.iconSet.name }}</div>
        <q-rating id="rating" :model-value="3" />
      `
    })
      .use(window.Quasar)
      .mount(host)
  })
})

afterAll(async () => {
  await browser?.close()
})

test('the build emitted a UMD asset for every source lang pack', () => {
  expect(langs.length).toBe(countSourceAssets('lang'))
})

test('the build emitted a UMD asset for every source icon set', () => {
  expect(iconSets.length).toBe(countSourceAssets('icon-set'))
})

test('every lang pack registers under its camelized key', async () => {
  const problems = await page.evaluate(
    ({ entries, aliases }) =>
      entries
        .map(({ base, globalKey }) => {
          const pack = window.Quasar.Lang[globalKey]
          if (pack === void 0) return `${base}: not registered`
          if (pack.isoName !== (aliases[base] || base)) {
            return `${base}: registered with isoName "${pack.isoName}"`
          }
          return null
        })
        .filter(problem => problem !== null),
    {
      entries: langs.map(({ base, globalKey }) => ({ base, globalKey })),
      aliases: langAliases
    }
  )

  expect(problems).toEqual([])
})

test('every icon set registers under its camelized key', async () => {
  const problems = await page.evaluate(
    entries =>
      entries
        .map(({ base, globalKey }) => {
          const set = window.Quasar.IconSet[globalKey]
          if (set === void 0) return `${base}: not registered`
          if (set.name !== base) {
            return `${base}: registered with name "${set.name}"`
          }
          return null
        })
        .filter(problem => problem !== null),
    iconSets.map(({ base, globalKey }) => ({ base, globalKey }))
  )

  expect(problems).toEqual([])
})

test('Lang.set() switches the app language and the html attributes', async () => {
  await page.evaluate(() => {
    window.Quasar.Lang.set(window.Quasar.Lang.es)
  })

  expect(await page.textContent('#probe')).toContain('es|')
  expect(
    await page.evaluate(() => document.documentElement.getAttribute('lang'))
  ).toBe('es')
  expect(
    await page.evaluate(() => document.documentElement.getAttribute('dir'))
  ).toBe('ltr')
})

test('an RTL lang pack flips the html dir attribute', async () => {
  await page.evaluate(() => {
    window.Quasar.Lang.set(window.Quasar.Lang.he)
  })

  expect(
    await page.evaluate(() => document.documentElement.getAttribute('dir'))
  ).toBe('rtl')

  await page.evaluate(() => {
    window.Quasar.Lang.set(window.Quasar.Lang.enUS)
  })

  expect(await page.textContent('#probe')).toContain('en-US|')
  expect(
    await page.evaluate(() => document.documentElement.getAttribute('dir'))
  ).toBe('ltr')
})

test('IconSet.set() re-renders mounted components with the new set', async () => {
  // material-icons default: ligature <i> icons, no <svg>
  expect(await page.textContent('#probe')).toContain('|material-icons')
  expect(await page.locator('#rating svg').count()).toBe(0)

  await page.evaluate(() => {
    window.Quasar.IconSet.set(window.Quasar.IconSet.svgFontawesomeV6)
  })

  expect(await page.textContent('#probe')).toContain('|svg-fontawesome-v6')
  expect(await page.locator('#rating svg').count()).toBeGreaterThan(0)
})

test('loading every asset keeps the console clean', () => {
  expect(consoleIssues).toEqual([])
})
