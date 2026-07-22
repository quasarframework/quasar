/**
 * Page selector. The flat menu is the source of truth for which pages to
 * include. Globbed pages NOT in the menu are orphans (logged and skipped).
 * Menu entries NOT in the glob are missing (warned).
 *
 * Per spec D12.
 */

import { sourceToMenuKey } from './routes.js'

/**
 * @typedef {Object} SelectPagesResult
 * @property {string[]} included Relative source paths that match a menu entry.
 * @property {string[]} orphans  Globbed paths with no menu entry.
 * @property {string[]} missing  Menu keys with no globbed source file.
 */

/**
 * @param {string[]} globbedRelPaths Relative source paths (forward-slash, with `.md`).
 * @param {Map<string, { title?: string }>} menuByKey Flat menu keyed by route path (no leading slash, no `.md`).
 * @returns {SelectPagesResult}
 */
export function selectPages(globbedRelPaths, menuByKey) {
  /** @type {string[]} */
  const included = []
  /** @type {string[]} */
  const orphans = []
  /** @type {Set<string>} */
  const seen = new Set()

  for (const relativePath of globbedRelPaths) {
    const key = sourceToMenuKey(relativePath)
    if (menuByKey.has(key)) {
      included.push(relativePath)
      seen.add(key)
    } else {
      orphans.push(relativePath)
    }
  }

  /** @type {string[]} */
  const missing = []
  for (const key of menuByKey.keys()) {
    if (!seen.has(key)) {
      missing.push(key)
    }
  }

  return { included, orphans, missing }
}
