import { client } from '../platform/Platform.js'
import { getEmptyStorage, getStorage } from './engine/web-storage.js'

const storage = __QUASAR_SSR_SERVER__ || client.has.webStorage === false
  ? getEmptyStorage()
  : getStorage('local')

const Plugin = {
  install ({ $q }) {
    $q.localStorage = storage
  }
}

Object.assign(Plugin, storage)

export default Plugin
