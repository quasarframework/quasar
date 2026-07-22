/**
 * <DocExample title="X" file="Y" /> handler.
 *
 * Inlines docs/src/examples/{frontmatter.examples}/{Y}.vue as a fenced
 * `vue` code block, preceded by an h3 with the title. Missing source
 * file or missing frontmatter.examples warn and emit nothing.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { applyCollapseMarkers } from './collapse-markers.js'

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */
/** @typedef {import('./walker.js').MarkdownItToken} MarkdownItToken */

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
      const source = applyCollapseMarkers(readFileSync(fullPath, 'utf8').trim())
      // Skip the tag's own `### {title}` when a heading sits right before it
      // with no body in between. The example IS the section, so that heading
      // makes the title redundant. Near-matches (`### Min and max` then
      // title="Custom min/max") are just as redundant as exact ones.
      const skipHeading = ctx._lastBlockWasHeading === true
      const heading = skipHeading ? '' : `### ${title}\n\n`
      // The example body counts as non-heading content, so a later sibling
      // example doesn't also suppress its title.
      ctx._lastBlockWasHeading = false
      return `${heading}\`\`\`vue\n${source}\n\`\`\`\n\n`
    }
  }
}
