/**
 * `meta.json` sidecar of a bundled docs slice: what the MCP server needs
 * to list and locate pages without reading them, and to state which
 * package version the prose describes.
 */

/**
 * @typedef {object} MetaPage
 * @property {string} route Menu key, e.g. `vue-components/button`; the page file is `<route>.md`.
 * @property {string} title
 * @property {string | null} desc
 */

/**
 * @param {{ packageName: string, version: string, pages: MetaPage[] }} opts
 * @returns {string} Pretty-printed JSON, pages sorted by route.
 */
/**
 * The shape of a slice, as the @quasar/mcp server reads it: the
 * fields of meta.json, the page frontmatter, the section headings and
 * entry lines of the rendered API files. Bumped only when that shape
 * changes in a way the server's current reader would misread, never
 * for additions; the server's major version tracks it, so a project on
 * an older slice runs the matching older server. The same number lives
 * in mcp/src/docs.js (DOCS_FORMAT), and the mcp e2e suite checks the
 * two agree on the slices this repo generates.
 */
export const DOCS_FORMAT = 1

export function buildMeta({ packageName, version, pages }) {
  const sorted = [...pages].sort((a, b) => a.route.localeCompare(b.route))
  return JSON.stringify(
    { format: DOCS_FORMAT, package: packageName, version, pages: sorted },
    null,
    2
  )
}
