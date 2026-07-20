const toString = Object.prototype.toString,
  hasOwn = Object.prototype.hasOwnProperty,
  notPlainObject = new Set(
    ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp'].map(
      name => '[object ' + name + ']'
    )
  )

function isPlainObject(obj) {
  if (obj !== Object(obj) || notPlainObject.has(toString.call(obj))) {
    return false
  }

  if (
    obj.constructor &&
    !hasOwn.call(obj, 'constructor') &&
    !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
  ) {
    return false
  }

  let key
  for (key in obj) {
    // noop on purpose
  }

  return key === void 0 || hasOwn.call(obj, key)
}

export default function extend(...args) {
  let options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = args[0] || {},
    i = 1,
    deep = false
  const length = args.length

  if (typeof target === 'boolean') {
    deep = target
    target = args[1] || {}
    i = 2
  }

  if (Object(target) !== target && typeof target !== 'function') {
    target = {}
  }

  if (length === i) {
    // oxlint-disable-next-line unicorn/no-this-assignment
    target = this
    i--
  }

  for (; i < length; i++) {
    if ((options = args[i]) !== null) {
      for (name in options) {
        if (name === '__proto__') {
          continue
        }

        src = target[name]
        copy = options[name]

        if (target === copy) {
          continue
        }

        if (
          deep &&
          copy &&
          ((copyIsArray = Array.isArray(copy)) || isPlainObject(copy))
        ) {
          if (copyIsArray) {
            clone = Array.isArray(src) ? src : []
          } else {
            clone = isPlainObject(src) ? src : {}
          }

          target[name] = extend(deep, clone, copy)
        } else if (copy !== void 0) {
          target[name] = copy
        }
      }
    }
  }

  return target
}
