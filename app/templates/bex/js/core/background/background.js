import attachHooks from '../../backgroundHooks'
import Bridge from '../bridge'
let bridge = null

chrome.runtime.onConnect.addListener(port => {
  let disconnected = false
  port.onDisconnect.addListener(() => {
    disconnected = true
  })

  bridge = new Bridge({
    listen (fn) {
      port.onMessage.addListener(fn)
    },
    send (data) {
      if (!disconnected) {
        port.postMessage(data)
      }
    }
  })

  attachHooks(chrome, bridge)
})
