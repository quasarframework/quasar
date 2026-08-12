import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { bundleFlavors, createUmdPage, flavorMatrix } from './helpers.js'

let browser

beforeAll(async () => {
  browser = await chromium.launch()
})

afterAll(async () => {
  await browser?.close()
})

// each test gets a fresh page: the first app.use(Quasar, ...) on a page
// freezes the bundle's global config (see src/install-quasar.js)
describe.each(flavorMatrix)('$label', ({ bundlePath, vuePath }) => {
  test('install config reaches the app (dark mode)', async () => {
    const { page, consoleIssues } = await createUmdPage(browser, [
      vuePath,
      bundlePath
    ])

    const result = await page.evaluate(() => {
      const host = document.createElement('div')
      document.body.append(host)

      window.Vue.createApp({
        template: '<div id="dark">{{ $q.dark.isActive }}</div>'
      })
        .use(window.Quasar, { config: { dark: true } })
        .mount(host)

      return {
        isActive: document.querySelector('#dark').textContent,
        bodyDark: document.body.classList.contains('body--dark')
      }
    })

    expect(result.isActive).toBe('true')
    expect(result.bodyDark).toBe(true)
    expect(consoleIssues).toEqual([])

    await page.close()
  })

  test('two apps share plugin state but keep their own config', async () => {
    const { page, consoleIssues } = await createUmdPage(browser, [
      vuePath,
      bundlePath
    ])

    const boot = await page.evaluate(() => {
      const template =
        '<div class="iso">{{ $q.lang.isoName }}</div>' +
        '<div class="dark">{{ $q.config.dark === true }}</div>'

      for (const config of [{ dark: true }, void 0]) {
        const host = document.createElement('div')
        document.body.append(host)

        window.Vue.createApp({ template })
          .use(window.Quasar, config !== void 0 ? { config } : void 0)
          .mount(host)
      }

      return {
        iso: [...document.querySelectorAll('.iso')].map(el => el.textContent),
        dark: [...document.querySelectorAll('.dark')].map(el => el.textContent)
      }
    })

    // per-app config: only the first app got dark
    expect(boot.dark).toEqual(['true', 'false'])
    expect(boot.iso).toEqual(['en-US', 'en-US'])

    // singleton plugin state: a Lang change reaches both apps
    const iso = await page.evaluate(async () => {
      window.Quasar.Lang.set({
        ...window.Quasar.Lang.props,
        isoName: 'x-umd-test'
      })
      await window.Vue.nextTick()
      return [...document.querySelectorAll('.iso')].map(el => el.textContent)
    })

    expect(iso).toEqual(['x-umd-test', 'x-umd-test'])
    expect(consoleIssues).toEqual([])

    await page.close()
  })
})

// no Vue involved, so only the quasar bundle flavor matters here
describe.each(bundleFlavors)('$label', ({ path }) => {
  test('loading before Vue prints the guidance error', async () => {
    const { page, consoleIssues } = await createUmdPage(browser, [path])

    expect(consoleIssues.some(issue => issue.includes('Vue is required'))).toBe(
      true
    )
    expect(await page.evaluate(() => window.Quasar)).toBeUndefined()

    await page.close()
  })
})
