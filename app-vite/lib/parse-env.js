module.exports = function parseEnv (env, rawDefine) {
  const acc = {}

  const flatEnv = flattenObject(env)

  for (const key in flatEnv) {
    acc[ `process.env.${ key }` ] = JSON.stringify(flatEnv[ key ])
  }

  Object.assign(acc, rawDefine)

  return acc
}

/**
 * Flattens the object to a single level.
 * Keys of the result will be the keypaths of the properties of the parameter.
 * It will also preserve the original nested objects with their root keypath.
 *
 * @param {Object} obj
 *
 * @example
 * flattenObject({
 *   foo: 1,
 *   bar: {
 *     baz: 2,
 *     qux: {
 *       quux: {
 *         quuz: 3
 *       }
 *     }
 *   }
 * })
 * // Result:
 * // foo: 1
 * // bar: {baz: 2, qux: {…}, qux.quux: {…}, qux.quux.quuz: 3}
 * // bar.baz: 2
 * // bar.qux: {quux: {…}, quux.quuz: 3}
 * // bar.qux.quux: {quuz: 3}
 * // bar.qux.quux.quuz: 3
 */
const flattenObject = obj => {
  const result = {}

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof obj[ key ] !== 'object') {
      result[ key ] = obj[ key ]
      continue
    }

    const flatObj = flattenObject(obj[ key ])

    // Save the object itself to it's root key
    result[ key ] = flatObj

    // Save the child keys
    for (const flatKey in flatObj) {
      if (!Object.prototype.hasOwnProperty.call(flatObj, flatKey)) continue

      result[ `${ key }.${ flatKey }` ] = flatObj[ flatKey ]
    }
  }

  return result
}
