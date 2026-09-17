/**
 * Link rewrite rule.
 *
 * In-tree absolute paths that match a known menu entry are rewritten
 * to the relative .md sibling when that page is written by the same
 * run (`pageKeys`; every page the site form writes when the set is
 * absent, `sitePages`). A menu page the run leaves out keeps its
 * root-relative href in the site form (the html page is there) and
 * becomes an absolute site URL in a package slice (`siteUrl`), where
 * nothing root-relative resolves. Everything else is left alone:
 * external URLs (any `proto:` prefix), in-page anchors (`#frag`),
 * relative paths, and absolute paths whose stripped form isn't in the
 * menu set.
 *
 * A slice may only link what an agent can read: unreachableLink()
 * names the in-tree hrefs that lead to no documentation page, for the
 * emitters to warn about.
 *
 * Both `?query` and `#fragment` are peeled off before matching the
 * menu, then re-attached verbatim in the rewritten output. We strip
 * fragment first then query (fragment always comes last in a URL),
 * but the result is order-independent.
 */

import { relativeMdPath } from '../pages/routes.js'

/**
 * The menu entry an in-tree href points at, with its query and
 * fragment set aside. Null for anything that is not an in-tree href
 * to a menu page.
 *
 * A link like `/quasar-plugins` matches no menu entry because the menu
 * indexes per-page slugs, not section roots. On the live site such
 * links land on the section's introduction page, so `{root}/introduction`
 * is tried before giving up.
 *
 * @param {string} href - the href as authored in markdown
 * @param {Set<string>} menuPaths - menu entry paths (no leading slash, no `.md` suffix)
 * @returns {{ key: string, query: string, fragment: string } | null}
 */
export function resolveMenuKey(href, menuPaths) {
  if (!href || href.startsWith('#') || /^[a-z]+:/i.test(href)) {
    return null // anchor, or protocol (http:, mailto:, etc.)
  }
  if (!href.startsWith('/')) {
    return null // relative
  }

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
    return { key: cleanPath, query, fragment }
  }
  if (cleanPath && !cleanPath.includes('/')) {
    const introCandidate = `${cleanPath}/introduction`
    if (menuPaths.has(introCandidate)) {
      return { key: introCandidate, query, fragment }
    }
  }
  return null
}

/**
 * Rewrite an in-tree absolute href per the rule above. Returns the
 * input unchanged when it is not one, or when its page is not a menu
 * entry.
 *
 * @param {string} href - the href as authored in markdown
 * @param {Set<string>} menuPaths - menu entry paths (no leading slash, no `.md` suffix)
 * @param {string} [fromOutputPath] - output path of the linking file, so the result resolves relative to it
 * @param {{ pageKeys?: Set<string> | null, sitePages?: Set<string> | null, siteUrl?: string | null }} [run] - the pages this run writes, the pages the site form writes, and the site URL when it writes a package slice
 * @returns {string}
 */
export function rewriteLink(
  href,
  menuPaths,
  fromOutputPath = '',
  { pageKeys = null, sitePages = null, siteUrl = null } = {}
) {
  const resolved = resolveMenuKey(href, menuPaths)
  if (resolved === null) {
    return href
  }
  const { key, query, fragment } = resolved
  const written = pageKeys ?? sitePages
  if (written === null || written.has(key)) {
    return `${relativeMdPath(key, fromOutputPath)}${query}${fragment}`
  }
  return siteUrl === null ? href : `${siteUrl}/${key}${query}${fragment}`
}

/**
 * Why an in-tree href cannot be followed from the page being written:
 * it matches no menu page (a typo, in any form), or, in a package
 * slice, the page it matches is one the site form does not write (an
 * interactive page), so no markdown of it exists anywhere. Null when
 * the href is fine, or not in-tree at all.
 *
 * @param {string} href - the href as authored
 * @param {{ menuPaths?: Set<string>, pageKeys?: Set<string> | null, sitePages?: Set<string> | null, siteUrl?: string | null }} run
 * @returns {string | null}
 */
export function unreachableLink(
  href,
  { menuPaths = new Set(), pageKeys = null, sitePages = null, siteUrl = null }
) {
  if (!href.startsWith('/') || href.startsWith('//')) {
    return null
  }
  const resolved = resolveMenuKey(href, menuPaths)
  if (resolved === null) {
    return 'matches no documentation page'
  }
  if (
    siteUrl !== null &&
    !pageKeys?.has(resolved.key) &&
    sitePages !== null &&
    !sitePages.has(resolved.key)
  ) {
    return 'leads to a page of the site only, wrap it in <llm-exclude when="mcp" reason="...">'
  }
  return null
}
