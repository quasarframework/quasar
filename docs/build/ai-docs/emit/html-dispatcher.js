/**
 * Routes html_block and html_inline tokens to per-tag transform modules.
 *
 * Tag handlers register via registerTagHandler(tagName, { block?, inline? }).
 * The dispatcher picks the matching handler based on token type and falls
 * back to inline-tags.js for known <q-*> tags when no custom handler is
 * registered. Unknown tags surface as warnings on ctx.warnings rather than
 * throwing, so an unfamiliar Vue component in source can't kill the page.
 */

import { emit, registerEmitter } from './walker.js'
import { transformInlineTag } from './inline-tags.js'

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */
/** @typedef {import('./walker.js').MarkdownItToken} MarkdownItToken */

/**
 * Standard HTML elements that pass through verbatim without the unknown-tag
 * warning. Compared lower-case because HTML is case-insensitive in source.
 * Vue components (PascalCase or `q-*`) stay out of this set so they still
 * surface as warnings.
 *
 * `br` is intentionally absent. It lives in STRIP_HTML_TAGS below.
 *
 * @type {Set<string>}
 */
const STANDARD_HTML_TAGS = new Set([
  // Inline
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'cite',
  'code',
  'data',
  'dfn',
  'em',
  'i',
  'img',
  'kbd',
  'mark',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr',
  // Block / flow
  'address',
  'article',
  'aside',
  'blockquote',
  'details',
  'div',
  'dl',
  'dd',
  'dt',
  'figure',
  'figcaption',
  'footer',
  'header',
  'hgroup',
  'hr',
  'main',
  'nav',
  'ol',
  'ul',
  'li',
  'p',
  'pre',
  'section',
  'summary',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'tfoot',
  'caption',
  'col',
  'colgroup',
  // Media
  'audio',
  'video',
  'source',
  'track',
  'picture',
  // Form (less common in docs but valid)
  'button',
  'form',
  'input',
  'label',
  'select',
  'textarea',
  'option'
])

/**
 * HTML tags replaced with a space (to avoid word-merging) instead of passed
 * through. Raw `<br>` in prose is noise, markdown already handles spacing.
 *
 * @type {Set<string>}
 */
const STRIP_HTML_TAGS = new Set(['br'])

/**
 * Vue components to remove from raw HTML wrappers, e.g. the `<q-btn>` inside
 * a `<div class="row">...</div>` that html_block passes through as one token.
 * Same components as inline-tags.js handles, listed here so their block form
 * (often with children) is stripped before the passthrough emits raw content.
 *
 * @type {RegExp}
 */
const DROP_VUE_COMPONENT_RE =
  /<(q-btn|q-icon|q-card|q-separator|q-badge|q-bogus|TeamMember|MainMember|SocialMember|RouterMember|ViewProp|ViewPlay|TransitionList|BrandColors|ColorList|SassVariables|ThemePicker|TypographyHeadings|TypographyWeights|MenuPositioning|TooltipPositioning|ComponentsListing|IntroductionVideo|QuasarReleases|UmdTags|VitePluginUsage)(\s[^>]*?)?(\/>|>[\s\S]*?<\/\1>)/g

/**
 * @typedef {object} TagHandler
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string|void} [block]
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string|void} [inline]
 */

/** @type {Map<string, TagHandler>} */
const tagHandlers = new Map()

/**
 * Register a handler for a custom HTML tag. Handlers may provide a `block`
 * and/or `inline` function. Context mismatches log a warning, they don't crash.
 *
 * @param {string} tag
 * @param {TagHandler} handler
 */
export function registerTagHandler(tag, handler) {
  tagHandlers.set(tag, handler)
}

/**
 * Clear all tag-handler registrations. Used between test cases.
 */
export function clearTagHandlers() {
  tagHandlers.clear()
}

/**
 * Look up the tag, run the matching handler, or fall back to inline-tags.
 * Records a warning whenever no path produces output.
 *
 * @param {MarkdownItToken} token
 * @param {EmitCtx} ctx
 * @param {'block'|'inline'} contextKey
 */
function dispatch(token, ctx, contextKey) {
  const tagMatch = token.content.match(/^<([A-Za-z][\w-]*)/)
  if (!tagMatch) {
    return
  }

  const [, tag] = tagMatch
  const handler = tagHandlers.get(tag)
  if (handler) {
    const handlerFn = handler[contextKey]
    if (typeof handlerFn === 'function') {
      const result = handlerFn(token, ctx)
      if (typeof result === 'string') {
        emit(ctx, result)
      }
      return
    }
    ctx.warnings.push(
      `<${tag}> has no ${contextKey} handler in ${ctx.sourcePath}`
    )
    return
  }

  const tagLower = tag.toLowerCase()

  if (STRIP_HTML_TAGS.has(tagLower)) {
    emit(ctx, ' ')
    return
  }

  // Fallback for known inline tags like <q-badge> and <q-icon>.
  const inlineResult = transformInlineTag(token.content, ctx)
  if (inlineResult !== null) {
    emit(ctx, inlineResult)
    return
  }

  // Standard HTML is valid markdown raw HTML, emit verbatim. Embedded Vue
  // components are stripped first so their markup doesn't leak through.
  if (STANDARD_HTML_TAGS.has(tagLower)) {
    const cleaned = token.content.replace(DROP_VUE_COMPONENT_RE, '')
    emit(ctx, cleaned)
    return
  }

  ctx.warnings.push(`Unknown <${tag}> (${contextKey}) in ${ctx.sourcePath}`)
}

/**
 * Hook the dispatcher into the walker for both html_block and html_inline
 * token types. Call once during pipeline setup.
 */
export function registerHtmlDispatchers() {
  registerEmitter('html_block', (token, ctx) => dispatch(token, ctx, 'block'))
  registerEmitter('html_inline', (token, ctx) => dispatch(token, ctx, 'inline'))
}
