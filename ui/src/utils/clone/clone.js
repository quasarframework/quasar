// adapted from https://stackoverflow.com/a/40294058

export default function cloneDeep(data, hash = new WeakMap()) {
  if (Object(data) !== data) return data
  if (hash.has(data)) return hash.get(data)

  const result =
    data instanceof Date
      ? new Date(data)
      : data instanceof RegExp
        ? new RegExp(data.source, data.flags)
        : data instanceof Set
          ? new Set()
          : data instanceof Map
            ? new Map()
            : typeof data.constructor !== 'function'
              ? Object.create(null)
              : data.prototype !== void 0 &&
                  typeof data.prototype.constructor === 'function'
                ? data
                : // oxlint-disable-next-line new-cap
                  new data.constructor()

  if (
    typeof data.constructor === 'function' &&
    typeof data.valueOf === 'function'
  ) {
    const val = data.valueOf()

    if (Object(val) !== val) {
      // oxlint-disable-next-line new-cap
      const localResult = new data.constructor(val)
      hash.set(data, localResult)
      return localResult
    }
  }

  hash.set(data, result)

  if (data instanceof Set) {
    data.forEach(val => {
      result.add(cloneDeep(val, hash))
    })
  } else if (data instanceof Map) {
    data.forEach((val, key) => {
      result.set(key, cloneDeep(val, hash))
    })
  }

  return Object.assign(
    result,
    ...Object.keys(data).map(key => ({ [key]: cloneDeep(data[key], hash) }))
  )
}
