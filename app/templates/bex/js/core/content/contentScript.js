import Bridge from '../bridge'
import attachActivatedContentHooks from '../../activatedContentHooks'

const port = chrome.runtime.connect({
  name: 'bex_content_script'
})

let disconnected = false
port.onDisconnect.addListener(() => {
  disconnected = true
})

let bridge = new Bridge({
  listen (fn) {
    port.onMessage.addListener(fn)
  },
  send (data) {
    if (!disconnected) {
      port.postMessage(data)
    }
  }
})

attachActivatedContentHooks(window, chrome, bridge)
