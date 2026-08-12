import { join } from 'node:path'
import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import {
  bundleFlavors,
  createUmdPage,
  uiDir,
  version,
  vuePath
} from './helpers.js'

// The UMD/CDN usage pattern compiles templates straight from the DOM
// (runtime compiler): kebab-case tags, NO self-closing tags. Nothing
// else in the repo exercises that path against the built bundle.
const inDomTemplate = `
  <div id="app">
    <q-btn id="version-btn" v-ripple :label="'v' + $q.version"></q-btn>
    <q-checkbox id="check" v-model="checked"></q-checkbox>
    <q-btn id="menu-btn" label="menu">
      <q-menu>
        <q-list>
          <q-item id="menu-item" clickable v-close-popup>
            <q-item-section>close me</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
`

let browser

beforeAll(async () => {
  browser = await chromium.launch()
})

afterAll(async () => {
  await browser?.close()
})

describe.each(bundleFlavors)('$label', ({ path }) => {
  let page, consoleIssues

  beforeAll(async () => {
    ;({ page, consoleIssues } = await createUmdPage(browser, [vuePath, path]))

    await page.addStyleTag({ path: join(uiDir, 'dist/quasar.css') })

    await page.evaluate(template => {
      document.body.insertAdjacentHTML('afterbegin', template)

      window.Vue.createApp({
        setup() {
          return { checked: window.Vue.ref(false) }
        }
      })
        .use(window.Quasar)
        .mount('#app')
    }, inDomTemplate)
  })

  afterAll(async () => {
    await page?.close()
  })

  test('mounts kebab-case in-DOM templates with $q available', async () => {
    expect(await page.textContent('#version-btn')).toContain(`v${version}`)
  })

  test('the dist stylesheet styles the mounted components', async () => {
    expect(
      await page.evaluate(() => getComputedStyle(document.body).fontFamily)
    ).toContain('Roboto')
  })

  test('v-model interaction works (QCheckbox toggles)', async () => {
    expect(await page.getAttribute('#check', 'aria-checked')).toBe('false')
    await page.click('#check')
    expect(await page.getAttribute('#check', 'aria-checked')).toBe('true')
  })

  test('directives apply from in-DOM markup (v-ripple)', async () => {
    await page.click('#version-btn')
    await page.waitForSelector('#version-btn .q-ripple', { timeout: 5000 })
  })

  test('portal components and v-close-popup work (QMenu)', async () => {
    await page.click('#menu-btn')
    await page.waitForSelector('.q-menu #menu-item', { timeout: 5000 })

    await page.click('.q-menu #menu-item')
    await page.waitForSelector('.q-menu', { state: 'detached', timeout: 5000 })
  })

  test('plugins invoked from the global work (Notify)', async () => {
    await page.evaluate(() => {
      window.Quasar.Notify.create('umd notification')
    })

    const notification = await page.waitForSelector('.q-notification', {
      timeout: 5000
    })
    expect(await notification.textContent()).toContain('umd notification')
  })

  test('boots with a clean console', () => {
    expect(consoleIssues).toEqual([])
  })
})
