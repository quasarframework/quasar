/**
 * THIS FILE WILL BE OVERWRITTEN.
 * DO NOT EDIT.
 *
 * You are probably looking into adding hooks in your code. This should be done by means of
 * src-bex/activatedBackgroundHooks (which have access to the browser instance and communication bridge) or
 * src-bex/globalBackgroundHooks (which have access to the browser instance)
 **/

/* global chrome */

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

  currentConnection[port.name] = {
    port,
    connected: true
  }

  return currentConnection[port.name]
}

chrome.runtime.onConnect.addListener(port => {
  // Add this port to our pool of connections
  const thisConnection = addConnection(port)
  thisConnection.port.onDisconnect.addListener(() => {
    thisConnection.connected = false
  })

  // Create a comms layer between the background script and the App / ContentScript
  const bridge = new Bridge({
    listen (fn) {
      thisConnection.port.onMessage.addListener(fn)
    },
    send (data) {
      if (thisConnection.connected) {
        thisConnection.port.postMessage(data)
      }
    }
  })

  attachActivatedBackgroundHooks(chrome, bridge)

  // Map a messaging layer between the App and ContentScript
  for (let connectionId of Object.keys(connections)) {
    const connection = connections[connectionId]
    if (connection.app && connection.contentScript) {
      mapConnections(connection.app, connection.contentScript)
    }
  }
})

function mapConnections (app, contentScript) {
  // Send message from content script to app
  app.port.onMessage.addListener((message) => {
    if (contentScript.connected) {
      contentScript.port.postMessage(message)
    }
  })

  // Send message from app to content script
  contentScript.port.onMessage.addListener((message) => {
    if (app.connected) {
      app.port.postMessage(message)
    }
  })
}
