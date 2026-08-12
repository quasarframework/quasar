import { readFileSync, readdirSync } from 'node:fs'
import { join, normalize } from 'node:path'

export const uiDir = normalize(join(import.meta.dirname, '../..'))

export const { version } = JSON.parse(
  readFileSync(join(uiDir, 'package.json'), 'utf8')
)

// the CDN usage pattern: global Vue build + a quasar UMD bundle
export const vuePath = join(uiDir, 'node_modules/vue/dist/vue.global.prod.js')

export const bundleFlavors = [
  { label: 'quasar.umd.js', path: join(uiDir, 'dist/quasar.umd.js') },
  { label: 'quasar.umd.prod.js', path: join(uiDir, 'dist/quasar.umd.prod.js') }
]

// mirrors the dash-to-camel mangling of addUmdAssets()
// in build/script.build.javascript.js
export function camelize(name) {
  return name.replaceAll(/-([a-zA-Z])/g, g => g[1].toUpperCase())
}

const umdAssetRE = /\.umd\.prod\.js$/

// the built lang packs / icon sets ("type": 'lang' | 'icon-set'),
// each expected to register on window.Quasar under its camelized key
export function listUmdAssets(type) {
  return readdirSync(join(uiDir, 'dist', type))
    .filter(file => umdAssetRE.test(file))
    .map(file => {
      const base = file.slice(0, -'.umd.prod.js'.length)
      return {
        base,
        globalKey: camelize(base),
        path: join(uiDir, 'dist', type, file)
      }
    })
}

// number of source assets the build is expected to have emitted
export function countSourceAssets(type) {
  return readdirSync(join(uiDir, type)).filter(file => file.endsWith('.js'))
    .length
}

const exportBlockRE = /export\s*\{([^}]*)\}/g
const defaultAsRE = /^default\s+as\s+/

// ground truth for the window.Quasar surface: the export names of a
// src listing file (components.js, plugins.js, ...) that index.umd.js
// spreads onto the global
export function listSourceExports(fileName) {
  const source = readFileSync(join(uiDir, 'src', fileName), 'utf8')
  const names = []

  for (const [, block] of source.matchAll(exportBlockRE)) {
    for (const rawToken of block.split(',')) {
      const token = rawToken.trim()
      if (token !== '') {
        names.push(token.replace(defaultAsRE, ''))
      }
    }
  }

  return names
}

// a page pre-loaded with the given scripts, tracking everything a real
// user would see as a problem in devtools
export async function createUmdPage(browser, scripts) {
  const page = await browser.newPage()
  const consoleIssues = []

  page.on('console', msg => {
    const type = msg.type()
    if (type === 'error' || type === 'warning') {
      consoleIssues.push(`${type}: ${msg.text()}`)
    }
  })
  page.on('pageerror', err => {
    consoleIssues.push(`pageerror: ${err.message}`)
  })

  await page.goto('about:blank')
  for (const path of scripts) {
    await page.addScriptTag({ path })
  }

  return { page, consoleIssues }
}
