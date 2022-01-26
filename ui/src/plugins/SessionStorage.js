import { client } from './Platform.js'
import { getEmptyStorage, getStorage } from '../utils/private/web-storage.js'

const storage = __QUASAR_SSR_SERVER__ || client.has.webStorage === false
  ? getEmptyStorage()
  : getStorage('session')

const Plugin = {
  install ({ $q }) {
    $q.sessionStorage = storage
  }
}

Object.assign(Plugin, storage)

export default Plugin
