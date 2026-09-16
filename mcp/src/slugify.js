/**
 * Turns a heading into the id it is found by: markup dropped, `&` read as
 * "and", every other run of non-alphanumerics one dash, none at either
 * end. The site renders its heading ids with it, so a quasar.dev fragment
 * names the same section here.
 *
 * MIRRORED in docs/build/utils.js, which cannot be imported from a
 * published package: any change here is made there too, and
 * docs/build/utils.test.js fails while the two differ.
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
