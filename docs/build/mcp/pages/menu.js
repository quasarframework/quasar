/**
 * Menu as the source of truth for page selection. Merges the sidebar menu
 * (flat-menu.js) with pages referenced only from the header navigation
 * (links.header.js). Either nav source promotes a page from orphan to
 * included.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import matter from 'gray-matter'

import { sourceToMenuKey } from './routes.js'
import { flatMenu } from '../../md/flat-menu.js'
import sidebarMenu from '../../../src/assets/menu.js'
import {
  moreLinks,
  primaryToolbarLinks,
  secondaryToolbarLinks,
  versionLinks
} from '../../../src/assets/links.header.js'

/**
 * Walk a header-links tree and collect every internal page path, recursing
 * into `children`. Internal means it starts with `/` and lacks
 * `external: true`. The leading `/`, trailing `/` and any `#fragment` are
 * stripped so the slug matches `menuByKey` shape.
 *
 * @param {Array<object>} nodes
 * @param {Set<string>} pathSet Accumulated path slugs (no leading slash, no .md, no fragment).
 * @returns {void}
 */
function collectHeaderPaths(nodes, pathSet) {
  for (const node of nodes) {
    if (Array.isArray(node.children)) {
      collectHeaderPaths(node.children, pathSet)
    }
    if (typeof node.path !== 'string') {
      continue
    }
    if (node.external === true) {
      continue
    }
    if (!node.path.startsWith('/')) {
      continue
    }

    let pathSlug = node.path.replace(/^\//, '').replace(/\/$/, '')
    const hashIndex = pathSlug.indexOf('#')
    if (hashIndex !== -1) {
      pathSlug = pathSlug.slice(0, hashIndex)
    }
    if (pathSlug) {
      pathSet.add(pathSlug)
    }
  }
}

/**
 * @typedef {{ site: boolean, mcp: boolean }} LlmScope The markdown forms a page is written to.
 */

/**
 * @typedef {object} MenuEntry
 * @property {string | null} title
 * @property {string | null} desc
 * @property {string[]} keys The page's frontmatter `keys`: the components, plugins, directives, composables or functions it documents.
 * @property {LlmScope} llm
 */

const LLM_FLAG_VALUES = [true, false, 'site', 'mcp']

/**
 * @param {object} node Menu node.
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
      `menu.js: ${flag} of "${node.name}" is ${JSON.stringify(value)}, expected true, false, "site" or "mcp"`
    )
  }
  return value
}

/**
 * @param {LlmScope} inherited
 * @param {object} node Menu node.
 * @returns {LlmScope}
 */
function llmScopeOf(inherited, node) {
  const exclude = readLlmFlag(node, 'llmExclude')
  const only = readLlmFlag(node, 'llmOnly')
  if (exclude !== null && only !== null) {
    throw new Error(
      `menu.js: "${node.name}" sets both llmExclude and llmOnly, one says it all`
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
 * The markdown forms each menu page is written to, from the optional
 * `llmExclude` / `llmOnly` flags of menu.js, the page-wide counterparts
 * of the <llm-exclude> / <llm-only> tags. A page is in both forms by
 * default. `llmExclude` takes the forms it names away (`true` for
 * both, `"site"` or `"mcp"` for one); `llmOnly` names the forms the
 * page is in, whatever was inherited (`"site"` or `"mcp"` for that one
 * alone, `true` for both: a page back in under an excluded group). A
 * flag on a group covers the pages under it and a deeper flag has the
 * last word; an entry setting both throws.
 * For the slices this decides only whether a page may be in one:
 * targets.js still says which package ships it.
 *
 * @param {Array<object>} menu
 * @returns {Map<string, LlmScope>} Keyed like menuByKey.
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
 * Translate the imported `flatMenu` (keyed by absolute source file paths)
 * into a map keyed by URL slug like `vue-components/knob`, folding in the
 * header-nav pages (always in both markdown forms: the llm flags are
 * menu.js's). Titles start as null and are filled in by
 * loadFrontmatters().
 *
 * @param {string} srcPagesDir Absolute path to docs/src/pages.
 * @returns {Map<string, MenuEntry>}
 */
export function buildMenuMaps(srcPagesDir) {
  const menuByKey = new Map()
  const llmScopes = menuLlmScopes(sidebarMenu)

  for (const id of Object.keys(flatMenu)) {
    // flat-menu registers two candidate file paths per page (flat and
    // folder-based convention). Only the one that exists is real. Keeping
    // phantom candidates would leak keys like `layout` for `layout/layout`.
    if (!existsSync(id)) {
      continue
    }

    const relativePath = relative(srcPagesDir, id).replaceAll('\\', '/')
    const key = sourceToMenuKey(relativePath)
    menuByKey.set(key, {
      title: null,
      desc: null,
      keys: [],
      llm: llmScopes.get(key) ?? { site: true, mcp: true }
    })
  }

  const headerPaths = new Set()
  collectHeaderPaths(primaryToolbarLinks, headerPaths)
  collectHeaderPaths(secondaryToolbarLinks, headerPaths)
  collectHeaderPaths(versionLinks, headerPaths)
  collectHeaderPaths(moreLinks, headerPaths)
  for (const key of headerPaths) {
    if (!menuByKey.has(key)) {
      menuByKey.set(key, {
        title: null,
        desc: null,
        keys: [],
        llm: { site: true, mcp: true }
      })
    }
  }

  return menuByKey
}

/**
 * Build the Set of menu slugs the link-rewrite pass uses to recognize
 * in-tree absolute hrefs.
 *
 * @param {Map<string, { title: string | null }>} menuByKey
 * @returns {Set<string>}
 */
export function buildMenuPaths(menuByKey) {
  return new Set(menuByKey.keys())
}

/**
 * Read each included page's frontmatter once and stamp the title, desc
 * and keys onto the matching `menuByKey` entry. Done up-front so
 * cross-page `related` lookups resolve to real titles.
 *
 * @param {string[]} included Relative source paths the menu accepted.
 * @param {Map<string, MenuEntry>} menuByKey
 * @param {string} srcPagesDir Absolute path to docs/src/pages.
 * @returns {void}
 */
export function loadFrontmatters(included, menuByKey, srcPagesDir) {
  for (const relativePath of included) {
    const key = sourceToMenuKey(relativePath)
    const source = readFileSync(join(srcPagesDir, relativePath), 'utf8')
    const { data } = matter(source)
    const existing = menuByKey.get(key)
    if (existing) {
      existing.title = data.title || existing.title
      existing.desc = data.desc || existing.desc
      existing.keys = parseKeys(data.keys)
    }
  }
}

/**
 * The frontmatter `keys` field: a comma-separated string on the site
 * (`QTabs,QTab,QRouteTab`), tolerated as a list.
 *
 * @param {unknown} keys
 * @returns {string[]}
 */
function parseKeys(keys) {
  const list = Array.isArray(keys) ? keys : String(keys ?? '').split(',')
  return list.map(key => String(key).trim()).filter(key => key !== '')
}

/**
 * Section titles keyed by top-level path segment, in nav order. Derived from
 * the sidebar menu tree plus header links so llms.txt section names and
 * ordering track the real site navigation without a hand-maintained map.
 *
 * @returns {Map<string, string>}
 */
export function buildSectionIndex() {
  const sectionIndex = new Map()
  for (const node of sidebarMenu) {
    if (typeof node.path === 'string' && typeof node.name === 'string') {
      sectionIndex.set(node.path, node.name)
    }
  }
  for (const links of [
    primaryToolbarLinks,
    secondaryToolbarLinks,
    versionLinks,
    moreLinks
  ]) {
    for (const node of links) {
      const isInternal =
        typeof node.path === 'string' &&
        node.path.startsWith('/') &&
        node.external !== true
      if (!isInternal || typeof node.name !== 'string') {
        continue
      }
      const sectionKey = node.path.replace(/^\//, '').split('/')[0]
      if (sectionKey && !sectionIndex.has(sectionKey)) {
        sectionIndex.set(sectionKey, node.name)
      }
    }
  }
  return sectionIndex
}
