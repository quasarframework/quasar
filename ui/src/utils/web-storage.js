import { noop } from '../utils/event.js'

function encode (value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return '__q_date|' + value.toUTCString()
  }
  if (Object.prototype.toString.call(value) === '[object RegExp]') {
    return '__q_expr|' + value.source
  }
  if (typeof value === 'number') {
    return '__q_numb|' + value
  }
  if (typeof value === 'boolean') {
    return '__q_bool|' + (value ? '1' : '0')
  }
  if (typeof value === 'string') {
    return '__q_strn|' + value
  }
  if (typeof value === 'function') {
    return '__q_strn|' + value.toString()
  }
  if (value === Object(value)) {
    return '__q_objt|' + JSON.stringify(value)
  }

  // hmm, we don't know what to do with it,
  // so just return it as is
  return value
}

function decode (value) {
  const length = value.length
  if (length < 9) {
    // then it wasn't encoded by us
    return value
  }

  const type = value.substr(0, 8)
  const source = value.substring(9)

  switch (type) {
    case '__q_date':
      return new Date(source)

    case '__q_expr':
      return new RegExp(source)

    case '__q_numb':
      return Number(source)

    case '__q_bool':
      return Boolean(source === '1')

    case '__q_strn':
      return '' + source

    case '__q_objt':
      return JSON.parse(source)

    default:
      // hmm, we reached here, we don't know the type,
      // then it means it wasn't encoded by us, so just
      // return whatever value it is
      return value
  }
}

export function getEmptyStorage () {
  return {
    has: noop,
    getLength: noop,
    getItem: noop,
    getIndex: noop,
    getAll: noop,
    set: noop,
    remove: noop,
    clear: noop,
    isEmpty: noop
  }
}

export function getStorage (type) {
  const
    webStorage = window[type + 'Storage'],
    get = key => {
      const item = webStorage.getItem(key)
      return item
        ? decode(item)
        : null
    }

  return {
    has: key => webStorage.getItem(key) !== null,
    getLength: () => webStorage.length,
    getItem: get,
    getIndex: index => {
      return index < webStorage.length
        ? get(webStorage.key(index))
        : null
    },
    getKey: index => {
      return index < webStorage.length
        ? webStorage.key(index)
        : null
    },
    getAll: () => {
      let key
      const result = {}, len = webStorage.length

      for (let i = 0; i < len; i++) {
        key = webStorage.key(i)
        result[key] = get(key)
      }

      return result
    },
    getAllKeys: () => {
      const result = [], len = webStorage.length

      for (let i = 0; i < len; i++) {
        result.push(webStorage.key(i))
      }

      return result
    },
    set: (key, value) => { webStorage.setItem(key, encode(value)) },
    remove: key => { webStorage.removeItem(key) },
    clear: () => { webStorage.clear() },
    isEmpty: () => webStorage.length === 0
  }
}
