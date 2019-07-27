// See: https://github.com/vuejs/vue-devtools/blob/dev/shells/chrome/src/background.js
import attachHooks from '../../backgroundHooks'
const connections = {}

chrome.browserAction.onClicked.addListener((tab) => { // eslint-disable-line no-unused-vars
  chrome.tabs.create({
    url: chrome.extension.getURL('www/index.html')
  }, (newTab) => { // eslint-disable-line no-unused-vars
    // Tab opened.
  })
})

function isNumeric (str) {
  return +str + '' === str
}

chrome.runtime.onConnect.addListener(port => {
  let tabId, connectionName

  if (isNumeric(port.name)) { // Initiated from the Quasar App
    tabId = port.name
    connectionName = 'bex'
  } else {
    tabId = port.sender.tab.id
    connectionName = 'backend'
  }

  if (!connections[tabId]) {
    connections[tabId] = {
      bex: null,
      backend: null
    }
  }
  connections[tabId][connectionName] = port

  if (connections[tabId].bex && connections[tabId].backend) {
    linkConnections(tabId, connections[tabId].bex, connections[tabId].backend)
  }

  attachHooks(chrome, {
    send (event, payload) {
      const m = {
        source: 'q-bex-proxy',
        event: event,
        payload
      }
      port.postMessage(m)
    }
  })
})

function linkConnections (tabId, bex, backend) {
  /**
   * Send message from Bex to the Backend
   * @param message
   */
  function bexSendMessage (message) {
    if (message.event === 'log') {
      return console.log('tab ' + tabId, message.payload)
    }

    backend.postMessage(message)
  }

  /**
   * Send message from the Backend to Bex
   * @param message
   */
  function backendSendMessage (message) {
    if (message.event === 'log') {
      return console.log('tab ' + tabId, message.payload)
    }

    bex.postMessage(message)
  }

  function shutdown () {
    bex.onMessage.removeListener(bexSendMessage)
    backend.onMessage.removeListener(backendSendMessage)

    bex.disconnect()
    backend.disconnect()
    connections[tabId] = null
  }

  bex.onMessage.addListener(bexSendMessage)
  bex.onDisconnect.addListener(shutdown)

  backend.onMessage.addListener(backendSendMessage)
  backend.onDisconnect.addListener(shutdown)
}
