/**
 * The heading texts a page repeats. The MCP server finds a section by
 * its heading (search_docs names it, get_page extracts it, both by the
 * slug of the text, whatever the level), so one text must name one
 * section; a repeat would make the second unreachable and the first
 * wrongly named. Checked on a slice's generated body, so headings any
 * tag emits count too; the site form, which inlines the API cards and
 * their repeated Props/Slots, is not held to it. Fenced code is skipped.
 */

const HEADING_RE = /^#{1,6}\s+(.+?)\s*#*\s*$/

/**
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replaceAll('`', '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
}

/**
 * @param {string} markdown A generated page body.
 * @returns {string[]} Each repeated heading's text as first written, once.
 */
export function duplicateHeadings(markdown) {
  const seen = new Map()
  const repeated = []
  let inFence = false
  for (const line of markdown.split('\n')) {
    if (line.startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence) {
      continue
    }
    const match = HEADING_RE.exec(line)
    if (match === null) {
      continue
    }
    const slug = slugify(match[1])
    const first = seen.get(slug)
    if (first === void 0) {
      seen.set(slug, match[1])
    } else if (!repeated.includes(first)) {
      repeated.push(first)
    }
  }
  return repeated
}
