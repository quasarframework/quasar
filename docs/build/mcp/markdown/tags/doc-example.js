/**
 * <DocExample title="X" file="Y" /> handler.
 *
 * Inlines docs/src/examples/{frontmatter.examples}/{Y}.vue as a fenced
 * `vue` code block, labelled with its title. Missing source file or
 * missing frontmatter.examples warn and emit nothing.
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
      const { source, warnings: collapseWarnings } = applyCollapseMarkers(
        readFileSync(fullPath, 'utf8').trim()
      )
      for (const warning of collapseWarnings) {
        ctx.warnings.push(
          `${warning} in example ${examplesKey}/${file}.vue (${ctx.sourcePath})`
        )
      }
      // The label is a paragraph, never a heading: a heading would open a
      // section of its own, one more in the outline per example, a
      // duplicate of the author's when the title repeats it, and a sibling
      // that cuts the author's section short. Skipped when a heading sits
      // right before the example with no body in between: the example IS
      // that section, so the title is redundant, even a near-match
      // (`### Min and max` then title="Custom min/max").
      const label =
        ctx._lastBlockWasHeading === true ? '' : `Example "${title}":\n\n`
      // The example body counts as non-heading content, so a later sibling
      // example gets its label.
      ctx._lastBlockWasHeading = false
      const fence = fenceFor(source)
      return `${label}${fence}vue\n${source}\n${fence}\n\n`
    }
  }
}
