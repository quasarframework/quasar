/**
 * Content-control tags borrowed from vitepress-plugin-llms:
 *   <llm-only>...</llm-only>       kept in the markdown forms, stripped from HTML
 *   <llm-exclude>...</llm-exclude> stripped from the markdown forms, kept in HTML
 *
 * A bare `site` or `mcp` attribute narrows a tag to one markdown
 * form: the site's `.md` siblings, or the slices the packages ship for
 * the MCP server. `<llm-exclude mcp>` keeps its content everywhere but
 * the slices; `<llm-only mcp>` puts its content in the slices alone
 * (the site form and the HTML never see it). Other attributes (e.g.
 * `reason="..."`) document the source and are never emitted.
 *
 * This module handles the markdown side as a pre-walker pass on raw
 * source; the HTML side (docs/build/md/md-parse.js) drops every
 * <llm-only> and unwraps every <llm-exclude>, whatever the scope.
 */

/** @typedef {'site' | 'mcp'} MarkdownForm */

const EXCLUDE_RE = /<llm-exclude((?:\s[^>]*)?)>([\s\S]*?)<\/llm-exclude>/g
const ONLY_RE = /<llm-only((?:\s[^>]*)?)>([\s\S]*?)<\/llm-only>/g
const ONLY_OPEN_RE = /<llm-only(?:\s[^>]*)?>/g
const ONLY_CLOSE_RE = /<\/llm-only>/g
const SCOPE_RE = /(?:^|\s)(site|mcp)(?=\s|$)/

/**
 * @param {string} attributes The opening tag's attribute string.
 * @returns {MarkdownForm | null} The form the tag is narrowed to, if any.
 */
function scopeOf(attributes) {
  const match = SCOPE_RE.exec(attributes)
  return match === null ? null : /** @type {MarkdownForm} */ (match[1])
}

/**
 * @param {string} source raw page source
 * @param {MarkdownForm} form the markdown form being written
 * @returns {string} source with the llm-exclude blocks that apply removed and the llm-only wrappers stripped, their content dropped when they apply to the other form
 */
export function applyLlmContentControl(source, form) {
  if (form !== 'site' && form !== 'mcp') {
    throw new Error(`Unknown markdown form "${form}"`)
  }
  const applies = attributes => {
    const scope = scopeOf(attributes)
    return scope === null || scope === form
  }
  return source
    .replace(EXCLUDE_RE, (_, attributes, body) =>
      applies(attributes) ? '' : body
    )
    .replace(ONLY_RE, (match, attributes) => (applies(attributes) ? match : ''))
    .replace(ONLY_OPEN_RE, '')
    .replace(ONLY_CLOSE_RE, '')
}
