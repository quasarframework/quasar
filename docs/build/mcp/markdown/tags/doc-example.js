/**
 * <DocExample title="X" file="Y" /> handler.
 *
 * Inlines docs/src/examples/{frontmatter.examples}/{Y}.vue as a fenced
 * `vue` code block, labelled with its title when that says more than
 * the section's heading. Missing source file or missing
 * frontmatter.examples warn and emit nothing.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { applyCollapseMarkers } from '../collapse-markers.js'
import { fenceFor } from '../fence-utils.js'

/** @typedef {import('../walker.js').EmitCtx} EmitCtx */
/** @typedef {import('../walker.js').MarkdownItToken} MarkdownItToken */

/**
 * @typedef {object} TagHandler
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [block]
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [inline]
 */

const TITLE_RE = /title="([^"]+)"/
const FILE_RE = /file="([^"]+)"/
const DEMO_ROOT_RE = /^ {2}<div\b([^>]*)>$/
const DEMO_ROOT_CLOSE = '  </div>'
const PADDING_CLASS_RE = /^q-p[axytblr]-/

/**
 * The template without the padding most demos wrap their content in
 * (`<div class="q-pa-md">`): padding for the site's example card, no
 * part of what the example shows. The padding classes leave the
 * template's root wrapper; a wrapper with nothing else on it goes
 * altogether and its content is dedented, one carrying layout classes
 * or styles shapes the demo and stays. Only a sole root is touched.
 *
 * @param {string} source
 * @returns {string}
 */
function unwrapDemoPadding(source) {
  const lines = source.split('\n')
  const open = lines.indexOf('<template>')
  const close = lines.indexOf('</template>')
  if (open === -1 || close === -1) {
    return source
  }
  let first = open + 1
  while (first < close && lines[first].trim() === '') {
    first++
  }
  let last = close - 1
  while (last > first && lines[last].trim() === '') {
    last--
  }
  const root = DEMO_ROOT_RE.exec(lines[first])
  if (root === null || lines[last] !== DEMO_ROOT_CLOSE) {
    return source
  }
  for (let index = first + 1; index < last; index++) {
    // a line at the wrapper's own depth or shallower: a sibling, or
    // content the dedent would misplace
    if (/^ {0,2}\S/.test(lines[index])) {
      return source
    }
  }
  const attributes = root[1].replace(/ class="([^"]*)"/, (_, classes) => {
    const kept = classes
      .split(/\s+/)
      .filter(name => name !== '' && !PADDING_CLASS_RE.test(name))
    return kept.length === 0 ? '' : ` class="${kept.join(' ')}"`
  })
  if (attributes !== '') {
    lines[first] = `  <div${attributes}>`
    return lines.join('\n')
  }
  const inner = lines
    .slice(first + 1, last)
    .map(line => (line.startsWith('  ') ? line.slice(2) : line))
  return [...lines.slice(0, open + 1), ...inner, ...lines.slice(close)].join(
    '\n'
  )
}

/**
 * @param {string} text
 * @returns {string} Case and punctuation dropped: `Mini-mode` is `mini mode`.
 */
function comparable(text) {
  return text
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Build a DocExample tag handler. `examplesDir` is injected so tests can
 * point at any directory holding `{key}/{file}.vue` example sources.
 *
 * @param {{ examplesDir: string }} opts
 * @returns {TagHandler}
 */
export function docExampleHandler({ examplesDir }) {
  return {
    block: (token, ctx) => {
      const titleMatch = token.content.match(TITLE_RE)
      const fileMatch = token.content.match(FILE_RE)
      if (!titleMatch || !fileMatch) {
        ctx.warnings.push(
          `<DocExample> missing title or file attr in ${ctx.sourcePath}`
        )
        return ''
      }

      const [, title] = titleMatch
      const [, file] = fileMatch
      const examplesKey = ctx.frontMatter?.examples
      if (!examplesKey) {
        ctx.warnings.push(
          `<DocExample> requires frontmatter.examples in ${ctx.sourcePath}`
        )
        return ''
      }
      const fullPath = join(examplesDir, examplesKey, `${file}.vue`)
      if (!existsSync(fullPath)) {
        ctx.warnings.push(
          `<DocExample file="${file}"> not found at ${fullPath} in ${ctx.sourcePath}`
        )
        return ''
      }
      const { source: collapsed, warnings: collapseWarnings } =
        applyCollapseMarkers(readFileSync(fullPath, 'utf8').trim())
      const source = unwrapDemoPadding(collapsed)
      for (const warning of collapseWarnings) {
        ctx.warnings.push(
          `${warning} in example ${examplesKey}/${file}.vue (${ctx.sourcePath})`
        )
      }
      // The label is a paragraph, never a heading: a heading would open a
      // section of its own, one more in the outline per example, a
      // duplicate of the author's when the title repeats it, and a sibling
      // that cuts the author's section short. A title that only repeats
      // the section's heading says nothing: no label, the fence speaks.
      const label =
        comparable(title) === comparable(ctx._heading ?? '')
          ? ''
          : `Example "${title}":\n\n`
      const fence = fenceFor(source)
      return `${label}${fence}vue\n${source}\n${fence}\n\n`
    }
  }
}
