/**
 * What the site's HTML pipeline (md-parse.js) and the markdown forms
 * (mcp/markdown/llm-content-control.js) share about the <llm-only> and
 * <llm-exclude> tags: which attributes they take, and that a tag inside
 * code, a fence or an inline span, is code, not a tag.
 */

/** @typedef {'site' | 'mcp'} MarkdownForm */

export const MARKDOWN_FORMS = ['site', 'mcp']

const ATTRIBUTE_RE = /([^\s="]+)(?:="([^"]*)")?/g
const FENCE_RE = /^ {0,3}(`{3,}|~{3,})/
const INLINE_CODE_RE = /`[^`\n]+`/g
const TAG_RE = /<(\/?)llm-/g
// no page source holds one, so it can stand for "this one is code"
const MASK = '\0'

/**
 * Both tags take `reason` (required: whoever edits the page next has to
 * know why the block is there) and `when` (optional: the one markdown
 * form the tag applies to). Anything else is a typo that would otherwise
 * change nothing, silently, so it stops the build.
 *
 * @param {string} tag `llm-only` or `llm-exclude`.
 * @param {string} attributes The opening tag's attribute string.
 * @returns {{ when: MarkdownForm | null }}
 */
export function readLlmTagAttributes(tag, attributes) {
  const found = {}
  for (const [, name, value] of attributes.matchAll(ATTRIBUTE_RE)) {
    if (name !== 'when' && name !== 'reason') {
      throw new Error(
        `Unknown attribute "${name}" on <${tag}>, it takes reason="..." and when="site|mcp"`
      )
    }
    if (value === void 0) {
      throw new Error(`Attribute "${name}" on <${tag}> needs a value`)
    }
    found[name] = value
  }
  if (found.reason === void 0 || found.reason.trim() === '') {
    throw new Error(`<${tag}> needs a reason="..." saying why it is there`)
  }
  if (found.when !== void 0 && !MARKDOWN_FORMS.includes(found.when)) {
    throw new Error(
      `Unknown value when="${found.when}" on <${tag}>, expected one of: ${MARKDOWN_FORMS.join(', ')}`
    )
  }
  return { when: /** @type {MarkdownForm} */ (found.when) ?? null }
}

/** @param {string} code */
const mask = code => code.replace(TAG_RE, `<$1${MASK}llm-`)

/**
 * Hide the tags written inside code, fenced or inline, from the passes
 * that consume them, so a page can show the tags it documents. A fence
 * inside an <llm-only> block is still a fence: the block is kept or
 * dropped whole either way.
 *
 * @param {string} source raw page source
 * @returns {string} to be handed to unmaskCodeLlmTags() once the tags are consumed
 */
export function maskCodeLlmTags(source) {
  let fence = null
  return source
    .split('\n')
    .map(line => {
      const marker = FENCE_RE.exec(line)?.[1]
      if (fence === null) {
        fence = marker ?? null
        return marker === void 0 ? line.replace(INLINE_CODE_RE, mask) : line
      }
      if (
        marker !== void 0 &&
        marker[0] === fence[0] &&
        marker.length >= fence.length &&
        line.trim() === marker
      ) {
        fence = null
        return line
      }
      return mask(line)
    })
    .join('\n')
}

/**
 * @param {string} source
 * @returns {string}
 */
export function unmaskCodeLlmTags(source) {
  return source.replaceAll(`${MASK}llm-`, 'llm-')
}
