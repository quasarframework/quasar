import serialize from 'serialize-javascript'
import { green } from 'kolorist'

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

const styleUrlRE = /\.(css|sass|scss|less|styl|stylus)(\?.*)?$/

export function injectCriticalCssPath(nodeList, criticalCssPaths) {
  for (const { url, importedModules } of nodeList) {
    // Prevent infinite loops from circular dependencies
    if (criticalCssPaths.seenNodes.has(url)) continue
    criticalCssPaths.seenNodes.add(url)

    if (url.includes('vue&type=style') || styleUrlRE.test(url)) {
      criticalCssPaths.ssrContext._meta.endingHeadTags += `<link rel="stylesheet" href="${url}" data-quasar-ssr-style>`
    }

    if (importedModules?.size) {
      injectCriticalCssPath(importedModules, criticalCssPaths)
    }
  }
}
