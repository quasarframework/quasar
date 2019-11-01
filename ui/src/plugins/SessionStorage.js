import { isSSR, client } from './Platform.js'
import { getEmptyStorage, getStorage } from '../utils/web-storage.js'

export default {
  install ({ $q }) {
    const storage = isSSR === true || client.has.webStorage === false
      ? getEmptyStorage()
      : getStorage('session')

    $q.sessionStorage = storage
    Object.assign(this, storage)
  }
}
