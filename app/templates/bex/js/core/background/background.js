/**
 * THIS FILE WILL BE OVERWRITTEN.
 * DO NOT EDIT.
 *
 * You are probably looking into adding hooks in your code. This should be done by means of
 * src-bex/activatedBackgroundHooks (which have access to the browser instance and communication bridge) or
 * src-bex/globalBackgroundHooks (which have access to the browser instance)
 **/

import attachActivatedBackgroundHooks from '../../activatedBackgroundHooks'
import attachGlobalBackgroundHooks from '../../globalBackgroundHooks'
import Bridge from '../bridge'

const connections = {}

attachGlobalBackgroundHooks(chrome)

/**
 * Create a link between App and ContentScript connections
 * The link will be mapped on a messaging level
 * @param port
 */
const addConnection = (port) => {
  const
    tab = port.sender.tab,
    connectionId = tab.id + ':' + tab.windowId

  let currentConnection = connections[connectionId]
  if (!currentConnection) {
    currentConnection = connections[connectionId] = {}
  }

  currentConnection[port.name] = port
}

chrome.runtime.onConnect.addListener(port => {
  let disconnected = false
  port.onDisconnect.addListener(() => {
    disconnected = true
  })

  // Add this port to our pool of connections
  addConnection(port)

  // Create a comms layer between the background script and the App / ContentScript
  const bridge = new Bridge({
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

  // Map a messaging layer between the App and ContentScript
  for (let connectionId of Object.keys(connections)) {
    const connection = connections[connectionId]
    if (connection.app && connection.contentScript) {
      mapConnections(name, connection.app, connection.contentScript)
    }
  }
})

function mapConnections (id, app, contentScript) {
  // Send message from content script to app
  const lOne = (message) => {
    contentScript.postMessage(message)
  }

  // Send message from app to content script
  const lTwo = (message) => {
    app.postMessage(message)
  }

  const shutdown = () => {
    app.onMessage.removeListener(lOne)
    contentScript.onMessage.removeListener(lTwo)

    app.disconnect()
    contentScript.disconnect()
  }

  app.onMessage.addListener(lOne)
  app.onDisconnect.addListener(shutdown)

  contentScript.onMessage.addListener(lTwo)
  contentScript.onDisconnect.addListener(shutdown)
}
