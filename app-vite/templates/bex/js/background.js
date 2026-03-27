/**
 * Importing the file below initializes the extension background.
 *
 * Warnings:
 * 1. Do not remove the import statement below. It is required for the extension to work.
 *    If you don't need createBridge(), leave it as "import '#q-app/bex/background'".
 * 2. Do not import this file in multiple background scripts. Only once!
 * 3. Import it in your background service worker (if available for your target browser).
 */
import { createBridge } from '#q-app/bex/background'

function openExtension () {
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL('www/index.html')
    },
    (/* newTab */) => {
      // Tab opened.
    }
  )
}

chrome.runtime.onInstalled.addListener(openExtension)
chrome.action.onClicked.addListener(openExtension)

/**
 * Call createBridge() to enable communication with the app & content scripts
 * (and between the app & content scripts), otherwise skip calling
 * createBridge() and use no bridge.
 */
const bridge = createBridge({ debug: false })

bridge.on('log', ({ from, payload }) => {
  console.log(`[BEX] @log from "${ from }"`, payload)
})

bridge.on('getTime', () => {
  return Date.now()
})

bridge.on('storage.get', ({ payload }) => {
  return new Promise(resolve => {
    if (payload === void 0) {
      chrome.storage.local.get(null, items => {
        // Group the values up into an array to take advantage of the bridge's chunk splitting.
        resolve(Object.values(items))
      })
    } else {
      chrome.storage.local.get([payload], items => {
        resolve(items[payload])
      })
    }
  })
})
// Usage:
// bridge.send({
//   event: 'storage.get',
//   to: 'background',
//   payload: key
// }).then(responsePayload => { ... }).catch(err => { ... })

bridge.on('storage.set', async ({ payload }) => {
  await chrome.storage.local.set({ [payload.key]: payload.value })
})
// Usage:
// bridge.send({
//   event: 'storage.set',
//   to: 'background',
//   payload: { key: 'someKey', value: 'someValue' }
// }).then(responsePayload => { ... }).catch(err => { ... })

bridge.on('storage.remove', async ({ payload }) => {
  await chrome.storage.local.remove(payload)
})
// Usage:
// bridge.send({
//   event: 'storage.remove',
//   to: 'background',
//   payload: 'someKey'
// }).then(responsePayload => { ... }).catch(err => { ... })

/*
// More examples:

// Listen to a message from the client
bridge.on('test', message => {
  console.log(message)
  console.log(message.payload)
})

// Send a message and split payload into chunks
// to avoid max size limit of BEX messages.
// Warning! This happens automatically when the payload is an array.
// If you actually want to send an Array, wrap it in an Object.
bridge.send({
  event: 'test',
  to: 'app',
  payload: [ 'chunk1', 'chunk2', 'chunk3', ... ]
}).then(responsePayload => { ... }).catch(err => { ... })

// Send a message and wait for a response
bridge.send({
  event: 'test',
  to: 'app',
  payload: { banner: 'Hello from background!' }
}).then(responsePayload => { ... }).catch(err => { ... })

// Listen to a message from the client and respond synchronously
bridge.on('test', message => {
  console.log(message)
  return { banner: 'Hello from background!' }
})

// Listen to a message from the client and respond asynchronously
bridge.on('test', async message => {
  console.log(message)
  const result = await someAsyncFunction()
  return result
})
bridge.on('test', message => {
  console.log(message)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ banner: 'Hello from background!' })
    }, 1000)
  })
})

// Broadcast a message to app & content scripts
bridge.portList.forEach(portName => {
  bridge.send({ event: 'test', to: portName, payload: 'Hello from background!' })
})

// Find any connected content script and send a message to it
const contentPort = bridge.portList.find(portName => portName.startsWith('content@'))
if (contentPort) {
  bridge.send({ event: 'test', to: contentPort, payload: 'Hello from background!' })
}

// Send a message to a certain content script
bridge
  .send({ event: 'test', to: 'content@my-content-script-2345', payload: 'Hello from background!' })
  .then(responsePayload => { ... })
  .catch(err => { ... })

// Listen for connection events
// (the "@quasar:ports" is an internal event name registered automatically by the bridge)
// --> ({ portList: string[], added?: string } | { portList: string[], removed?: string })
bridge.on('@quasar:ports', ({ portList, added, removed }) => {
  console.log('Ports:', portList)
  if (added) {
    console.log('New connection:', added)
  }
  else if (removed) {
    console.log('Connection removed:', removed)
  }
})

// Send a message to the client based on something happening.
chrome.tabs.onCreated.addListener(tab => {
  bridge.send(...).then(responsePayload => { ... }).catch(err => { ... })
})

// Send a message to the client based on something happening.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    bridge.send(...).then(responsePayload => { ... }).catch(err => { ... })
  }
})

// Dynamically set debug mode
bridge.setDebug(true) // boolean

// Log a message on the console (if debug is enabled)
bridge.log('Hello world!')
bridge.log('Hello', 'world!')
bridge.log('Hello world!', { some: 'data' })
bridge.log('Hello', 'world', '!', { some: 'object' })
// Log a warning on the console (regardless of the debug setting)
bridge.warn('Hello world!')
bridge.warn('Hello', 'world!')
bridge.warn('Hello world!', { some: 'data' })
bridge.warn('Hello', 'world', '!', { some: 'object' })
*/
