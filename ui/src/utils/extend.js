import { isPlainObject } from './private/is'

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

        if (deep && copy && (isPlainObject(copy) === true || (copyIsArray = Array.isArray(copy) === true))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && Array.isArray(src) === true ? src : []
          }
          else {
            clone = src && isPlainObject(src) === true ? src : {}
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
