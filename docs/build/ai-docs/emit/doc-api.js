/**
 * <DocApi file="X" /> handler.
 *
 * Reads ui/dist/api/{X}.json and dispatches to api-render/render-api.
 * A missing file emits an HTML comment placeholder so the page stays
 * structurally intact. JSON parse failures are caught because a corrupt
 * API file shouldn't kill the whole build.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderApi } from '../api-render/render-api.js'

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */
/** @typedef {import('./walker.js').MarkdownItToken} MarkdownItToken */

/**
 * @typedef {object} TagHandler
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [block]
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [inline]
 */

const FILE_RE = /file="([^"]+)"/

/**
 * Build a DocApi tag handler. `apiDir` is injected so tests can point at
 * any directory holding `{Name}.json` API descriptors.
 *
 * @param {{ apiDir: string }} opts
 * @returns {TagHandler}
 */
export function docApiHandler({ apiDir }) {
  return {
    block: (token, ctx) => {
      const match = token.content.match(FILE_RE)
      if (!match) {
        ctx.warnings.push(`<DocApi> missing file= attr in ${ctx.sourcePath}`)
        return ''
      }

      const [, name] = match
      const jsonPath = join(apiDir, `${name}.json`)
      if (!existsSync(jsonPath)) {
        ctx.warnings.push(
          `<DocApi file="${name}"> JSON not found at ${jsonPath} in ${ctx.sourcePath}`
        )
        return `<!-- DocApi: ${name} not found -->\n\n`
      }
      let json
      try {
        json = JSON.parse(readFileSync(jsonPath, 'utf8'))
      } catch (err) {
        ctx.warnings.push(
          `<DocApi file="${name}"> failed to parse ${jsonPath}: ${err.message}`
        )
        return `<!-- DocApi: ${name} parse error: ${err.message} -->\n\n`
      }
      return renderApi(name, json) + '\n'
    }
  }
}
