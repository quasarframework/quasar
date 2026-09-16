/**
 * Frontmatter keep/strip + related resolution per spec D11.
 *
 * Keeps: title, related.
 * Strips everything else (desc, id, keys, examples, scope, nav, overline,
 * ...).
 *
 * `related` entries may be either strings (paths like `/vue-components/knob`)
 * or objects ({ name|title, path|url }). All entries are normalized to
 * `{ title, path }` where `path` always ends with `.md`.
 */

import { relativeMdPath, sourceToOutputPath } from './routes.js'

/** @type {ReadonlySet<string>} */
// desc stays out: the indexes carry it (llms.txt on the site, meta.json
// in a slice) and the page's opening paragraph says the same. keys are
// meta.json's too. overline is the site's page header, the package is
// known from the slice.
const KEEP_FIELDS = new Set(['title', 'related'])

/**
 * @param {unknown} rawPath
 * @returns {string}
 */
function pathToMenuKey(rawPath) {
  return String(rawPath)
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\.md$/, '')
}

/**
 * @typedef {Object} RelatedEntryOut
 * @property {string | null} title
 * @property {string} path
 * @property {boolean} isKnownPage - the site menu knows the target, even if this pipeline skipped it
 */

/**
 * @param {string | { name?: string, title?: string, path?: string, url?: string } | unknown} entry
 * @param {Map<string, { title?: string }>} menuByPath
 * @param {string} fromOutputPath
 * @returns {RelatedEntryOut | null}
 */
function resolveRelatedEntry(entry, menuByPath, fromOutputPath, run) {
  if (typeof entry === 'string') {
    const key = pathToMenuKey(entry)
    return {
      title: menuByPath.get(key)?.title ?? null,
      path: relatedEntryPath(key, fromOutputPath, run),
      isKnownPage: menuByPath.has(key)
    }
  }
  if (entry && typeof entry === 'object') {
    const entryObject =
      /** @type {{ name?: string, title?: string, path?: string, url?: string }} */ (
        entry
      )
    const rawPath = entryObject.path ?? entryObject.url
    // An entry with a title but no usable target would survive the title
    // filter with a garbage path. Treat it as unresolvable instead.
    if (typeof rawPath !== 'string' || rawPath.trim() === '') {
      return null
    }

    const key = pathToMenuKey(rawPath)
    const title =
      entryObject.name ??
      entryObject.title ??
      menuByPath.get(key)?.title ??
      null
    return {
      title,
      path: relatedEntryPath(key, fromOutputPath, run),
      isKnownPage: menuByPath.has(key)
    }
  }
  return null
}

/**
 * Same rule as link-rewrite.js: the relative `.md` sibling when the
 * run writes the page, the live site otherwise in a package slice.
 *
 * @param {string} key
 * @param {string} fromOutputPath
 * @param {{ pageKeys: Set<string> | null, siteUrl: string | null }} run
 * @returns {string}
 */
function relatedEntryPath(key, fromOutputPath, { pageKeys, siteUrl }) {
  return pageKeys === null || pageKeys.has(key) || siteUrl === null
    ? relativeMdPath(key, fromOutputPath)
    : `${siteUrl}/${key}`
}

/**
 * Strip-and-keep over a raw page frontmatter object, resolving `related`
 * entries against the flat menu.
 *
 * `related` entries that resolve to a `null` title are dropped: they point
 * at a page the AI-docs pipeline didn't generate (orphan or excluded path),
 * so emitting a bare `{ title: null, path: ... }` would leak a broken link
 * with no usable label.
 *
 * @param {Record<string, unknown>} rawFrontmatter Raw frontmatter object (from gray-matter).
 * @param {Map<string, { title?: string }>} menuByPath Flat menu keyed by route path (no leading slash, no trailing slash, no `.md`).
 * @param {string} [sourcePath] Relative source path, for the warnings and the relative links.
 * @param {{ pageKeys?: Set<string> | null, siteUrl?: string | null }} [run] The pages this run writes (null: every menu page), and the site URL when it writes a package slice.
 * @returns {{ frontmatter: Record<string, unknown>, warnings: string[] }} Kept fields with `related` normalized, plus dropped-related warnings.
 */
export function processFrontmatter(
  rawFrontmatter,
  menuByPath,
  sourcePath,
  { pageKeys = null, siteUrl = null } = {}
) {
  const run = { pageKeys, siteUrl }
  const warnings = []
  /** @type {Record<string, unknown>} */
  const output = {}
  for (const fieldName of KEEP_FIELDS) {
    if (rawFrontmatter[fieldName] !== void 0) {
      output[fieldName] = rawFrontmatter[fieldName]
    }
  }
  if (
    rawFrontmatter.related !== void 0 &&
    !Array.isArray(rawFrontmatter.related)
  ) {
    // A YAML slip (bare string instead of a list) would throw on .map and
    // fail the whole page. Warn and drop instead.
    delete output.related
    warnings.push(`related in ${sourcePath} is not a list, dropping it`)
  } else if (rawFrontmatter.related) {
    const fromOutputPath = sourceToOutputPath(sourcePath ?? '')
    const relatedEntries = /** @type {unknown[]} */ (rawFrontmatter.related)
    output.related = relatedEntries
      .map(entry => resolveRelatedEntry(entry, menuByPath, fromOutputPath, run))
      // Entries with no resolvable title get dropped from output. When the
      // target isn't in the site menu at all it's a dead reference that also
      // crashes the live site's SSR render of related links, so warn. Targets
      // the menu knows but this pipeline skipped drop silently.
      .filter((entry, index) => {
        if (entry !== null && entry.title !== null) {
          return true
        }
        if (entry === null || !entry.isKnownPage) {
          warnings.push(
            `Related entry ${JSON.stringify(relatedEntries[index])} in ${sourcePath} points at a page the site menu doesn't know`
          )
        }
        return false
      })
      .map(({ title, path: relatedPath }) => ({ title, path: relatedPath }))
  }
  return { frontmatter: output, warnings }
}
