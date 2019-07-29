import attachActivatedBackgroundHooks from '../../activatedBackgroundHooks'
import attachGlobalBackgroundHooks from '../../globalBackgroundHooks'
import Bridge from '../bridge'
let bridge = null

attachGlobalBackgroundHooks(chrome)

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

  attachActivatedBackgroundHooks(chrome, bridge)
})
