/**
 * Content-control tags borrowed from vitepress-plugin-llms:
 *   <llm-only>...</llm-only>       kept in the markdown forms, stripped from HTML
 *   <llm-exclude>...</llm-exclude> stripped from the markdown forms, kept in HTML
 *
 * A `when="site"` or `when="mcp"` attribute narrows a tag to one
 * markdown form: the site's `.md` siblings, or the slices the packages
 * ship for the MCP server. `<llm-exclude when="mcp">` keeps its content
 * everywhere but the slices; `<llm-only when="mcp">` puts its content in
 * the slices alone (the site form and the HTML never see it). Every tag
 * carries a `reason="..."`, never emitted, and nothing else
 * (readLlmTagAttributes() in docs/build/md/llm-tags.js). A tag inside a
 * code fence is code and stays as written.
 *
 * This module handles the markdown side as a pre-walker pass on raw
 * source; the HTML side (docs/build/md/md-parse.js) drops every
 * <llm-only> and unwraps every <llm-exclude>, whatever the scope.
 */

import {
  MARKDOWN_FORMS,
  maskCodeLlmTags,
  readLlmTagAttributes,
  unmaskCodeLlmTags
} from '../../md/llm-tags.js'

/** @typedef {import('../../md/llm-tags.js').MarkdownForm} MarkdownForm */

const EXCLUDE_RE = /<llm-exclude((?:\s[^>]*)?)>([\s\S]*?)<\/llm-exclude>/g
const ONLY_RE = /<llm-only((?:\s[^>]*)?)>([\s\S]*?)<\/llm-only>/g
const STRAY_RE = /<\/?llm-(?:only|exclude)/

/**
 * @param {string} source raw page source
 * @param {MarkdownForm} form the markdown form being written
 * @returns {string} source with the llm-exclude blocks that apply removed and the llm-only wrappers stripped, their content dropped when they apply to the other form
 */
export function applyLlmContentControl(source, form) {
  if (!MARKDOWN_FORMS.includes(form)) {
    throw new Error(`Unknown markdown form "${form}"`)
  }
  const applies = (tag, attributes) => {
    const { when } = readLlmTagAttributes(tag, attributes)
    return when === null || when === form
  }
  const output = maskCodeLlmTags(source)
    .replace(EXCLUDE_RE, (_, attributes, body) =>
      applies('llm-exclude', attributes) ? '' : body
    )
    .replace(ONLY_RE, (_, attributes, body) =>
      applies('llm-only', attributes) ? body : ''
    )
  const stray = STRAY_RE.exec(output)
  if (stray !== null) {
    throw new Error(
      `${stray[0]}> is left over: the llm tags pair up and do not nest`
    )
  }
  return unmaskCodeLlmTags(output)
}
