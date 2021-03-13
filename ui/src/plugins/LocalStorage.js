import { client } from './Platform.js'
import { getEmptyStorage, getStorage } from '../utils/private/web-storage.js'

export default {
  install ({ $q }) {
    const storage = __QUASAR_SSR_SERVER__ || client.has.webStorage === false
      ? getEmptyStorage()
      : getStorage('local')

    $q.localStorage = storage
    Object.assign(this, storage)
  }
}
