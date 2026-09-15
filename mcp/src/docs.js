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
 * @typedef {object} SearchHit
 * @property {Page} page
 * @property {number} score
 * @property {string | null} snippet The first body line mentioning a term.
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
export function searchDocs(docs, query, { limit = 10, packageName } = {}) {
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
    let snippet = null
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
    for (const line of body.replace(FRONTMATTER_RE, '').split('\n')) {
      const lower = line.toLowerCase()
      if (
        !line.startsWith('#') &&
        queryTerms.some(term => lower.includes(term))
      ) {
        snippet = line.trim().slice(0, 200)
        break
      }
    }
    hits.push({ page, score, snippet })
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
