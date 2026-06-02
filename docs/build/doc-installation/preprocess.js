// Build-time preprocessor for `<DocInstallation ... />` tags in markdown.
//
// Each occurrence is replaced with a `<DocInstallation>` tag carrying
// already-highlighted HTML for the three installation snippets. This avoids
// having the runtime DocCode component (and through it, the lazy Shiki
// bundle) mount on pages that only need the installation card.

import { highlighter } from '../md/highlight/build-highlighter.js'
import { buildBareTransformers, themeOptions } from '../md/highlight/shared.js'
import { generateDocInstallationSnippets } from './generate-snippets.js'

const TAG_RE = /<DocInstallation\s+([^/]*?)\s*\/>/g

// Each attribute is either `foo="bar"` (static string), `:foo="<expr>"`
// (Vue bind, hand-authored single-quoted array literal), or a boolean
// shorthand `foo`. Author input is limited, we don't need a full Vue parser.
const ATTR_RE = /(:)?([\w-]+)(?:="([^"]*)")?/g

function parseAttrs(attrString) {
  const attrs = {}

  for (const [, bind, name, value] of attrString.matchAll(ATTR_RE)) {
    if (value === void 0) {
      attrs[name] = true
    } else if (bind !== void 0) {
      attrs[name] = JSON.parse(value.replaceAll("'", '"'))
    } else {
      attrs[name] = value
    }
  }

  return attrs
}

function highlightSnippet(code) {
  return highlighter
    .codeToHtml(code, {
      lang: 'javascript',
      ...themeOptions,
      transformers: buildBareTransformers()
    })
    .replace('<pre ', '<pre v-pre ')
}

function encodeForAttr(value) {
  // Inline JSON inside a Vue `:prop="..."` binding. Escape the chars
  // that would break out of the attribute or the JS expression.
  return JSON.stringify(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
}

function buildStaticAttrs(attrs) {
  const parts = []
  if (typeof attrs.title === 'string') {
    parts.push(`title="${attrs.title}"`)
  }
  if (attrs.scrollable === true) {
    parts.push('scrollable')
  }
  return parts.length === 0 ? '' : ' ' + parts.join(' ')
}

export function preprocessDocInstallation(markdownContent) {
  return markdownContent.replace(TAG_RE, (_, rawAttrs) => {
    const attrs = parseAttrs(rawAttrs)
    const snippets = generateDocInstallationSnippets(attrs)
    const preRendered = encodeForAttr({
      quasarCli: highlightSnippet(snippets.quasarCli),
      externalCli: highlightSnippet(snippets.externalCli),
      umd: highlightSnippet(snippets.umd)
    })

    return `<DocInstallation${buildStaticAttrs(attrs)} :pre-rendered="${preRendered}" />`
  })
}
