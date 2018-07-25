import { onSSR, hasWebStorage } from './platform.js'
import { getEmptyStorage, getStorage } from '../utils/web-storage.js'

export default {
  install ({ $q }) {
    if (onSSR) {
      $q.sessionStorage = getEmptyStorage()
      return
    }

    if (hasWebStorage()) {
      const storage = getStorage('session')
      $q.sessionStorage = storage
      Object.assign(this, storage)
    }
  }
}
