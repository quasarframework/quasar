/**
 * <DocApi file="X" /> handler.
 *
 * Reads ui/dist/api/{X}.json and dispatches to api/render. A missing
 * file emits an HTML comment placeholder so the page stays structurally
 * intact. JSON parse failures are caught because a corrupt API file
 * shouldn't kill the whole build.
 *
 * A bundled slice (`--target`) ships next to the very `dist/api` JSON
 * the render would duplicate, and the MCP server serves that JSON
 * through its `get_api` tool, so there the tag emits a pointer to the
 * tool instead of the rendered API.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { apiParts, renderApi } from '../../api/render.js'

/** @typedef {import('../walker.js').EmitCtx} EmitCtx */
/** @typedef {import('../walker.js').MarkdownItToken} MarkdownItToken */

/**
 * @typedef {object} TagHandler
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [block]
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [inline]
 */

const FILE_RE = /file="([^"]+)"/

/**
 * The sentence a package slice carries instead of the rendered API,
 * listing the parts this descriptor has as `get_api` takes them, in
 * the order the rendered form lays them out.
 *
 * @param {string} name
 * @param {Record<string, unknown>} json
 * @returns {string}
 */
function apiPointer(name, json) {
  const keys = apiParts(json).map(part => `\`${part}\``)
  const call = `Not inlined here: call the \`get_api\` tool with \`name: "${name}"\` for its`
  if (keys.length === 1) {
    return `${call} ${keys[0]} definition.`
  }
  return `${call} definition, or add \`part\` (${keys.join(', ')}) for one of them.`
}

/**
 * Build a DocApi tag handler. `apiDir` is injected so tests can point at
 * any directory holding `{Name}.json` API descriptors.
 *
 * @param {{ apiDir: string, referenceOnly?: boolean }} opts `referenceOnly` emits the get_api pointer instead of the rendered API.
 * @returns {TagHandler}
 */
export function docApiHandler({ apiDir, referenceOnly = false }) {
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
      // Valid JSON that isn't an object (null, a number) would crash
      // renderApi outside the catch above. Same degradation path.
      if (json === null || typeof json !== 'object' || Array.isArray(json)) {
        ctx.warnings.push(
          `<DocApi file="${name}"> failed to parse ${jsonPath}: not a JSON object`
        )
        return `<!-- DocApi: ${name} parse error: not a JSON object -->\n\n`
      }
      if (referenceOnly) {
        return `## ${name} API\n\n${apiPointer(name, json)}\n\n`
      }
      return renderApi(name, json) + '\n'
    }
  }
}
