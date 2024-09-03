import { noop } from '../../../utils/event/event.js'
import { isDate, isRegexp } from '../../../utils/is/is.js'

function encode (value) {
  if (isDate(value) === true) {
    return '__q_date|' + value.getTime()
  }
  if (isRegexp(value) === true) {
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

  const type = value.substring(0, 8)
  const source = value.substring(9)

  switch (type) {
    case '__q_date':
      const number = Number(source)
      return new Date(Number.isNaN(number) === true ? source : number)

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
  const getVal = () => null

  return {
    has: () => false, // alias for hasItem; TODO: remove in Qv3
    hasItem: () => false,
    getLength: () => 0,
    getItem: getVal,
    getIndex: getVal,
    getKey: getVal,
    getAll: () => {},
    getAllKeys: () => [],
    set: noop, // alias for setItem; TODO: remove in Qv3
    setItem: noop,
    remove: noop, // alias for removeItem; TODO: remove in Qv3
    removeItem: noop,
    clear: noop,
    isEmpty: () => true
  }
}

export function getStorage (type) {
  const
    webStorage = window[ type + 'Storage' ],
    get = key => {
      const item = webStorage.getItem(key)
      return item
        ? decode(item)
        : null
    }

  const hasItem = key => webStorage.getItem(key) !== null
  const setItem = (key, value) => { webStorage.setItem(key, encode(value)) }
  const removeItem = key => { webStorage.removeItem(key) }

  return {
    has: hasItem, // TODO: remove in Qv3
    hasItem,
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
        result[ key ] = get(key)
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
    set: setItem, // TODO: remove in Qv3
    setItem,
    remove: removeItem, // TODO: remove in Qv3
    removeItem,
    clear: () => { webStorage.clear() },
    isEmpty: () => webStorage.length === 0
  }
}
