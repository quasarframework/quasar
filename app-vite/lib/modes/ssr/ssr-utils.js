import { join } from 'node:path'
import serialize from 'serialize-javascript'
import { green } from 'kolorist'
import { normalizePath } from 'vite'

import { dot, info, log } from '../../utils/logger.js'

export { injectNonceAttr } from '../../../templates/entry/ssr-nonce.js'

export function renderStoreState(ssrContext) {
  const state = serialize(ssrContext.state, { isJSON: true })
  return (
    `<script${ssrContext.__quasarNonceAttr}>` +
    `window.__INITIAL_STATE__=${state};` +
    'document.currentScript.remove()</script>'
  )
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

function walkCriticalCssModules(moduleList, criticalCSS) {
  for (const { url, file, importedModules } of moduleList) {
    // Prevent infinite loops from circular dependencies
    if (criticalCSS.seenNodes.has(url)) continue
    criticalCSS.seenNodes.add(url)

    /**
     * The module graph accumulates modules across requests and HMR.
     * We skip SFCs that did not render in this request, otherwise
     * styles from previously visited routes would be injected anyway.
     * Note: this doesn't cover non-SFC imports, e.g. .js files, which
     * import CSS files directly themselves. But, it's rare and not
     * have an important effect, just a bit of extra CSS.
     */
    if (vueSfcUrlRE.test(url) && !criticalCSS.renderedSfcFiles.has(file)) {
      continue
    }

    if (
      !inlineStyleRE.test(url) &&
      (url.includes('vue&type=style') || styleUrlRE.test(url))
    ) {
      criticalCSS.meta.endingHeadTags +=
        `<link${criticalCSS.nonceAttr} rel="stylesheet"` +
        ` href="${url}" data-quasar-ssr-style>`
    }

    if (importedModules?.size) {
      walkCriticalCssModules(importedModules, criticalCSS)
    }
  }
}

export function injectCriticalCssPath({
  viteServer,
  serverEntryFile,
  rootFolder,
  ssrContext
}) {
  const entryModules = viteServer.moduleGraph.getModulesByFile(
    normalizePath(serverEntryFile)
  )

  if (entryModules) {
    /**
     * The SFCs rendered during the current request, as absolute file paths.
     * Populated by @vitejs/plugin-vue with paths relative to the Vite root.
     */
    const renderedSfcFiles = new Set()
    for (const filename of ssrContext.modules ?? []) {
      renderedSfcFiles.add(normalizePath(join(rootFolder, filename)))
    }

    walkCriticalCssModules(entryModules, {
      seenNodes: new Set(),
      renderedSfcFiles,
      nonceAttr: ssrContext.__quasarNonceAttr,
      meta: ssrContext._meta
    })
  }
}
