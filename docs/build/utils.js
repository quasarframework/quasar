// eslint-disable-next-line
const specialRE = /[\s·/_\\,:;\.\(\)\[\]]+/g
const andRE = /&/g
const nonWordRE = /[^\w-]+/g
const multipleDashRE = /--+/g

module.exports.slugify = str => (
  String(str).toLowerCase()
    .replace(specialRE, '-')
    .replace(andRE, '-and-')
    .replace(nonWordRE, '')
    .replace(multipleDashRE, '-')
)

module.exports.capitalize = str => (
  str.charAt(0).toUpperCase() + str.slice(1)
)
