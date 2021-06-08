const
  toString = Object.prototype.toString,
  hasOwn = Object.prototype.hasOwnProperty,
  class2type = {}

'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach(name => {
  class2type[ '[object ' + name + ']' ] = name.toLowerCase()
})

function type (obj) {
  return obj === null ? String(obj) : class2type[ toString.call(obj) ] || 'object'
}

function isPlainObject (obj) {
  if (!obj || type(obj) !== 'object') {
    return false
  }

  if (obj.constructor
    && !hasOwn.call(obj, 'constructor')
    && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
    return false
  }

  let key
  for (key in obj) {} // eslint-disable-line

  return key === undefined || hasOwn.call(obj, key)
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

  if (Object(target) !== target && type(target) !== 'function') {
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

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = type(copy) === 'array'))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && type(src) === 'array' ? src : []
          }
          else {
            clone = src && isPlainObject(src) ? src : {}
          }

          target[ name ] = extend(deep, clone, copy)
        }
        else if (copy !== undefined) {
          target[ name ] = copy
        }
      }
    }
  }

  return target
}
