// Build-side only: spins up the TS compiler via @shikijs/twoslash. Keep
// Node-only imports (fs paths, etc.) out of shared.js so the browser
// bundle for DocCodeHighlight stays clean.

import { resolve } from 'node:path'

import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'

const docsRoot = resolve(import.meta.dirname, '../../..')

// Twoslash doesn't read the project's .quasar/tsconfig.json, so any path
// alias the docs use has to be declared here. `'quasar'` resolves via the
// workspace symlink in node_modules, no mapping needed.
const compilerPaths = {
  '#q-app': [resolve(docsRoot, '../app-vite/types/index.d.ts')]
}

// Hover popups whose text adds no value to a Quasar-focused snippet. Add a
// pattern here to suppress a new case.
const NOISE_HOVER_PATTERNS = [
  // `const Notify: Notify`, etc. - keyword + name echoed as its own type.
  /^\s*(?:const|let|var|type|class|interface|function|import|\(alias\))\s+(\w+):\s*\1\s*$/,
  // `var console: Console`, `console.log(...): void`, etc. - Built-in Console API
  /^\s*(?:var\s+console:\s*Console|(?:\(method\)\s+)?Console\.)/
]

const isNoiseHover = popupText =>
  NOISE_HOVER_PATTERNS.some(pattern => pattern.test(popupText))

// Inline markdown link: `[label](url)`. JSDoc comments in the Quasar type
// declarations rely on this syntax. VS Code's hover renders it as a clickable
// link, twoslash doesn't — so we wire a minimal markdown renderer.
// TODO: replace with a real markdown parser (e.g. markdown-it + hast-util-
// from-html) once we need bold/italic/code-span support in JSDoc.
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

function renderInlineMarkdown(text) {
  const output = []
  let lastIndex = 0
  for (const match of text.matchAll(LINK_RE)) {
    if (match.index > lastIndex) {
      output.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    output.push({
      type: 'element',
      tagName: 'a',
      properties: {
        href: match[2],
        target: '_blank',
        rel: 'noopener noreferrer'
      },
      children: [{ type: 'text', value: match[1] }]
    })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    output.push({ type: 'text', value: text.slice(lastIndex) })
  }
  return output
}

/**
 * Block-level: lines joined with <br>, each run through the inline renderer.
 *
 * @param {string} content
 */
function renderMarkdown(content) {
  const lines = content.split('\n')
  const output = []
  for (let index = 0; index < lines.length; index++) {
    if (index > 0) {
      output.push({
        type: 'element',
        tagName: 'br',
        properties: {},
        children: []
      })
    }
    output.push(...renderInlineMarkdown(lines[index]))
  }
  return output
}

/**
 * @param {import('hast').Element} node
 */
function textContent(node) {
  if (node.type === 'text') {
    return node.value
  }
  if (node.children === void 0) {
    return ''
  }

  let out = ''
  for (const child of node.children) {
    out += textContent(child)
  }
  return out
}

/**
 * @param {import('hast').Element} node
 * @param {string} name
 */
function hasClass(node, name) {
  const value = node.properties?.class
  if (typeof value === 'string') {
    return value.split(/\s+/).includes(name)
  }
  if (Array.isArray(value)) {
    return value.includes(name)
  }
  return false
}

/**
 * The trigger nodes survive, only the dotted underline and popup are removed.
 *
 * @param {import('hast').Element} node
 */
function stripNoiseHovers(node) {
  if (node.children === void 0) {
    return
  }

  const rebuilt = []
  for (const child of node.children) {
    if (
      child.type === 'element' &&
      child.tagName === 'span' &&
      hasClass(child, 'twoslash-hover')
    ) {
      const popup = child.children?.find(
        item =>
          item.type === 'element' && hasClass(item, 'twoslash-popup-container')
      )
      const popupText = popup !== void 0 ? textContent(popup).trim() : ''
      if (isNoiseHover(popupText)) {
        for (const inner of child.children) {
          if (inner !== popup) {
            rebuilt.push(inner)
          }
        }
        continue
      }
    }
    stripNoiseHovers(child)
    rebuilt.push(child)
  }
  node.children = rebuilt
}

const noiseHoverStripper = {
  name: 'docs:twoslash-strip-noise',
  pre(preNode) {
    stripNoiseHovers(preNode)
  }
}

const twoslashTransformer = transformerTwoslash({
  twoslashOptions: { compilerOptions: { paths: compilerPaths } },
  renderer: rendererRich({
    renderMarkdown,
    renderMarkdownInline: renderInlineMarkdown
  })
})

export function getFenceBuildOnlyTransformers(attrs) {
  return attrs.twoslash === true
    ? [twoslashTransformer, noiseHoverStripper]
    : []
}
