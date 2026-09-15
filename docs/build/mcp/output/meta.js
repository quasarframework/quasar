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
export function buildMeta({ packageName, version, pages }) {
  const sorted = [...pages].sort((a, b) => a.route.localeCompare(b.route))
  return JSON.stringify(
    { package: packageName, version, pages: sorted },
    null,
    2
  )
}
