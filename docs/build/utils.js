// oxlint-disable-next-line no-useless-escape
const specialRE = /[\s·/_\\,:;\.\(\)\[\]]+/g
const andRE = /&/g
const nonWordRE = /[^\w-]+/g
const multipleDashRE = /--+/g

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(specialRE, '-')
    .replace(andRE, '-and-')
    .replace(nonWordRE, '')
    .replace(multipleDashRE, '-')
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
