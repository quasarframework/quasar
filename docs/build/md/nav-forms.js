/**
 * Which markdown forms each page of the navigation is written to: the
 * `.md` sibling the site serves next to a page ("site") and the slices
 * the packages ship for the MCP server ("mcp").
 *
 * One source, read at build time by both ends: the markdown generator
 * (build/mcp) selects its pages with it, and mdParse links a page to
 * its `.md` sibling only when the site form writes one. Nothing of it
 * reaches the browser: a compiled page either carries the link or not.
 *
 * The source is the optional `llmExclude` / `llmOnly` flags of an entry
 * of src/assets/menu.js or src/assets/links.header.js, the page-wide
 * counterparts of the <llm-exclude> / <llm-only> tags. A page is in
 * both forms by default. `llmExclude` takes the forms it names away
 * (`true` for both, `"site"` or `"mcp"` for one); `llmOnly` names the
 * forms the page is in, whatever was inherited (`"site"` or `"mcp"` for
 * that one alone, `true` for both: a page back in under an excluded
 * group). A flag on a group covers the pages under it and a deeper
 * flag has the last word; an entry setting both throws.
 * For the slices this decides only whether a page may be in one:
 * build/mcp/targets.js still says which package ships it. A page on no
 * navigation (build/unlisted-pages.js) is in neither form.
 */

import sidebarMenu from '../../src/assets/menu.js'
import {
  moreLinks,
  primaryToolbarLinks,
  secondaryToolbarLinks,
  versionLinks
} from '../../src/assets/links.header.js'

/**
 * @typedef {{ site: boolean, mcp: boolean }} LlmScope The markdown forms a page is written to.
 */

const LLM_FLAG_VALUES = [true, false, 'site', 'mcp']

/**
 * @param {object} node Navigation entry.
 * @param {'llmExclude' | 'llmOnly'} flag
 * @returns {true | 'site' | 'mcp' | null} Null when the flag is not set.
 */
function readLlmFlag(node, flag) {
  const value = node[flag]
  if (value === void 0 || value === false) {
    return null
  }
  if (!LLM_FLAG_VALUES.includes(value)) {
    throw new Error(
      `${flag} of "${node.name}" is ${JSON.stringify(value)}, expected true, false, "site" or "mcp"`
    )
  }
  return value
}

/**
 * @param {LlmScope} inherited
 * @param {object} node Navigation entry.
 * @returns {LlmScope}
 */
function llmScopeOf(inherited, node) {
  const exclude = readLlmFlag(node, 'llmExclude')
  const only = readLlmFlag(node, 'llmOnly')
  if (exclude !== null && only !== null) {
    throw new Error(
      `"${node.name}" sets both llmExclude and llmOnly, one says it all`
    )
  }
  if (only !== null) {
    return { site: only !== 'mcp', mcp: only !== 'site' }
  }
  return exclude === null
    ? inherited
    : exclude === true
      ? { site: false, mcp: false }
      : { ...inherited, [exclude]: false }
}

/**
 * The sidebar menu: an entry's path is relative to its parent's.
 *
 * @param {Array<object>} menu
 * @returns {Map<string, LlmScope>} Keyed by route, no leading slash.
 */
export function menuLlmScopes(menu) {
  const scopes = new Map()
  const walk = (node, path, inherited) => {
    const newPath = path + (node.path ? `/${node.path}` : '')
    const scope = llmScopeOf(inherited, node)
    if (node.children !== void 0) {
      for (const child of node.children) {
        walk(child, newPath, scope)
      }
    } else if (!node.external) {
      scopes.set(newPath.slice(1), scope)
    }
  }
  for (const node of menu) {
    walk(node, '', { site: true, mcp: true })
  }
  return scopes
}

/**
 * The header links: an entry's path is absolute, a group may be a page
 * too, and only the internal ones (`/route`, not `external`) are pages.
 *
 * @param {Array<object>} links
 * @returns {Map<string, LlmScope>} Keyed by route, no leading slash, no fragment.
 */
export function headerLlmScopes(links) {
  const scopes = new Map()
  const walk = (node, inherited) => {
    const scope = llmScopeOf(inherited, node)
    for (const child of node.children ?? []) {
      walk(child, scope)
    }
    if (
      typeof node.path === 'string' &&
      node.path.startsWith('/') &&
      node.external !== true
    ) {
      const key = node.path.replace(/#.*$/, '').replaceAll(/^\/|\/$/g, '')
      if (key !== '') {
        scopes.set(key, scope)
      }
    }
  }
  for (const node of links) {
    walk(node, { site: true, mcp: true })
  }
  return scopes
}

/**
 * Every page of the navigation. The sidebar is the place to flag a page
 * both list: a flag on its header entry would be a second, silent source.
 *
 * @param {Array<object>} menu
 * @param {Array<object>} links
 * @returns {Map<string, LlmScope>}
 */
export function navLlmScopes(menu, links) {
  const scopes = menuLlmScopes(menu)
  for (const [key, scope] of headerLlmScopes(links)) {
    if (!scopes.has(key)) {
      scopes.set(key, scope)
    } else if (!scope.site || !scope.mcp) {
      throw new Error(
        `/${key} is on the sidebar menu too: set its llm flags in menu.js, not in links.header.js`
      )
    }
  }
  return scopes
}

export const llmScopes = navLlmScopes(sidebarMenu, [
  ...primaryToolbarLinks,
  ...secondaryToolbarLinks,
  ...versionLinks,
  ...moreLinks
])

/**
 * @param {string} file A page source, absolute or relative to src/pages.
 * @returns {string} Its route, no leading slash: `a/b/b.md` lives at `a/b`.
 */
export function pageRoute(file) {
  const at = file.lastIndexOf('src/pages/')
  const parts = (at === -1 ? file : file.slice(at + 10))
    .replaceAll('\\', '/')
    .replace(/\.md$/, '')
    .split('/')
  if (parts.length >= 2 && parts.at(-1) === parts.at(-2)) {
    parts.pop()
  }
  return parts.join('/')
}

/**
 * @param {string} file A page source, absolute or relative to src/pages.
 * @returns {boolean} Whether the site serves a `.md` sibling of the page.
 */
export function hasSiteMarkdown(file) {
  return llmScopes.get(pageRoute(file))?.site === true
}
