import {
  effectScope,
  getCurrentInstance,
  getCurrentScope,
  markRaw,
  onScopeDispose,
  ref,
  watch
} from 'vue'

import { isRuntimeSsrPreHydration } from '../../platform/Platform.js'
import { noop } from '../../../utils/event/event.js'
import { isDate, isRegexp } from '../../../utils/is/is.js'

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

// the traps forward symbols, Vue's own flag probes (__v_isRef, __v_raw,
// markRaw's __v_skip...), toJSON and the Object.prototype names (toString,
// valueOf, constructor...) untouched, so that probing or coercing the view
// never tracks a key; everything else is a storage key
function isStorageKey(key) {
  return (
    typeof key === 'string' &&
    !key.startsWith('__v_') &&
    key !== 'toJSON' &&
    !(key in Object.prototype)
  )
}

// every item reads as missing and every write is dropped
const emptyItems = markRaw(
  new Proxy(
    {},
    {
      get: (target, key) => (isStorageKey(key) ? null : target[key]),
      set: () => true,
      deleteProperty: () => true
    }
  )
)

export function getEmptyStorage() {
  return {
    items: emptyItems,
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
    isEmpty: () => true
  }
}

// an entry remembers the encoded form of what it last got from the
// storage side, so that its watcher can tell a change made through
// the items view (to persist) from one it merely got told about
function assign(entry, value, encoded) {
  entry.synced = encoded
  entry.itemRef.value = value
}

// the effect scope reading the items view right now: a component's
// (setup or render), a store's, a custom effectScope()...; a stopped
// one (an unmounted hook reads with the component's) can own nothing
function getReaderScope() {
  const scope = getCurrentScope() ?? getCurrentInstance()?.scope
  return scope?.active ? scope : void 0
}

export function getStorage(type) {
  const webStorage = window[type + 'Storage'],
    get = key => {
      const item = webStorage.getItem(key)
      return item ? decode(item) : null
    }

  // key -> the entry behind the items view: created on first read,
  // owned by the effect scopes reading it and released with the last of
  // them; a key first read with no scope active is pinned for the rest
  // of the page
  const entries = new Map()

  // a null value means the item is gone
  function syncEntry(key, value, encoded) {
    const entry = entries.get(key)

    if (entry !== void 0) {
      assign(entry, value, encoded ?? encode(value))
    }
  }

  function syncAllEntries() {
    entries.forEach(entry => {
      assign(entry, null, null)
    })
  }

  // the same storage area changed in another document (tab, window or
  // iframe) of this origin; a null key is a clear() there
  function onStorage(evt) {
    if (evt.storageArea !== webStorage) return

    if (evt.key === null) {
      syncAllEntries()
    } else {
      const raw = evt.newValue
      syncEntry(evt.key, raw ? decode(raw) : null)
    }
  }

  const hasItem = key => webStorage.getItem(key) !== null
  const setItem = (key, value) => {
    const encoded = encode(value)
    webStorage.setItem(key, encoded)

    if (entries.has(key)) {
      // a function is stored as its source and a value encode() hands
      // back as is (null, undefined...) as the string the browser makes
      // of it: what reads back is what the entry holds
      if (typeof encoded !== 'string' || typeof value === 'function') {
        syncEntry(key, get(key))
      } else {
        syncEntry(key, value, encoded)
      }
    }
  }
  const removeItem = key => {
    webStorage.removeItem(key)
    syncEntry(key, null, null)
  }

  function seed(entry, key) {
    const raw = webStorage.getItem(key)

    if (raw) {
      const value = decode(raw)
      assign(entry, value, encode(value))
    }
  }

  // a missing item is synced as (null, null) and encode(null) is null,
  // so a missing item never gets written on its own
  function persist(key, entry, value) {
    const encoded = encode(value)

    if (encoded !== entry.synced) {
      webStorage.setItem(key, encoded)
      entry.synced = encoded
    }
  }

  function createEntry(key) {
    const entry = {
      itemRef: ref(null),
      synced: null,
      // its watchers live in a detached scope, so that no reader's
      // scope takes them down with it
      scope: effectScope(true),
      owners: new Set(),
      pinned: false
    }

    if (entries.size === 0) {
      window.addEventListener('storage', onStorage)
    }

    entries.set(key, entry)

    entry.scope.run(() => {
      // the server rendered with nothing in store, so the stored value
      // must not land before the markup is hydrated
      if (isRuntimeSsrPreHydration.value) {
        watch(
          isRuntimeSsrPreHydration,
          () => {
            seed(entry, key)
          },
          { once: true }
        )
      } else {
        seed(entry, key)
      }

      watch(
        entry.itemRef,
        value => {
          persist(key, entry, value)
        },
        { deep: true }
      )
    })

    return entry
  }

  function releaseEntry(key, entry) {
    entry.scope.stop()
    entries.delete(key)

    if (entries.size === 0) {
      window.removeEventListener('storage', onStorage)
    }
  }

  function getEntry(key) {
    const entry = entries.get(key) ?? createEntry(key)

    if (!entry.pinned) {
      const reader = getReaderScope()

      if (reader === void 0) {
        // an event handler or a watcher getter of a component that owns
        // the key reads with no scope active; only a key nobody owns
        // gets pinned by such a read
        if (entry.owners.size === 0) {
          entry.pinned = true
        }
      } else if (!entry.owners.has(reader)) {
        entry.owners.add(reader)
        reader.run(() => {
          onScopeDispose(() => {
            entry.owners.delete(reader)

            if (entry.owners.size === 0 && !entry.pinned) {
              // a nested change made right before is still waiting for
              // the watcher to flush
              persist(key, entry, entry.itemRef.value)
              releaseEntry(key, entry)
            }
          })
        })
      }
    }

    return entry
  }

  // the view is deliberately not enumerable (getAllKeys()/getAll() are)
  // and has no "in" (hasItem() has): both would create an entry, with
  // its decoded copy and watcher, for a key nobody reads
  const items = markRaw(
    new Proxy(
      {},
      {
        get: (target, key) =>
          isStorageKey(key) ? getEntry(key).itemRef.value : target[key],

        set(_, key, value) {
          if (isStorageKey(key)) {
            setItem(key, value)
          }

          return true
        },

        deleteProperty(_, key) {
          if (isStorageKey(key)) {
            removeItem(key)
          }

          return true
        }
      }
    )
  )

  return {
    items,
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
      syncAllEntries()
    },
    isEmpty: () => webStorage.length === 0
  }
}
