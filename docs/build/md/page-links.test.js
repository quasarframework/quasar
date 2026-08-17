import { expect, test } from 'vitest'

import { collectPageIds } from './page-ids.js'
import { renderAllPages } from './test-helpers.js'

// what md-plugin-link turns every markdown link into. Read off the render
// rather than the source so that links inside fenced code are not counted:
// by the time the page is HTML those are escaped and no longer match
const linkRE = /<doc-link[^>]*\sto="([^"]+)"/g

// the ids a page offers and the links it asks of other pages come out of the
// same render, and neither can be checked without the other
const pages = renderAllPages().map(({ rel, route, html, frontMatter }) => ({
  rel,
  route,
  ids: new Set(collectPageIds(html, frontMatter).map(entry => entry.id)),
  links: [...html.matchAll(linkRE)].map(([, link]) => link)
}))

const byRoute = new Map(pages.map(page => [page.route, page]))

/** The page a link asks for, and the id on it, or null when it asks the web */
function resolve(link, from) {
  if (link.startsWith('#')) {
    return { target: from, anchor: link.slice(1) }
  }

  if (!link.startsWith('/')) return null

  const [path, anchor] = link.split('#')

  return { target: byRoute.get(path.replace(/\/$/, '')), anchor, path }
}

test('the pages and their links exist to be swept', () => {
  const links = pages.flatMap(page => page.links)

  expect(pages.length).toBeGreaterThan(250)
  // a link regex that stopped matching would make every sweep below pass.
  // The anchored ones are counted on their own because they are the half
  // that is actually hard to keep true, and the cheapest to lose silently
  expect(links.length).toBeGreaterThan(1000)
  expect(links.filter(link => link.includes('#')).length).toBeGreaterThan(150)
})

test('every link into the site points at a page that exists', () => {
  const offenders = []

  for (const page of pages) {
    for (const link of page.links) {
      const resolved = resolve(link, page)

      if (resolved !== null && resolved.target === void 0) {
        offenders.push(`${page.rel} -> ${link}`)
      }
    }
  }

  expect(offenders).toEqual([])
})

test('every link with an anchor points at an id that page renders', () => {
  const offenders = []

  for (const page of pages) {
    for (const link of page.links) {
      const resolved = resolve(link, page)

      // a link to a page that does not exist is the other test's to report
      if (resolved === null || resolved.target === void 0) continue
      if (resolved.anchor === void 0) continue

      if (!resolved.target.ids.has(resolved.anchor)) {
        offenders.push(`${page.rel} -> ${link}`)
      }
    }
  }

  expect(offenders).toEqual([])
})
