const
  toString = Object.prototype.toString,
  hasOwn = Object.prototype.hasOwnProperty,
  notPlainObject = new Set(
    [ 'Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp' ]
      .map(name => '[object ' + name + ']')
  )

function isPlainObject (obj) {
  if (obj !== Object(obj) || notPlainObject.has(toString.call(obj)) === true) {
    return false
  }

  if (
    obj.constructor
    && hasOwn.call(obj, 'constructor') === false
    && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf') === false
  ) {
    return false
  }

  let key
  for (key in obj) {} // eslint-disable-line

  return key === void 0 || hasOwn.call(obj, key)
}

export default function extend () {
  let
    options, name, src, copy, copyIsArray, clone,
    target = arguments[ 0 ] || {},
    i = 1,
    deep = false
  const length = arguments.length

  if (typeof target === 'boolean') {
    deep = target
    target = arguments[ 1 ] || {}
    i = 2
  }

  if (Object(target) !== target && typeof target !== 'function') {
    target = {}
  }

  if (length === i) {
    target = this
    i--
  }

  for (; i < length; i++) {
    if ((options = arguments[ i ]) !== null) {
      for (name in options) {
        src = target[ name ]
        copy = options[ name ]

        if (target === copy) {
          continue
        }

        if (
          deep === true
          && copy
          && ((copyIsArray = Array.isArray(copy)) || isPlainObject(copy) === true)
        ) {
          if (copyIsArray === true) {
            clone = Array.isArray(src) === true ? src : []
          }
          else {
            clone = isPlainObject(src) === true ? src : {}
          }

          target[ name ] = extend(deep, clone, copy)
        }
        else if (copy !== void 0) {
          target[ name ] = copy
        }
      }
    }
  }

  return target
}
