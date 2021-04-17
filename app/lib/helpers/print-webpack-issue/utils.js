
/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

/**
 * Concat and flattens non-null values.
 * Ex: concat(1, undefined, 2, [3, 4]) = [1, 2, 3, 4]
 */
module.exports.concat = function concat () {
  const args = Array.from(arguments).filter(e => e != null)
  const baseArray = Array.isArray(args[0]) ? args[0] : [args[0]]

  return Array.prototype.concat.apply(baseArray, args.slice(1))
}

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
