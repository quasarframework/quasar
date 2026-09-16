/**
 * Inline Vue tag handlers per spec D6, e.g. <q-badge> and <q-icon>.
 * Called from the html_block / html_inline dispatcher as a fallback when no
 * dedicated tag handler (like doc-api.js) is registered.
 *
 * Each tag has a synchronous transform returning the replacement string,
 * or null when the tag is unknown so the caller can log a warning.
 */

import { siteHref } from '../site.js'
import { rewriteLink, unreachableLink } from './link-rewrite.js'
import { sourceToOutputPath } from '../pages/routes.js'

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */

const ATTR_RE = /([\w-]+)="([^"]*)"/g

/**
 * Parse name="value" pairs from a tag string. Ignores boolean attrs and
 * unquoted values, which is fine. Quasar source uses quoted forms exclusively.
 *
 * @param {string} rawTag raw tag string
 * @returns {Record<string, string>}
 */
function parseAttrs(rawTag) {
  const attributes = {}
  ATTR_RE.lastIndex = 0
  let match
  while ((match = ATTR_RE.exec(rawTag))) {
    const [, name, value] = match
    attributes[name] = value
  }
  return attributes
}

/** @type {Record<string, (attrs: Record<string,string>, ctx?: EmitCtx) => string>} */
const HANDLERS = {
  'q-badge': attrs => (attrs.label ? `*(${attrs.label})*` : ''),
  'q-icon': () => '',
  'q-bogus': () => '',
  // A call-to-action button is a link when it has a target and a label;
  // decoration otherwise. The target is rewritten like a markdown link's;
  // in a package slice it must lead to documentation too (the site form
  // may link the site's tools: they are there, next to the page).
  'q-btn': (attrs, ctx = {}) => {
    const target = attrs.href ?? attrs.to
    if (!target || !attrs.label) {
      return ''
    }
    const unreachable = ctx.siteUrl ? unreachableLink(target, ctx) : null
    if (unreachable !== null) {
      ctx.warnings?.push(
        `Link ${target} in ${ctx.sourcePath} (a <q-btn>) ${unreachable}`
      )
    }
    const href = rewriteLink(
      target,
      ctx.menuPaths ?? new Set(),
      sourceToOutputPath(ctx.sourcePath ?? ''),
      ctx
    )
    return `[${attrs.label}](${siteHref(href, ctx)})\n\n`
  },
  'q-card': () => '',
  // Horizontal rule equivalent.
  'q-separator': () => '\n---\n\n'
}

/**
 * Transform a raw inline `<q-*>` tag string into its markdown replacement.
 * Returns null when the tag has no registered handler so the dispatcher can
 * surface a warning instead of silently dropping unknown markup.
 *
 * @param {string} raw e.g. `<q-badge label="v2.5+" />`
 * @param {EmitCtx} [ctx] source of sourcePath for live-docs links
 * @returns {string|null}
 */
export function transformInlineTag(raw, ctx) {
  const tagMatch = raw.match(/^<([A-Za-z][\w-]*)/)
  if (!tagMatch) {
    return null
  }

  const [, tag] = tagMatch
  const handler = HANDLERS[tag]
  if (!handler) {
    return null
  }
  return handler(parseAttrs(raw), ctx)
}
