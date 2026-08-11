import { readFileSync } from 'node:fs'
import { join, normalize } from 'node:path'
import { chromium } from 'playwright'
import { afterAll, beforeAll, expect, test } from 'vitest'

const uiDir = normalize(join(import.meta.dirname, '../..'))
const { version } = JSON.parse(
  readFileSync(join(uiDir, 'package.json'), 'utf8')
)

let browser, page

beforeAll(async () => {
  browser = await chromium.launch()
  page = await browser.newPage()
  await page.goto('about:blank')
  // the CDN usage pattern: global Vue build + the quasar UMD bundle
  await page.addScriptTag({
    path: join(uiDir, 'node_modules/vue/dist/vue.global.prod.js')
  })
  await page.addScriptTag({ path: join(uiDir, 'dist/quasar.umd.js') })
})

afterAll(async () => {
  await browser?.close()
})

test('exposes the Quasar global at the built version', async () => {
  expect(await page.evaluate(() => window.Quasar.version)).toBe(version)
})

test('boots an app with globally registered components', async () => {
  const text = await page.evaluate(() => {
    const host = document.createElement('div')
    document.body.append(host)

    window.Vue.createApp({ template: '<q-btn label="UMD works" />' })
      .use(window.Quasar)
      .mount(host)

    return host.querySelector('.q-btn')?.textContent
  })

  expect(text).toContain('UMD works')
})
