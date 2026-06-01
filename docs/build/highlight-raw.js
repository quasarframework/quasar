import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

import { transformerStyleToClass } from '@shikijs/transformers'

import { highlighter } from './md/highlight/build-highlighter.js'
import { buildFenceTransformers, themeOptions } from './md/highlight/shared.js'

// Vite plugin: `import foo from 'path/to/file.ext?highlighted'` returns a
// pre-rendered HTML string highlighted at build time. The JS module imports
// a sibling virtual `.css` module so Vite's native CSS pipeline emits the
// stylesheet as a real asset (proper SSG, HMR, dedup) instead of us
// injecting via `document.createElement`. The trailing `.js`/`.css` keeps
// each module on the right Vite track. See https://github.com/vitejs/vite/issues/12239
// for the extension-suffix workaround.

const queryRE = /\?highlighted(?:&|$)/
const virtualJsPrefix = '\0highlight-raw:'
const virtualJsSuffix = '.js'
const virtualCssPrefix = '\0highlight-raw-css:'
const virtualCssSuffix = '.css'

// Side-channel: JS load() computes CSS and stashes it under a content-hashed
// id and the subsequent CSS load() retrieves it. Hash-based id dedupes naturally
// across consumers with identical CSS.
const cssById = new Map()

const languageByExtension = {
  sass: 'sass',
  scss: 'scss',
  css: 'css',
  js: 'javascript',
  ts: 'typescript',
  vue: 'vue',
  html: 'html',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  sh: 'bash',
  bash: 'bash',
  xml: 'xml',
  md: 'markdown'
}

function inferLang(path) {
  const dotIndex = path.lastIndexOf('.')
  return dotIndex === -1
    ? 'text'
    : (languageByExtension[path.slice(dotIndex + 1)] ?? 'text')
}

function shortHash(text) {
  return createHash('sha1').update(text).digest('hex').slice(0, 8)
}

export default function highlightRawPlugin() {
  return {
    name: 'docs-highlight-raw',
    enforce: 'pre',

    async resolveId(source, importer) {
      if (queryRE.test(source)) {
        const cleanPath = source.split('?')[0]
        const resolved = await this.resolve(cleanPath, importer, {
          skipSelf: true
        })
        return resolved
          ? `${virtualJsPrefix}${resolved.id}${virtualJsSuffix}`
          : void 0
      }

      if (source.startsWith(virtualCssPrefix)) {
        return source
      }
    },

    load(id) {
      if (id.startsWith(virtualCssPrefix) && id.endsWith(virtualCssSuffix)) {
        return cssById.get(id)
      }

      if (id.startsWith(virtualJsPrefix) && id.endsWith(virtualJsSuffix)) {
        const filePath = id.slice(
          virtualJsPrefix.length,
          id.length - virtualJsSuffix.length
        )
        this.addWatchFile(filePath)

        const source = readFileSync(filePath, 'utf8')
        const styleToClass = transformerStyleToClass()
        const html = highlighter.codeToHtml(source, {
          lang: inferLang(filePath),
          ...themeOptions,
          transformers: [...buildFenceTransformers(), styleToClass]
        })

        const css = styleToClass.getCSS()
        const cssId = `${virtualCssPrefix}${shortHash(css)}${virtualCssSuffix}`
        cssById.set(cssId, css)

        return (
          `import ${JSON.stringify(cssId)}\n` +
          `export default ${JSON.stringify(html)}`
        )
      }
    }
  }
}
