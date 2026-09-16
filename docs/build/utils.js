/**
 * Turns a heading into the id it is found by: markup dropped, `&` read as
 * "and", every other run of non-alphanumerics one dash, none at either
 * end. The renderer writes heading ids with it, DocCardTitle and
 * DocInstall derive theirs from it, page-ids.js and the search index
 * mirror them through it.
 *
 * MIRRORED in mcp/src/slugify.js, where the MCP server resolves a section
 * by it and cannot import this file: any change here is made there too,
 * and utils.test.js fails while the two differ.
 *
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  return String(str)
    .replaceAll(/<\/?[^>]+(>|$)/g, '')
    .toLowerCase()
    .replaceAll('&', ' and ')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
}

export function capitalize(str) {
  return str.at(0).toUpperCase() + str.slice(1)
}
