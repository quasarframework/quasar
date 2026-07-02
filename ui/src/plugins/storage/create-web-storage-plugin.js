import { client } from '../platform/Platform.js'
import { getEmptyStorage, getStorage } from './engine/web-storage.js'

export default function createWebStoragePlugin(type, injectionName) {
  const storage =
    __QUASAR_SSR_SERVER__ || !client.has.webStorage
      ? getEmptyStorage()
      : getStorage(type)

  return {
    install({ $q }) {
      $q[injectionName] = storage
    },
    ...storage
  }
}
