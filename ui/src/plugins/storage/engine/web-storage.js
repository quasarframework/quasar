import {
  customRef,
  effectScope,
  getCurrentScope,
  onScopeDispose,
  reactive,
  toValue,
  watch
} from 'vue'

import { isRuntimeSsrPreHydration } from '../../platform/Platform.js'
import { noop } from '../../../utils/event/event.js'
import { isDate, isObject, isRegexp } from '../../../utils/is/is.js'

function encode(value) {
  if (isDate(value)) {
    return '__q_date|' + value.getTime()
  }
  if (isRegexp(value)) {
    // a source never starts with a bare slash (it gets escaped), which
    // tells this form from the flag-less one of older versions
    return '__q_expr|/' + value.source + '/' + value.flags
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
      if (source.startsWith('/')) {
        const index = source.lastIndexOf('/')
        return new RegExp(source.slice(1, index), source.slice(index + 1))
      }

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

function noDefault() {
  return null
}

function getStorageRefOptions(options) {
  return {
    // a function, called each time the ref takes the default: an object
    // or Array default is a fresh one every time
    getDefault: options?.default ?? noDefault,
    deep: options?.deep !== false,
    disabled: options?.disabled,
    onError: options?.onError
  }
}

function isDeepValue(value) {
  return isObject(value) || Array.isArray(value)
}

// an in-memory ref that reads as the default: the server has no storage
// and the client must render the same markup until it gets hydrated
function getEmptyStorageRef(key, options) {
  const { getDefault, deep } = getStorageRefOptions(options)
  let value = getDefault()

  const storageRef = customRef((track, trigger) => ({
    get() {
      track()
      return deep && isDeepValue(value) ? reactive(value) : value
    },

    set(newValue) {
      value = newValue === null || newValue === void 0 ? getDefault() : newValue
      trigger()
    }
  }))

  storageRef.stop = noop

  return storageRef
}

export function getEmptyStorage() {
  return {
    has: () => false, // alias for hasItem; TODO: remove in Qv3
    hasItem: () => false,
    getLength: () => 0,
    getItem: () => null,
    getIndex: () => null,
    getKey: () => null,
    getAll: () => ({}),
    getAllKeys: () => [],
    set: noop, // alias for setItem; TODO: remove in Qv3
    setItem: noop,
    remove: noop, // alias for removeItem; TODO: remove in Qv3
    removeItem: noop,
    clear: noop,
    isEmpty: () => true,
    useStorage: getEmptyStorageRef
  }
}

export function getStorage(type) {
  const webStorage = window[type + 'Storage'],
    get = key => {
      const item = webStorage.getItem(key)
      return item === null ? null : decode(item)
    }

  // key -> the receivers of the storage refs attached to that key; each
  // one is told about every change of its item made through this
  // storage object, another ref of the item or another document of
  // the origin
  const attached = new Map()

  // a null value means the item is gone; an error, that the stored
  // value cannot be decoded
  function notify(key, value, encoded, except, error) {
    attached.get(key)?.forEach(receive => {
      if (receive !== except) {
        receive(value, encoded, error)
      }
    })
  }

  function notifyAll() {
    attached.forEach(receivers => {
      receivers.forEach(receive => {
        receive(null, null)
      })
    })
  }

  // the same storage area changed in another document (tab, window or
  // iframe) of this origin; a null key is a clear() there
  function onStorage(evt) {
    if (evt.storageArea !== webStorage) return

    if (evt.key === null) {
      notifyAll()
    } else if (attached.has(evt.key)) {
      const raw = evt.newValue
      let value = null

      try {
        if (raw !== null) {
          value = decode(raw)
        }
      } catch (err) {
        notify(evt.key, null, raw, void 0, err)
        return
      }

      notify(evt.key, value, raw)
    }
  }

  function attach(key, receive) {
    let receivers = attached.get(key)

    if (receivers === void 0) {
      if (attached.size === 0) {
        window.addEventListener('storage', onStorage)
      }

      receivers = new Set()
      attached.set(key, receivers)
    }

    receivers.add(receive)
  }

  function detach(key, receive) {
    const receivers = attached.get(key)

    if (receivers?.delete(receive) && receivers.size === 0) {
      attached.delete(key)

      if (attached.size === 0) {
        window.removeEventListener('storage', onStorage)
      }
    }
  }

  const hasItem = key => webStorage.getItem(key) !== null

  const removeItem = key => {
    webStorage.removeItem(key)
    notify(key, null, null)
  }

  const setItem = (key, value) => {
    if (value === null || value === void 0) {
      removeItem(key)
      return
    }

    webStorage.setItem(key, encode(value))

    // what reads back is what the refs get: a function as its source, a
    // value encode() hands back as is (a BigInt...) as the string the
    // browser makes of it, an object as a copy of the caller's
    if (attached.has(key)) {
      const stored = get(key)
      notify(key, stored, encode(stored))
    }
  }

  function useStorage(key, options) {
    const { getDefault, deep, disabled, onError } =
      getStorageRefOptions(options)

    // the raw value; a plain object or Array is handed out reactive by
    // the getter, so that a nested change gets tracked and persisted
    let value = getDefault(),
      // the encoded form of what the storage side last agreed on, so
      // that a change made through the ref (to persist) can be told
      // from one it merely got told about
      synced = null,
      isAttached = false,
      trigger

    const fail = err => {
      if (onError !== void 0) {
        onError(err)
      } else {
        throw err
      }
    }

    const storageRef = customRef((track, triggerRef) => {
      trigger = triggerRef

      return {
        get() {
          track()
          return deep && isDeepValue(value) ? reactive(value) : value
        },

        set(newValue) {
          assign(
            newValue === null || newValue === void 0 ? getDefault() : newValue
          )
          persist()
        }
      }
    })

    function assign(newValue) {
      value = newValue
      trigger()
    }

    function persist() {
      if (!isAttached) return

      let encoded = value === null ? null : encode(value)
      if (encoded === synced) return

      try {
        if (encoded === null) {
          webStorage.removeItem(key)
        } else {
          webStorage.setItem(key, encoded)

          if (typeof encoded !== 'string' || typeof value === 'function') {
            assign(get(key))
            encoded = encode(value)
          }
        }
      } catch (err) {
        fail(err)
        return
      }

      synced = encoded
      notify(key, value, encoded, receive)
    }

    // the storage side changed the item (setItem(), removeItem(),
    // clear(), another ref of the key or another document); a removed
    // item goes back to the default, which gets persisted again
    function receive(newValue, encoded, error) {
      if (error !== void 0) {
        fail(error)
        return
      }

      if (newValue === null) {
        // another ref of the item, told first, may have stored its
        // default meanwhile: the first one to attach settles it
        const raw = webStorage.getItem(key)

        if (raw !== null) {
          newValue = decode(raw)
          encoded = encode(newValue)
        }
      }

      if (newValue === null) {
        synced = null
        assign(getDefault())
      } else {
        synced = encoded
        assign(newValue)
      }

      persist()
    }

    function seed() {
      try {
        const raw = webStorage.getItem(key)

        if (raw === null) {
          // whatever was agreed on before detaching is gone
          synced = null
        } else {
          const stored = decode(raw)
          synced = encode(stored)
          assign(stored)
        }
      } catch (err) {
        fail(err)
        return
      }

      // a missing item gets the current value (the default, or what
      // the ref was set to meanwhile)
      persist()
    }

    const scope = effectScope(true)

    scope.run(() => {
      // attached: the ref follows the item and persists into it;
      // detached: a plain in-memory ref. The server rendered with nothing
      // in store, so the stored value must not land before the markup is
      // hydrated; a disabled ref stays detached and attaches like a new
      // one once enabled
      watch(
        () => !isRuntimeSsrPreHydration.value && toValue(disabled) !== true,
        on => {
          if (on) {
            isAttached = true
            attach(key, receive)
            seed()
          } else if (isAttached) {
            isAttached = false
            detach(key, receive)
          }
        },
        { immediate: true }
      )

      if (deep) {
        watch(storageRef, persist, { deep: true })
      }
    })

    storageRef.stop = () => {
      scope.stop()

      if (isAttached) {
        isAttached = false
        detach(key, receive)
      }
    }

    // released with the calling scope (a component, a Pinia store, an
    // effectScope()); outside of one, stop() is the caller's job
    if (getCurrentScope() !== void 0) {
      onScopeDispose(storageRef.stop)
    }

    return storageRef
  }

  return {
    has: hasItem, // TODO: remove in Qv3
    hasItem,
    getLength: () => webStorage.length,
    getItem: get,
    getIndex: index =>
      index < webStorage.length ? get(webStorage.key(index)) : null,
    getKey: index => (index < webStorage.length ? webStorage.key(index) : null),
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
    getAllKeys: () => {
      const result = [],
        len = webStorage.length

      for (let i = 0; i < len; i++) {
        result.push(webStorage.key(i))
      }

      return result
    },
    set: setItem, // TODO: remove in Qv3
    setItem,
    remove: removeItem, // TODO: remove in Qv3
    removeItem,
    clear: () => {
      webStorage.clear()
      notifyAll()
    },
    isEmpty: () => webStorage.length === 0,
    useStorage
  }
}
