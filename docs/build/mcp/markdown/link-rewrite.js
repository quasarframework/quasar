/**
 * Link rewrite rule.
 *
 * In-tree absolute paths that match a known menu entry are rewritten
 * to the relative .md sibling when that page is written by the same
 * run (`pageKeys`; every menu page when the set is absent). A menu
 * page the run leaves out keeps its root-relative href in the site
 * form (the html page is there) and becomes an absolute site URL in a
 * package slice (`siteUrl`), where nothing root-relative resolves.
 * Everything else is left alone: external URLs (any `proto:` prefix),
 * in-page anchors (`#frag`), relative paths, and absolute paths whose
 * stripped form isn't in the menu set.
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
 * @param {{ pageKeys?: Set<string> | null, siteUrl?: string | null }} [run] - the pages this run writes, and the site URL when it writes a package slice
 * @returns {string}
 */
export function rewriteLink(
  href,
  menuPaths,
  fromOutputPath = '',
  { pageKeys = null, siteUrl = null } = {}
) {
  const resolved = resolveMenuKey(href, menuPaths)
  if (resolved === null) {
    return href
  }
  const { key, query, fragment } = resolved
  if (pageKeys === null || pageKeys.has(key)) {
    return `${relativeMdPath(key, fromOutputPath)}${query}${fragment}`
  }
  return siteUrl === null ? href : `${siteUrl}/${key}${query}${fragment}`
}
