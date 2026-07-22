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
import { flatMenu } from '../md/flat-menu.js'
import sidebarMenu from '../../src/assets/menu.js'
import {
  moreLinks,
  primaryToolbarLinks,
  secondaryToolbarLinks,
  versionLinks
} from '../../src/assets/links.header.js'

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
 * Translate the imported `flatMenu` (keyed by absolute source file paths)
 * into a map keyed by URL slug like `vue-components/knob`, folding in the
 * header-nav pages. Titles start as null and are filled in by
 * loadFrontmatters().
 *
 * @param {string} srcPagesDir Absolute path to docs/src/pages.
 * @returns {Map<string, { title: string | null, desc: string | null }>}
 */
export function buildMenuMaps(srcPagesDir) {
  const menuByKey = new Map()

  for (const id of Object.keys(flatMenu)) {
    // flat-menu registers two candidate file paths per page (flat and
    // folder-based convention). Only the one that exists is real. Keeping
    // phantom candidates would leak keys like `layout` for `layout/layout`.
    if (!existsSync(id)) {
      continue
    }

    const relativePath = relative(srcPagesDir, id).replaceAll('\\', '/')
    const key = sourceToMenuKey(relativePath)
    menuByKey.set(key, { title: null, desc: null })
  }

  const headerPaths = new Set()
  collectHeaderPaths(primaryToolbarLinks, headerPaths)
  collectHeaderPaths(secondaryToolbarLinks, headerPaths)
  collectHeaderPaths(versionLinks, headerPaths)
  collectHeaderPaths(moreLinks, headerPaths)
  for (const key of headerPaths) {
    if (!menuByKey.has(key)) {
      menuByKey.set(key, { title: null, desc: null })
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
 * Read each included page's frontmatter once and stamp the title onto the
 * matching `menuByKey` entry. Done up-front so cross-page `related` lookups
 * resolve to real titles.
 *
 * @param {string[]} included Relative source paths the menu accepted.
 * @param {Map<string, { title: string | null }>} menuByKey
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
    }
  }
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
