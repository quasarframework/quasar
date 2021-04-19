/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

/**
 * Dedupes array based on criterion returned from iteratee function.
 * Ex: uniqueBy(
 *     [{ id: 1 }, { id: 1 }, { id: 2 }],
 *     val => val.id
 * ) = [{ id: 1 }, { id: 2 }]
 */
module.exports.uniqueBy = function uniqueBy(arr, fn) {
  const seen = new Set()

  return arr.filter(el => {
    const e = fn(el)
    return seen.has(e) === false && seen.add(e)
  })
}

/**
 * Removes the bloat around the filename (webpack loaders etc)
 */
 module.exports.removeFileLoaders = function removeFileLoaders (file) {
  if (!file) { return '' }

  const split = file.split('!')
  const filePath = split[split.length - 1]
  return `in ${filePath}`
}
