import attachActivatedBackgroundHooks from '../../activatedBackgroundHooks'
import attachGlobalBackgroundHooks from '../../globalBackgroundHooks'
import Bridge from '../bridge'
let bridge = null

attachGlobalBackgroundHooks(chrome)

const connections = {
  bex_app: null,
  bex_content_script: null
}

chrome.runtime.onConnect.addListener(port => {
  const
    name = port.name

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

  connections[name] = port

  attachActivatedBackgroundHooks(chrome, bridge)

  if (connections.bex_app && connections.bex_content_script) {
    doublePipe(name, connections.bex_app, connections.bex_content_script)
  }
})

function doublePipe (id, bexApp, bexContentScript) {
  // Content script to bex app
  function lOne (message) {
    bexContentScript.postMessage(message)
  }

  // Bex app to content script
  function lTwo (message) {
    bexApp.postMessage(message)
  }

  function shutdown () {
    bexApp.onMessage.removeListener(lOne)
    bexContentScript.onMessage.removeListener(lTwo)

    bexApp.disconnect()
    bexContentScript.disconnect()
    connections[id] = null
  }

  bexApp.onMessage.addListener(lOne)
  bexApp.onDisconnect.addListener(shutdown)

  bexContentScript.onMessage.addListener(lTwo)
  bexContentScript.onDisconnect.addListener(shutdown)
}
