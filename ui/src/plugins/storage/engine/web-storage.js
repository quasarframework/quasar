import { noop } from '../../../utils/event/event.js'
import { isDate, isRegexp } from '../../../utils/is/is.js'

function encode(value) {
  if (isDate(value)) {
    return '__q_date|' + value.getTime()
  }
  if (isRegexp(value)) {
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

/**
 * @api plugin
 * @docsUrl https://v2.quasar.dev/quasar-plugins/web-storage
 */
const numberRE = /^-?\d+$/

function decode(value) {
  const length = value.length

  // if it wasn't encoded by us
  if (length < 9) return value

  const type = value.slice(0, 8)
  const source = value.slice(9)

  switch (type) {
    case '__q_date': {
      return new Date(
        numberRE.test(source) ? Number.parseInt(source, 10) : source
      )
    }

    case '__q_expr': {
      return new RegExp(source)
    }

    case '__q_numb': {
      return Number(source)
    }

    case '__q_bool': {
      return Boolean(source === '1')
    }

    case '__q_strn': {
      return String(source)
    }

    case '__q_objt': {
      return JSON.parse(source)
    }

    default: {
      // hmm, we reached here, we don't know the type,
      // then it means it wasn't encoded by us, so just
      // return whatever value it is
      return value
    }
  }
}

export function getEmptyStorage() {
  return {
    /**
     * Determine if item exists
     *
     * @api method has
     * @alias hasItem
     * @param {String} key Entry key
     * @returns {Boolean}
     */
    has: () => false, // alias for hasItem; TODO: remove in Qv3

    /**
     * Determine if item exists
     *
     * @api method hasItem
     * @param {String} key Entry key
     * @returns {Boolean}
     */
    hasItem: () => false,

    /**
     * Get number of entries
     *
     * @api method getLength
     * @returns {Number}
     */
    getLength: () => 0,

    /**
     * Get item value
     *
     * @api method getItem
     * @param {String} key Entry key
     * @returns {Any}
     */
    getItem: () => null,

    /**
     * Get item value by index
     *
     * @api method getIndex
     * @param {Number} index Entry index
     * @returns {Any}
     */
    getIndex: () => null,

    /**
     * Get item key by index
     *
     * @api method getKey
     * @param {Number} index Entry index
     * @returns {String|null}
     */
    getKey: () => null,

    /**
     * Get all items as an Object
     *
     * @api method getAll
     * @returns {Object}
     */
    getAll: () => ({}),

    /**
     * Get all item keys
     *
     * @api method getAllKeys
     * @returns {Array}
     */
    getAllKeys: () => [],

    /**
     * Set item value
     *
     * @api method set
     * @alias setItem
     * @param {String} key Entry key
     * @param {Any} value Entry value
     * @returns {void}
     */
    set: noop, // alias for setItem; TODO: remove in Qv3

    /**
     * Set item value
     *
     * @api method setItem
     * @param {String} key Entry key
     * @param {Any} value Entry value
     * @returns {void}
     */
    setItem: noop,

    /**
     * Remove item
     *
     * @api method remove
     * @alias removeItem
     * @param {String} key Entry key
     * @returns {void}
     */
    remove: noop, // alias for removeItem; TODO: remove in Qv3

    /**
     * Remove item
     *
     * @api method removeItem
     * @param {String} key Entry key
     * @returns {void}
     */
    removeItem: noop,

    /**
     * Remove all items
     *
     * @api method clear
     * @returns {void}
     */
    clear: noop,

    /**
     * Determine if storage has no items
     *
     * @api method isEmpty
     * @returns {Boolean}
     */
    isEmpty: () => true
  }
}

export function getStorage(type) {
  const webStorage = window[type + 'Storage'],
    get = key => {
      const item = webStorage.getItem(key)
      return item ? decode(item) : null
    }

  const hasItem = key => webStorage.getItem(key) !== null
  const setItem = (key, value) => {
    webStorage.setItem(key, encode(value))
  }
  const removeItem = key => {
    webStorage.removeItem(key)
  }

  return {
    /**
     * Determine if item exists
     *
     * @api method has
     * @alias hasItem
     * @param {String} key Entry key
     * @returns {Boolean}
     */
    has: hasItem, // TODO: remove in Qv3

    /**
     * Determine if item exists
     *
     * @api method hasItem
     * @param {String} key Entry key
     * @returns {Boolean}
     */
    hasItem,

    /**
     * Get number of entries
     *
     * @api method getLength
     * @returns {Number}
     */
    getLength: () => webStorage.length,

    /**
     * Get item value
     *
     * @api method getItem
     * @param {String} key Entry key
     * @returns {Any}
     */
    getItem: get,

    /**
     * Get item value by index
     *
     * @api method getIndex
     * @param {Number} index Entry index
     * @returns {Any}
     */
    getIndex: index =>
      index < webStorage.length ? get(webStorage.key(index)) : null,

    /**
     * Get item key by index
     *
     * @api method getKey
     * @param {Number} index Entry index
     * @returns {String|null}
     */
    getKey: index => (index < webStorage.length ? webStorage.key(index) : null),

    /**
     * Get all items as an Object
     *
     * @api method getAll
     * @returns {Object}
     */
    getAll: () => {
      let key
      const result = {},
        len = webStorage.length

      for (let i = 0; i < len; i++) {
        key = webStorage.key(i)
        result[key] = get(key)
      }

      return result
    },

    /**
     * Get all item keys
     *
     * @api method getAllKeys
     * @returns {Array}
     */
    getAllKeys: () => {
      const result = [],
        len = webStorage.length

      for (let i = 0; i < len; i++) {
        result.push(webStorage.key(i))
      }

      return result
    },

    /**
     * Set item value
     *
     * @api method set
     * @alias setItem
     * @param {String} key Entry key
     * @param {Any} value Entry value
     * @returns {void}
     */
    set: setItem, // TODO: remove in Qv3

    /**
     * Set item value
     *
     * @api method setItem
     * @param {String} key Entry key
     * @param {Any} value Entry value
     * @returns {void}
     */
    setItem,

    /**
     * Remove item
     *
     * @api method remove
     * @alias removeItem
     * @param {String} key Entry key
     * @returns {void}
     */
    remove: removeItem, // TODO: remove in Qv3

    /**
     * Remove item
     *
     * @api method removeItem
     * @param {String} key Entry key
     * @returns {void}
     */
    removeItem,

    /**
     * Remove all items
     *
     * @api method clear
     * @returns {void}
     */
    clear: () => {
      webStorage.clear()
    },

    /**
     * Determine if storage has no items
     *
     * @api method isEmpty
     * @returns {Boolean}
     */
    isEmpty: () => webStorage.length === 0
  }
}
