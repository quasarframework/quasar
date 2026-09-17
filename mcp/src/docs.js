import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { slugify } from './slugify.js'

/**
 * The slice format this server reads (meta.json `format`, written by
 * the docs generator, docs/build/mcp/output/meta.js). A slice of
 * another format is left out and named in the instructions: the
 * server's major version tracks the format, so `@quasar/mcp@<format>`
 * is the server for it. One reader, no legacy readers.
 */
export const DOCS_FORMAT = 1

const SITE_URL_RE = /^https?:\/\/(?:v2\.)?quasar\.dev\//
const HEADING_RE = /^(#{1,6})\s+(.+?)\s*#*\s*$/
const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n/

/**
 * @typedef {object} Page
 * @property {string} route Menu key, e.g. `vue-components/button`.
 * @property {string} title
 * @property {string | null} desc
 * @property {string[]} keys The names the page documents (components, plugins, directives, composables, functions), as the docs frontmatter lists them; empty in a slice predating the field.
 * @property {string} packageName The installed package whose slice holds the page.
 * @property {string} file Absolute path of the markdown file.
 */

/**
 * @typedef {object} Docs
 * @property {Map<string, Page>} pages Keyed by route.
 * @property {Array<{ name: string, version: string, pageCount: number }>} sources
 * @property {Array<{ name: string, version: string, format: number }>} unreadable Installed slices of another format than DOCS_FORMAT, left out.
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
  const unreadable = []
  for (const pkg of packages) {
    if (pkg.docsDir === null) {
      continue
    }
    const meta = JSON.parse(
      readFileSync(join(pkg.docsDir, 'meta.json'), 'utf8')
    )
    // the first slices predate the field
    const format = meta.format ?? 1
    if (format !== DOCS_FORMAT) {
      unreadable.push({ name: pkg.name, version: meta.version, format })
      continue
    }
    let pageCount = 0
    for (const { route, title, desc, keys } of meta.pages) {
      // A page both slices carry (the agent setup page) is served once.
      if (pages.has(route)) {
        continue
      }
      pages.set(route, {
        route,
        title,
        desc: desc ?? null,
        keys: keys ?? [],
        packageName: pkg.name,
        file: join(pkg.docsDir, `${route}.md`)
      })
      pageCount++
    }
    sources.push({ name: pkg.name, version: meta.version, pageCount })
  }
  return { pages, sources, unreadable }
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

/**
 * The heading a pasted link points at: the fragment of a `route.md#slug`
 * link or of a quasar.dev URL, null without one.
 *
 * @param {string} input
 * @returns {string | null}
 */
export function routeFragment(input) {
  const hashIndex = input.indexOf('#')
  const fragment = hashIndex === -1 ? '' : input.slice(hashIndex + 1).trim()
  return fragment === '' ? null : fragment
}

/**
 * What reading the whole page costs, so the caller can pick a section
 * instead: markdown and code run to about four bytes a token.
 *
 * @param {Page} page
 * @returns {string} E.g. `~400 tokens`, `~12k tokens`.
 */
export function pageSize(page) {
  const tokens = statSync(page.file).size / 4
  return tokens < 950
    ? `~${Math.max(1, Math.round(tokens / 100)) * 100} tokens`
    : `~${Math.round(tokens / 1000)}k tokens`
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
 * The terms of a text: lower-case runs of letters, digits and the
 * characters identifiers carry (`q-btn`, `$q.notify`, `@click`,
 * `vue.config`), trimmed of the dots and dashes punctuation leaves at
 * either end (`notify.`), one character dropped.
 *
 * @param {string} text
 * @returns {string[]}
 */
function terms(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9$@.-]+/)
    .map(term => term.replaceAll(/^[.-]+|[.-]+$/g, ''))
    .filter(term => term.length > 1)
}

/**
 * The form terms compare in: dashes and dots dropped, so the tag,
 * the component and the key are one word (`q-btn`, `QBtn`, `qbtn`),
 * as are `v-touch-pan` and `TouchPan`.
 *
 * @param {string} term
 * @returns {string}
 */
function flat(term) {
  return term.replaceAll(/[-.]/g, '')
}

/**
 * The comparable words of a text: its terms, flat, plus the parts of
 * the compound ones, so `btn` finds `q-btn` and `components` finds
 * `vue-components`.
 *
 * @param {string} text
 * @returns {string[]}
 */
function words(text) {
  const list = []
  for (const term of terms(text)) {
    list.push(flat(term))
    if (/[-.]/.test(term)) {
      for (const part of term.split(/[-.]+/)) {
        if (part.length > 1) {
          list.push(part)
        }
      }
    }
  }
  return list
}

/**
 * A plural and its singular stem alike (`buttons`/`button`,
 * `classes`/`class`, `properties`/`property`). Consistent, not correct:
 * both sides of a comparison go through it.
 *
 * @param {string} word
 * @returns {string}
 */
function stem(word) {
  if (word.length < 4 || !word.endsWith('s') || word.endsWith('ss')) {
    return word
  }
  if (word.endsWith('ies')) {
    return `${word.slice(0, -3)}y`
  }
  if (/(?:ss|sh|ch|x)es$/.test(word)) {
    return word.slice(0, -2)
  }
  return word.slice(0, -1)
}

/**
 * How well a term matches one word: the word itself, its plural or
 * singular, or a word starting with it (`valid` for `validation`, three
 * characters at least so `to` does not match `toolbar`).
 *
 * @param {string} term
 * @param {string} word
 * @returns {number} 0 for no match, else 0.5 to 1.
 */
function wordStrength(term, word) {
  if (word === term) {
    return 1
  }
  if (stem(word) === stem(term)) {
    return 0.8
  }
  return term.length >= 3 && word.startsWith(term) ? 0.5 : 0
}

/**
 * The best match of a term among some words.
 *
 * @param {string} term
 * @param {string[]} list
 * @returns {number}
 */
function strength(term, list) {
  let best = 0
  for (const word of list) {
    const current = wordStrength(term, word)
    if (current > best) {
      best = current
      if (best === 1) {
        break
      }
    }
  }
  return best
}

const API_HEADING_RE = /^(\S+) API$/

/**
 * @typedef {object} PageIndex
 * @property {string[]} title
 * @property {string[]} titleStems
 * @property {string[]} route
 * @property {string[]} desc
 * @property {string[]} headings
 * @property {string[]} names The names the page documents, flat: its meta `keys`, and the `<Name> API` headings for a slice predating the field.
 * @property {Map<string, number>} body Occurrences per distinct body word.
 * @property {Map<string, number>} bodyStems Occurrences per distinct body word stem.
 * @property {string[]} bodyWords The distinct body words, sorted.
 */

const indexCache = new Map()

/**
 * @param {Page} page
 * @returns {PageIndex}
 */
function indexPage(page) {
  let index = indexCache.get(page.file)
  if (index !== void 0) {
    return index
  }
  const markdown = readPage(page)
  const headings = listHeadings(markdown).map(heading => heading.text)
  const names = new Set(page.keys)
  for (const heading of headings) {
    const match = API_HEADING_RE.exec(heading)
    if (match !== null) {
      names.add(match[1])
    }
  }
  const body = new Map()
  for (const word of words(markdown.replace(FRONTMATTER_RE, ''))) {
    body.set(word, (body.get(word) ?? 0) + 1)
  }
  const bodyStems = new Map()
  for (const [word, count] of body) {
    const key = stem(word)
    bodyStems.set(key, (bodyStems.get(key) ?? 0) + count)
  }
  const title = words(page.title)
  index = {
    title,
    titleStems: title.map(stem),
    route: words(page.route),
    desc: words(page.desc ?? ''),
    headings: words(headings.join(' ')),
    names: [...names].map(name => flat(name.toLowerCase())),
    body,
    bodyStems,
    bodyWords: [...body.keys()].sort()
  }
  indexCache.set(page.file, index)
  return index
}

/**
 * How much a body is about a term: the occurrences of the words it
 * matches, each by how well (as wordStrength() rates them), on a log
 * scale so a long page's hundredth mention adds nothing (1 occurrence:
 * 2, 7: 6, 63: 12, the cap).
 *
 * @param {string} term
 * @param {PageIndex} index
 * @returns {{ occurrences: number, score: number }}
 */
function bodyMatch(term, { body, bodyStems, bodyWords }) {
  const exact = body.get(term) ?? 0
  const termStem = stem(term)
  const stemmed = (bodyStems.get(termStem) ?? 0) - exact
  let prefixed = 0
  if (term.length >= 3) {
    // the words starting with the term sit together in the sorted list
    let low = 0
    let high = bodyWords.length
    while (low < high) {
      const middle = (low + high) >>> 1
      if (bodyWords[middle] < term) {
        low = middle + 1
      } else {
        high = middle
      }
    }
    for (; low < bodyWords.length && bodyWords[low].startsWith(term); low++) {
      const word = bodyWords[low]
      if (word !== term && stem(word) !== termStem) {
        prefixed += body.get(word)
      }
    }
  }
  const occurrences = exact + 0.8 * stemmed + 0.5 * prefixed
  return {
    occurrences,
    score: Math.min(2 * Math.log2(1 + occurrences), 12)
  }
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
 * not. Terms match words as in searchDocs().
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
      current = { words: words(match[2]), counts: new Map() }
      sections.set(match[2], current)
    }
    if (current === null) {
      continue
    }
    const lineWords = words(line)
    for (const term of queryTerms) {
      let occurrences = 0
      for (const word of lineWords) {
        occurrences += wordStrength(term, word)
      }
      if (occurrences !== 0) {
        current.counts.set(term, (current.counts.get(term) ?? 0) + occurrences)
      }
    }
  }
  const sectionsWith = term =>
    [...sections.values()].filter(({ counts }) => counts.has(term)).length
  const weight = new Map(queryTerms.map(term => [term, 1 / sectionsWith(term)]))
  const score = ({ words: headingWords, counts }) => {
    let total = 0
    for (const [term, occurrences] of counts) {
      const inHeading = strength(term, headingWords)
      total +=
        weight.get(term) *
          (1 + (inHeading === 0 ? 0 : (2 * inHeading) / headingWords.length)) +
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
 * Term matching over the page index and bodies. A term matches a word
 * (see wordStrength()), never part of one: "tab" is Tabs, not Table.
 * What the page is about weighs most: a term naming what it documents
 * (its `keys`: `QBtn`, `q-btn`, `useMeta`, `v-ripple`) or covering
 * the title whole ("Virtual Scroll" for "virtual scroll"), a third of
 * that for a title it is only part of, less again for the description
 * or the route, which restate the title; one of those counts, the
 * best. Then the headings and how often the body mentions it, on a log
 * scale so a long page cannot outrank the page about the subject;
 * those weigh the inverse of how many pages the term matches, so "to",
 * "use" and "component" decide nothing and "notify" everything. The
 * subject does not: a tag every example uses is no less the name of
 * its page.
 * Every term must match somewhere in the page. Ties go to the page
 * mentioning the terms most, then the first route.
 *
 * @param {Docs} docs
 * @param {string} query
 * @param {{ limit?: number, packageName?: string }} [opts]
 * @returns {SearchHit[]}
 */
export function searchDocs(docs, query, { limit = 5, packageName } = {}) {
  const queryTerms = [...new Set(terms(query).map(flat))]
  if (queryTerms.length === 0) {
    return []
  }
  const queryStems = new Set(queryTerms.map(stem))
  const pages = [...docs.pages.values()].filter(
    page => packageName === void 0 || page.packageName === packageName
  )
  // pass one: how each term matches each page, and in how many pages
  const pagesWith = queryTerms.map(() => 0)
  const matches = []
  for (const page of pages) {
    const index = indexPage(page)
    const titleWeight = index.titleStems.every(word => queryStems.has(word))
      ? 60
      : 20
    const subjects = []
    const mentions = []
    let occurrences = 0
    for (const [at, term] of queryTerms.entries()) {
      const body = bodyMatch(term, index)
      const subject = Math.max(
        titleWeight * strength(term, index.title),
        60 * strength(term, index.names),
        10 * strength(term, index.desc),
        5 * strength(term, index.route)
      )
      const mention = 15 * strength(term, index.headings) + body.score
      if (subject + mention !== 0) {
        pagesWith[at]++
      }
      subjects.push(subject)
      mentions.push(mention)
      occurrences += body.occurrences
    }
    if (subjects.every((subject, at) => subject + mentions[at] !== 0)) {
      matches.push({ page, subjects, mentions, occurrences })
    }
  }
  // pass two: a term in every page decides nothing, a rare one a lot
  const weight = pagesWith.map(count => Math.log((pages.length + 1) / count))
  const hits = matches.map(({ page, subjects, mentions, occurrences }) => ({
    page,
    score: queryTerms.reduce(
      (total, _, at) => total + subjects[at] + mentions[at] * weight[at],
      0
    ),
    occurrences
  }))
  hits.sort(
    (a, b) =>
      b.score - a.score ||
      b.occurrences - a.occurrences ||
      a.page.route.localeCompare(b.page.route)
  )
  return hits.slice(0, limit).map(({ page, score }) => ({
    page,
    score,
    sections: matchedSections(readPage(page), queryTerms)
  }))
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
