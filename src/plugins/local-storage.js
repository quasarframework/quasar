import { onSSR, hasWebStorage } from './platform.js'
import { getEmptyStorage, getStorage } from '../utils/web-storage.js'

export default {
  install ({ $q }) {
    if (onSSR) {
      $q.localStorage = getEmptyStorage()
      return
    }

    if (hasWebStorage()) {
      const storage = getStorage('local')
      $q.localStorage = storage
      Object.assign(this, storage)
    }
  }
}
