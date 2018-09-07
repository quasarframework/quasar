import { onSSR, hasWebStorage } from './platform.js'
import { getEmptyStorage, getStorage } from '../utils/web-storage.js'

export default {
  install ({ $q, queues }) {
    const assignStorage = storage => {
      $q.sessionStorage = storage
      Object.assign(this, storage)
    }

    const clientInit = () => {
      if (hasWebStorage()) {
        assignStorage(getStorage('session'))
      }
    }

    if (onSSR) {
      assignStorage(getEmptyStorage())
      queues.takeover.push(clientInit)
      return
    }

    clientInit()
  }
}
