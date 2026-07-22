/**
 * Link rewrite rule per spec D6.
 *
 * In-tree absolute paths that match a known menu entry are rewritten
 * to the relative .md sibling. Everything else is left alone: external
 * URLs (any `proto:` prefix), in-page anchors (`#frag`), relative paths,
 * and absolute paths whose stripped form isn't in the menu set.
 *
 * Both `?query` and `#fragment` are peeled off before matching the
 * menu, then re-attached verbatim in the rewritten output. We strip
 * fragment first then query (fragment always comes last in a URL),
 * but the result is order-independent.
 */

import { relativeMdPath } from '../routes.js'

/**
 * Rewrite an in-tree absolute href to a relative `.md` path when it
 * matches a known menu entry. Returns the input unchanged otherwise.
 *
 * @param {string} href - the href as authored in markdown
 * @param {Set<string>} menuPaths - menu entry paths (no leading slash, no `.md` suffix)
 * @param {string} [fromOutputPath] - output path of the linking file, so the result resolves relative to it
 * @returns {string}
 */
export function rewriteLink(href, menuPaths, fromOutputPath = '') {
  if (!href || href.startsWith('#')) {
    return href
  }
  if (/^[a-z]+:/i.test(href)) {
    return href // protocol (http:, mailto:, etc.)
  }
  if (!href.startsWith('/')) {
    return href // relative
  }

  // Peel off fragment (#...) and query (?...) so the path matches menu keys cleanly.
  // Fragment is last in a well-formed URL, so strip it first.
  let rest = href
  let fragment = ''
  let query = ''
  const hashIndex = rest.indexOf('#')
  if (hashIndex !== -1) {
    fragment = rest.slice(hashIndex)
    rest = rest.slice(0, hashIndex)
  }
  const queryIndex = rest.indexOf('?')
  if (queryIndex !== -1) {
    query = rest.slice(queryIndex)
    rest = rest.slice(0, queryIndex)
  }
  const cleanPath = rest.replace(/\/$/, '').replace(/^\//, '')

  if (menuPaths.has(cleanPath)) {
    return `${relativeMdPath(cleanPath, fromOutputPath)}${query}${fragment}`
  }

  // Root-path fallback. A link like `/quasar-plugins` matches no menu entry
  // because the menu indexes per-page slugs, not section roots. On the live
  // site such links land on the section's introduction page, so try
  // `{root}/introduction` before giving up.
  if (cleanPath && !cleanPath.includes('/')) {
    const introCandidate = `${cleanPath}/introduction`
    if (menuPaths.has(introCandidate)) {
      return `${relativeMdPath(introCandidate, fromOutputPath)}${query}${fragment}`
    }
  }
  return href
}
