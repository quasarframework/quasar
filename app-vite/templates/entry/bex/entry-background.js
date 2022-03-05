/* eslint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking into adding hooks in your code. This should be done by means of
 * src-bex/js/background-hooks.js which have access to the browser instance and communication bridge
 * and all the active client connections.
 **/

/* global chrome */

import Bridge from './bridge'
import runDevlandBackgroundScript from '../../src-bex/background'

const connections = {}

/**
 * Create a link between App and ContentScript connections
 * The link will be mapped on a messaging level
 * @param port
 */
const addConnection = (port) => {
  const tab = port.sender.tab

  let connectionId
  // Get the port name, connection ID
  if (port.name.indexOf(':') > -1) {
    const split = port.name.split(':')
    connectionId = split[1]
    port.name = split[0]
  }

  // If we have tab information, use that for the connection ID as FF doesn't support
  // chrome.tabs on the app side (which we would normally use to get the id).
  if (tab !== void 0) {
    connectionId = tab.id
  }

  let currentConnection = connections[connectionId]
  if (!currentConnection) {
    currentConnection = connections[connectionId] = {}
  }

  currentConnection[port.name] = {
    port,
    connected: true,
    listening: false
  }

  return currentConnection[port.name]
}

chrome.runtime.onConnect.addListener(port => {
  // Add this port to our pool of connections
  const thisConnection = addConnection(port)
  thisConnection.port.onDisconnect.addListener(() => {
    thisConnection.connected = false
  })

  /**
   * Create a comms layer between the background script and the App / ContentScript
   * Note: This hooks into all connections as the background script should be able to send
   * messages to all apps / content scripts within its realm (the BEX)
   * @type {Bridge}
   */
  const bridge = new Bridge({
    listen (fn) {
      for (let connectionId in connections) {
        const connection = connections[connectionId]
        if (connection.app && !connection.app.listening) {
          connection.app.listening = true
          connection.app.port.onMessage.addListener(fn)
        }

        if (connection.contentScript && !connection.contentScript.listening) {
          connection.contentScript.port.onMessage.addListener(fn)
          connection.contentScript.listening = true
        }
      }
    },
    send (data) {
      for (let connectionId in connections) {
        const connection = connections[connectionId]
        connection.app && connection.app.connected && connection.app.port.postMessage(data)
        connection.contentScript && connection.contentScript.connected && connection.contentScript.port.postMessage(data)
      }
    }
  })

  runDevlandBackgroundScript(bridge, connections)

  // Map a messaging layer between the App and ContentScript
  for (let connectionId in connections) {
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
