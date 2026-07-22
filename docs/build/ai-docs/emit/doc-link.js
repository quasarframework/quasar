/**
 * <DocLink to="X">label</DocLink> handler. Currently unused in any
 * source page (per staleness audit) but ship the transform defensively
 * so a future doc author adding the component doesn't break the build.
 *
 * The link-rewrite logic (in-tree path -> .md) lives in link-rewrite.js
 * and is applied here so DocLink output matches normal markdown links.
 */

import { rewriteLink } from './link-rewrite.js'
import { sourceToOutputPath } from '../routes.js'

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */
/** @typedef {import('./walker.js').MarkdownItToken} MarkdownItToken */

/**
 * @typedef {object} TagHandler
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [block]
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [inline]
 */

const TO_RE = /to="([^"]+)"/

/**
 * Build a DocLink tag handler. Same function services both block and
 * inline contexts since the output is identical either way.
 *
 * @returns {TagHandler}
 */
export function docLinkHandler() {
  /**
   * @param {MarkdownItToken} token
   * @param {EmitCtx} ctx
   * @returns {string}
   */
  function render(token, ctx) {
    const match = token.content.match(TO_RE)
    if (!match) {
      ctx.warnings.push(`<DocLink> missing to= attr in ${ctx.sourcePath}`)
      return ''
    }

    const [, to] = match
    const href = rewriteLink(
      to,
      ctx.menuPaths || new Set(),
      sourceToOutputPath(ctx.sourcePath)
    )
    // Self-closing form: text = last path segment
    if (token.content.endsWith('/>')) {
      const segments = to.split('/').filter(Boolean)
      const label = segments.at(-1) || to
      return `[${label}](${href})`
    }
    // Paired form. markdown-it splits it into open + text + close tokens, so
    // use the URL as the label. Good enough while DocLink stays unused.
    return `[${to}](${href})`
  }
  return { block: render, inline: render }
}
