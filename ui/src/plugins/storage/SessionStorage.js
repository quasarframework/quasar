import { client } from '../platform/Platform.js'
import { getEmptyStorage, getStorage } from './engine/web-storage.js'

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
