import { readFileSync } from 'node:fs'

import { highlighter } from './md/highlight/build-highlighter.js'
import { buildFenceTransformers, themeOptions } from './md/highlight/shared.js'
import { getSharedStyleToClasses } from './shiki-css-stash.js'

// Vite plugin: `import foo from 'path/to/file.ext?highlighted'` returns a
// pre-rendered HTML string highlighted at build time. Token CSS is funneled
// into the app-wide stylesheet via `getSharedStyleToClasses`

const queryRE = /\?highlighted(?:&|$)/
const virtualJsPrefix = '\0highlight-raw:'
const virtualJsSuffix = '.js'

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
    },

    load(id) {
      if (id.startsWith(virtualJsPrefix) && id.endsWith(virtualJsSuffix)) {
        const filePath = id.slice(
          virtualJsPrefix.length,
          id.length - virtualJsSuffix.length
        )
        this.addWatchFile(filePath)

        const source = readFileSync(filePath, 'utf8')
        const html = highlighter.codeToHtml(source, {
          lang: inferLang(filePath),
          ...themeOptions,
          transformers: [
            ...buildFenceTransformers(),
            ...getSharedStyleToClasses()
          ]
        })

        return `export default ${JSON.stringify(html)}`
      }
    }
  }
}
