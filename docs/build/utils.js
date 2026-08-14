// oxlint-disable-next-line no-useless-escape
const specialRE = /[\s·/_\\,:;\.\(\)\[\]]+/g
const andRE = /&/g
const nonWordRE = /[^\w-]+/g
const multipleDashRE = /--+/g

const tagRE = /<\/?[^>]+(>|$)/g

/**
 * Turns a title into the anchor id it renders as. Markup the title
 * carries is dropped, and the gap it leaves behind must not survive as a
 * dash, so that a heading like `### Using an Ajax filter <q-badge
 * label="v2.4.5+" />` and the search entry pointing at it derive the very
 * same string.
 */
export function slugify(str) {
  return String(str)
    .replace(tagRE, '')
    .trim()
    .toLowerCase()
    .replace(specialRE, '-')
    .replace(andRE, '-and-')
    .replace(nonWordRE, '')
    .replace(multipleDashRE, '-')
}

export function capitalize(str) {
  return str.at(0).toUpperCase() + str.slice(1)
}
