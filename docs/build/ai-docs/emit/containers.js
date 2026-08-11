/**
 * GitHub alert emitters for tip/warning/danger/details containers.
 * Maps per spec D4.
 *
 * tip/warning/danger -> GitHub alert syntax (`> [!TIP]` etc.) by pushing `> ` onto
 * the prefix stack so nested content (paragraphs, code, even nested containers
 * or blockquotes) gets the alert quote applied per line by emit().
 *
 * details -> raw HTML <details><summary>. GFM has no alert equivalent and the
 * widget is genuinely interactive disclosure UI.
 */

import { emit, registerEmitter } from './walker.js'

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */
/** @typedef {import('./walker.js').MarkdownItToken} MarkdownItToken */

const ALERT_MAP = {
  tip: 'TIP',
  warning: 'WARNING',
  danger: 'CAUTION'
}

/**
 * Custom title is whatever follows the type word in the container info
 * string, e.g. "warning WATCH OUT" gives "WATCH OUT". Null when absent.
 *
 * @param {MarkdownItToken} token
 * @param {'tip'|'warning'|'danger'} type
 * @returns {string|null}
 */
function parseCustomTitle(token, type) {
  const info = token.info.trim()
  return info.slice(type.length).trim() || null
}

/**
 * Register the open/close emitter pair for a GitHub-alert container type.
 *
 * @param {'tip'|'warning'|'danger'} type
 */
function registerAlertPair(type) {
  registerEmitter(`container_${type}_open`, (token, ctx) => {
    const customTitle = parseCustomTitle(token, type)
    ctx.prefixStack.push('> ')
    // The alert marker line is visible content between any preceding heading
    // and the container body, so the heading-dedup flag must reset.
    ctx._lastBlockWasHeading = false
    emit(ctx, `[!${ALERT_MAP[type]}]\n`)
    if (customTitle) {
      emit(ctx, `**${customTitle}**\n`)
    }
  })
  registerEmitter(`container_${type}_close`, (_, ctx) => {
    ctx.prefixStack.pop()
    // Pop first so the trailing separator lands in the outer context.
    emit(ctx, '\n')
  })
}

/**
 * Register container emitters with the walker. Call after registerProseEmitters
 * so these win for `container_*` token types.
 */
export function registerContainerEmitters() {
  for (const type of Object.keys(ALERT_MAP)) {
    registerAlertPair(type)
  }

  // details renders as raw HTML per spec D4. GFM alerts have no equivalent
  // and it's genuinely an interactive disclosure widget.
  registerEmitter('container_details_open', (token, ctx) => {
    const info = token.info.trim()
    const title = info.slice('details'.length).trim() || 'Details'
    ctx._lastBlockWasHeading = false
    emit(ctx, `<details><summary>${title}</summary>\n\n`)
  })
  registerEmitter('container_details_close', (_, ctx) => {
    emit(ctx, '</details>\n\n')
  })
}
