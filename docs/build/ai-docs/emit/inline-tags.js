/**
 * Inline Vue tag handlers per spec D6, e.g. <q-badge> and <q-icon>.
 * Called from the html_block / html_inline dispatcher as a fallback when no
 * dedicated tag handler (like doc-api.js) is registered.
 *
 * Each tag has a synchronous transform returning the replacement string,
 * or null when the tag is unknown so the caller can log a warning.
 */

import { sourceToMenuKey } from '../routes.js'

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */

const LIVE_DOCS_URL = 'https://v2.quasar.dev'

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

/**
 * Placeholder paragraph for interactive widgets the AI docs can't reproduce.
 * Keeps the surrounding heading meaningful instead of leaving it with no body.
 * Links straight to the live page of the source being extracted, falling back
 * to the site root when no source path is known.
 *
 * @param {string} componentName
 * @param {EmitCtx} [ctx]
 * @returns {string}
 */
function liveDocsStub(componentName, ctx) {
  const pagePath = ctx?.sourcePath ? `/${sourceToMenuKey(ctx.sourcePath)}` : ''
  return `\n> Visit the [live documentation](${LIVE_DOCS_URL}${pagePath}) for the interactive ${componentName} reference.\n\n`
}

/** @type {Record<string, (attrs: Record<string,string>, ctx?: EmitCtx) => string>} */
const HANDLERS = {
  'q-badge': attrs => (attrs.label ? `*(${attrs.label})*` : ''),
  'q-icon': () => '',
  'q-bogus': () => '',
  'q-btn': () => '',
  'q-card': () => '',
  // Horizontal rule equivalent.
  'q-separator': () => '\n---\n\n',
  // Inline showcase components sit inside example wrappers. A stub would be
  // noisy mid-paragraph, drop silently.
  ViewProp: () => '',
  ViewPlay: () => '',
  // Standalone interactive demos and pickers. Point readers at the live docs.
  TransitionList: (_, ctx) => liveDocsStub('transitions demo', ctx),
  BrandColors: (_, ctx) => liveDocsStub('brand colors', ctx),
  ColorList: (_, ctx) => liveDocsStub('color list', ctx),
  SassVariables: (_, ctx) => liveDocsStub('Sass/SCSS variables', ctx),
  ThemePicker: (_, ctx) => liveDocsStub('theme picker', ctx),
  TypographyHeadings: (_, ctx) => liveDocsStub('typography headings', ctx),
  TypographyWeights: (_, ctx) => liveDocsStub('typography weights', ctx),
  MenuPositioning: (_, ctx) => liveDocsStub('menu positioning examples', ctx),
  TooltipPositioning: (_, ctx) =>
    liveDocsStub('tooltip positioning examples', ctx),
  ComponentsListing: (_, ctx) => liveDocsStub('full components index', ctx),
  IntroductionVideo: (_, ctx) => liveDocsStub('Quasar introduction video', ctx),
  QuasarReleases: (_, ctx) => liveDocsStub('release notes', ctx),
  UmdTags: (_, ctx) => liveDocsStub('UMD CDN tags', ctx),
  VitePluginUsage: (_, ctx) => liveDocsStub('Vite plugin usage example', ctx),
  // Team grid cards. The whole section gets dropped, a stub would be redundant.
  TeamMember: () => '',
  MainMember: () => '',
  SocialMember: () => '',
  RouterMember: () => ''
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
