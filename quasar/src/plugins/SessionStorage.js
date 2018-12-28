import { isSSR, hasWebStorage } from './Platform.js'
import { getEmptyStorage, getStorage } from '../utils/web-storage.js'

export default {
  install ({ $q }) {
    const storage = isSSR || !hasWebStorage
      ? getEmptyStorage()
      : getStorage('session')

    $q.sessionStorage = storage
    Object.assign(this, storage)
  }
}
