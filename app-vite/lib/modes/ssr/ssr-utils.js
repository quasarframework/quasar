import { join } from 'node:path'
import serialize from 'serialize-javascript'
import { green } from 'kolorist'
import { normalizePath } from 'vite'

import { dot, info, log } from '../../utils/logger.js'

const autoRemove = 'document.currentScript.remove()'

export function renderStoreState(ssrContext) {
  const nonce =
    ssrContext.nonce !== void 0 ? ` nonce="${ssrContext.nonce}"` : ''

  const state = serialize(ssrContext.state, { isJSON: true })
  return `<script${nonce}>window.__INITIAL_STATE__=${state};${autoRemove}</script>`
}

export function logServerMessage(title, msg, additional) {
  log()
  info(
    `${msg}${additional !== void 0 ? ` ${green(dot)} ${additional}` : ''}`,
    title
  )
}

const styleUrlRE = /\.(css|sass|scss|less|styl|stylus|pcss|postcss|sss)(\?.*)?$/
const inlineStyleRE = /[?&]inline\b/
const vueSfcUrlRE = /\.vue$/

/**
 * The SFCs rendered during the current request, as absolute file paths.
 * Populated by @vitejs/plugin-vue with paths relative to the Vite root.
 */
export function getRenderedSfcFiles(ssrContext, rootFolder) {
  const files = new Set()
  for (const filename of ssrContext.modules ?? []) {
    files.add(normalizePath(join(rootFolder, filename)))
  }
  return files
}

export function injectCriticalCssPath(nodeList, criticalCSS) {
  for (const { url, file, importedModules } of nodeList) {
    // Prevent infinite loops from circular dependencies
    if (criticalCSS.seenNodes.has(url)) continue
    criticalCSS.seenNodes.add(url)

    // The module graph accumulates modules across requests and HMR.
    // We skip SFCs that did not render in this request, otherwise
    // styles from previously visited routes would be injected anyway.
    // Note: this doesn't cover non-SFC imports, e.g. .js files, which
    // import CSS files directly themselves. But, it's rare and not
    // have an important effect, just a bit of extra CSS.
    if (vueSfcUrlRE.test(url) && !criticalCSS.renderedSfcFiles.has(file)) {
      continue
    }

    if (
      !inlineStyleRE.test(url) &&
      (url.includes('vue&type=style') || styleUrlRE.test(url))
    ) {
      criticalCSS.ssrContext._meta.endingHeadTags +=
        `<link${criticalCSS.nonce} rel="stylesheet"` +
        ` href="${url}" data-quasar-ssr-style>`
    }

    if (importedModules?.size) {
      injectCriticalCssPath(importedModules, criticalCSS)
    }
  }
}
