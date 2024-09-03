import { LocalStorage } from 'quasar'
import { ref, watch } from 'vue'

function hasDifferentKeys (a, b) {
  const keys = Object.keys(a)
  const length = keys.length

  if (length !== Object.keys(b).length) {
    return true
  }

  for (let i = length; i-- !== 0;) {
    const key = keys[ i ]
    const valA = a[ key ]
    const valB = b[ key ]

    if (
      /* valA is Object */ Object(valA) === valA && Array.isArray(valA) === false
      && /* valB is Object */ Object(valB) === valB && Array.isArray(valB) === false
      && hasDifferentKeys(valA, valB) === true
    ) {
      return true
    }
  }

  return false
}

export function useLocalStorageConfig (localStorageKey, definition) {
  let config = LocalStorage.getItem(localStorageKey)

  if (config) {
    // if something changed in the definition, reset it to the default definition
    if (hasDifferentKeys(config, definition) === true) {
      config = definition
      LocalStorage.set(localStorageKey, config)
    }
  }
  else {
    config = definition
    LocalStorage.set(localStorageKey, config)
  }

  const store = ref(config)

  watch(store, val => {
    LocalStorage.set(localStorageKey, val)
  }, { deep: true })

  return store
}
