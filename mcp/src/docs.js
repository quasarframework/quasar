import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const SITE_URL_RE = /^https?:\/\/(?:v2\.)?quasar\.dev\//
const HEADING_RE = /^(#{1,6})\s+(.+?)\s*#*\s*$/
const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n/

/**
 * @typedef {object} Page
 * @property {string} route Menu key, e.g. `vue-components/button`.
 * @property {string} title
 * @property {string | null} desc
 * @property {string} packageName The installed package whose slice holds the page.
 * @property {string} file Absolute path of the markdown file.
 */

/**
 * @typedef {object} Docs
 * @property {Map<string, Page>} pages Keyed by route.
 * @property {Array<{ name: string, version: string, pageCount: number }>} sources
 */

/**
 * Index every bundled slice. Bodies are read on demand and cached.
 *
 * @param {import('./project.js').InstalledPackage[]} packages
 * @returns {Docs}
 */
export function loadDocs(packages) {
  const pages = new Map()
  const sources = []
  for (const pkg of packages) {
    if (pkg.docsDir === null) {
      continue
    }
    const meta = JSON.parse(
      readFileSync(join(pkg.docsDir, 'meta.json'), 'utf8')
    )
    let pageCount = 0
    for (const { route, title, desc } of meta.pages) {
      // A page both slices carry (the agent setup page) is served once.
      if (pages.has(route)) {
        continue
      }
      pages.set(route, {
        route,
        title,
        desc: desc ?? null,
        packageName: pkg.name,
        file: join(pkg.docsDir, `${route}.md`)
      })
      pageCount++
    }
    sources.push({ name: pkg.name, version: meta.version, pageCount })
  }
  return { pages, sources }
}

/**
 * Accepts what an agent is likely to paste: a route, a `/route`, a
 * `route.md`, a `../route.md` link from another page, or a quasar.dev
 * URL, with or without a fragment.
 *
 * @param {string} input
 * @returns {string}
 */
export function normalizeRoute(input) {
  let route = input.trim().replace(SITE_URL_RE, '')
  const hashIndex = route.indexOf('#')
  if (hashIndex !== -1) {
    route = route.slice(0, hashIndex)
  }
  return route
    .replace(/^(\.\.?\/)+/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .replace(/\.md$/, '')
}

const bodyCache = new Map()

/**
 * @param {Page} page
 * @returns {string} The markdown, frontmatter included.
 */
export function readPage(page) {
  let body = bodyCache.get(page.file)
  if (body === void 0) {
    body = readFileSync(page.file, 'utf8')
    bodyCache.set(page.file, body)
  }
  return body
}

/**
 * @param {string} markdown
 * @returns {Array<{ level: number, text: string }>}
 */
export function listHeadings(markdown) {
  const headings = []
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
    if (match !== null) {
      headings.push({ level: match[1].length, text: match[2] })
    }
  }
  return headings
}

/**
 * The part of a page under one heading: from that heading up to the
 * next heading of the same or a higher level. Matched case-insensitively
 * on the heading text; a `#fragment`-style slug matches too.
 *
 * @param {string} markdown
 * @param {string} heading
 * @returns {string | null}
 */
export function extractSection(markdown, heading) {
  const wanted = slugify(heading)
  const lines = markdown.split('\n')
  let start = -1
  let level = 0
  let inFence = false
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
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
    if (start === -1) {
      if (slugify(match[2]) === wanted) {
        start = index
        level = match[1].length
      }
    } else if (match[1].length <= level) {
      return lines.slice(start, index).join('\n').trim()
    }
  }
  return start === -1 ? null : lines.slice(start).join('\n').trim()
}

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
 * @param {string} text
 * @returns {string[]}
 */
function terms(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9$@.-]+/)
    .filter(term => term.length > 1)
}

/**
 * The headings under which the terms occur, the section most about
 * the query first, so the caller can read that section instead of
 * the page. A term weighs the inverse of how many sections mention
 * it: on a page about tables "table" is everywhere and says nothing
 * about a section, "sorting" is in a few and marks them. A term in
 * the heading itself counts extra, the more so the shorter the
 * heading ("Sorting" over "Custom sorting" over "Server side
 * pagination, filter and sorting"), and occurrences break ties. The
 * heading in effect is the nearest one above a line, whatever its
 * level; text inside fences counts, fence markers and frontmatter do
 * not.
 *
 * @param {string} markdown
 * @param {string[]} queryTerms Lower-case.
 * @param {number} [limit]
 * @returns {string[]}
 */
export function matchedSections(markdown, queryTerms, limit = 3) {
  /** @type {Map<string, { words: string[], counts: Map<string, number> }>} */
  const sections = new Map()
  let current = null
  let inFence = false
  for (const line of markdown.replace(FRONTMATTER_RE, '').split('\n')) {
    if (line.startsWith('```')) {
      inFence = !inFence
      continue
    }
    const match = inFence ? null : HEADING_RE.exec(line)
    if (match !== null) {
      current = { words: terms(match[2]), counts: new Map() }
      sections.set(match[2], current)
    }
    if (current === null) {
      continue
    }
    const lower = line.toLowerCase()
    for (const term of queryTerms) {
      const occurrences = lower.split(term).length - 1
      if (occurrences !== 0) {
        current.counts.set(term, (current.counts.get(term) ?? 0) + occurrences)
      }
    }
  }
  const sectionsWith = term =>
    [...sections.values()].filter(({ counts }) => counts.has(term)).length
  const weight = new Map(queryTerms.map(term => [term, 1 / sectionsWith(term)]))
  const score = ({ words, counts }) => {
    let total = 0
    for (const [term, occurrences] of counts) {
      const inHeading = words.some(word => word.includes(term))
      total +=
        weight.get(term) * (1 + (inHeading ? 2 / words.length : 0)) +
        Math.min(occurrences, 9) / 1000
    }
    return total
  }
  return [...sections]
    .filter(([, stats]) => stats.counts.size !== 0)
    .sort((a, b) => score(b[1]) - score(a[1]))
    .slice(0, limit)
    .map(([text]) => text)
}

/**
 * @typedef {object} SearchHit
 * @property {Page} page
 * @property {number} score
 * @property {string[]} sections The headings the terms occur under, see matchedSections().
 */

/**
 * Term matching over the page index and bodies. A term found in the
 * title weighs most, then the route and the description, then the
 * headings, then how often the body mentions it (capped, so a long page
 * cannot outrank the page about the subject). Every term must appear
 * somewhere in the page.
 *
 * @param {Docs} docs
 * @param {string} query
 * @param {{ limit?: number, packageName?: string }} [opts]
 * @returns {SearchHit[]}
 */
export function searchDocs(docs, query, { limit = 5, packageName } = {}) {
  const queryTerms = terms(query)
  if (queryTerms.length === 0) {
    return []
  }
  const hits = []
  for (const page of docs.pages.values()) {
    if (packageName !== void 0 && page.packageName !== packageName) {
      continue
    }
    const title = page.title.toLowerCase()
    const route = page.route.toLowerCase()
    const desc = (page.desc ?? '').toLowerCase()
    const body = readPage(page)
    const bodyLower = body.toLowerCase()
    const headingText = listHeadings(body)
      .map(heading => heading.text)
      .join(' ')
      .toLowerCase()
    let score = 0
    for (const term of queryTerms) {
      let termScore = 0
      if (title.includes(term)) {
        termScore += title === term ? 60 : 30
      }
      if (route.includes(term)) {
        termScore += 15
      }
      if (desc.includes(term)) {
        termScore += 10
      }
      if (headingText.includes(term)) {
        termScore += 8
      }
      termScore += Math.min(bodyLower.split(term).length - 1, 20)
      if (termScore === 0) {
        score = 0
        break
      }
      score += termScore
    }
    if (score === 0) {
      continue
    }
    hits.push({ page, score, sections: matchedSections(body, queryTerms) })
  }
  hits.sort(
    (a, b) => b.score - a.score || a.page.route.localeCompare(b.page.route)
  )
  return hits.slice(0, limit)
}

/**
 * Routes resembling a miss. Inside a section some installed package
 * serves, a loose match on the last segment (a typo, a plural); in a
 * section nothing serves, only a page of that exact name, so a route
 * of a package that is not installed does not get a look-alike from
 * another section.
 *
 * @param {Docs} docs
 * @param {string} route
 * @returns {string[]}
 */
export function similarRoutes(docs, route) {
  const parts = route.split('/')
  const needle = parts.at(-1) ?? route
  const section = parts.length > 1 ? `${parts.slice(0, -1).join('/')}/` : null
  const known = [...docs.pages.keys()]
  const loose =
    section === null || known.some(candidate => candidate.startsWith(section))
  return known
    .filter(candidate => {
      const leaf = candidate.split('/').at(-1)
      return loose
        ? candidate.includes(needle) || needle.includes(leaf)
        : leaf === needle
    })
    .slice(0, 8)
}
