import attachHooks from '../../backgroundHooks'
import Bridge from '../init/bridge'
let bridge = null

chrome.browserAction.onClicked.addListener((tab) => { // eslint-disable-line no-unused-vars
  chrome.tabs.create({
    url: chrome.extension.getURL('www/index.html')
  }, (newTab) => { // eslint-disable-line no-unused-vars
    // Tab opened.
  })
})

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
