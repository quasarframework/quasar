---
title: BEX Bridge Communication
desc: (@quasar/app-vite) How to communicate between different parts of your Browser Extension (BEX) in Quasar.
---

Allowing a Quasar App to communicate with the various parts of the BEX is essential. Quasar closes this gap using a `bridge`.

There are 3 areas in a BEX which will need a communication layer:

1. The Quasar App itself - this is true for all types of BEX i.e Popup, Options Page, Dev Tools or Web Page
2. Background Script
3. Content Script

## Communication Rules

You can use our BEX bridge to directly communicate between the background script, instances of the content scripts and the popup/devtools/options page.

The use of the BEX bridge is optional for each part of the BEX, however if you want to be able to directly communicate between any bex part, then you need to create it in your background script. Under the hood, the background script acts as the main point of communication. All messages go through the bridge in the background script (and get redirected to the right recipient).

## The Bridge

The bridge is a promise based event system which is shared between all parts of the BEX and as such allows you to listen for events in your Quasar App, emit them from other parts or vice versa. This is what gives Quasar BEX mode it's power.

To access the bridge from within your Quasar App (/src) you can use `$q.bex`. In other areas, the bridge is made available via creating an instance of it.

Let's see how it works.

### The background script

::: warning
You can have multiple background scripts specified in your manifest.json, however, create the BEX bridge ONLY in one of those background scripts. Do not use multiple bridge instances for the background part of your BEX.
:::

```js
/**
 * Importing the file below initializes the extension background.
 *
 * Warnings:
 * 1. Do NOT remove the import statement below. It is required for the extension to work.
 *    If you don't need createBridge(), leave it as "import '#q-app/bex/background'".
 * 2. Do NOT import this file in multiple background scripts. Only in one!
 * 3. Import it in your background service worker (if available for your target browser).
 */
import { createBridge } from '#q-app/bex/background'

/**
 * Call useBridge() to enable communication with the app & content scripts
 * (and between the app & content scripts), otherwise skip calling
 * useBridge() and use no bridge.
 */
const bridge = createBridge({ debug: false })
```

### Content scripts

```js
/**
 * Importing the file below initializes the content script.
 *
 * Warning:
 *   Do not remove the import statement below. It is required for the extension to work.
 *   If you don't need createBridge(), leave it as "import '#q-app/bex/content'".
 */
import { createBridge } from '#q-app/bex/content'

// The use of the bridge is optional.
const bridge = createBridge({ debug: false })
/**
 * bridge.portName is 'content@<path>-<number>'
 *   where <path> is the relative path of this content script
 *   filename (without extension) from /src-bex
 *   (eg. 'my-content-script', 'subdir/my-script')
 *   and <number> is a unique instance number (1-10000).
 */

// Attach initial bridge listeners...

/**
 * Leave this AFTER you attach your initial listeners
 * so that the bridge can properly handle them.
 *
 * You can also disconnect from the background script
 * later on by calling bridge.disconnectFromBackground().
 *
 * To check connection status, access bridge.isConnected
 */
bridge
  .connectToBackground()
  .then(() => {
    console.log('Connected to background')
  })
  .catch(err => {
    console.error('Failed to connect to background:', err)
  })
```

### Popup/devtools/options page

```tabs App (/src/...) vue components
<<| html Composition API + script setup |>>
<template>
  <div />
</template>

<script setup>
import { useQuasar } from 'quasar'
const $q = useQuasar()

// Use $q.bex (the bridge)
// $q.bex.portName is "app"
</script>
<<| html Composition API + script |>>
<template>
  <div />
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()
    // Use $q.bex (the bridge)
    // $q.bex.portName is "app"
  }
}
</script>
<<| html Options API |>>
<template>
  <div />
</template>

<script>
export default {
  // Use this.$q.bex (the bridge)
  // this.$q.bex.portName is "app"
}
</script>
```

Please note that the devtools/popup/options page portName will be `app`.

### Messaging through the bridge

```js
// Listen to a message from the client
bridge.on('test', message => {
  console.log(message)
  console.log(message.payload)
  console.log(message.from)
})

// Send a message and split payload into chunks
// to avoid max size limit of BEX messages.
// Warning! This happens automatically when the payload is an array.
// If you actually want to send an Array, wrap it in an object.
bridge.send({
  event: 'test',
  to: 'app',
  payload: [ 'chunk1', 'chunk2', 'chunk3', ... ]
}).then(responsePayload => { ... }).catch(err => { ... })

// Send a message and wait for a response
bridge.send({
  event: 'test',
  to: 'background',
  payload: { banner: 'Hello from content-script' }
}).then(responsePayload => { ... }).catch(err => { ... })

// Listen to a message from the client and respond synchronously
bridge.on('test', message => {
  console.log(message)
  return { banner: 'Hello from a content-script!' }
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
      resolve({ banner: 'Hello from a content-script!' })
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
  .send({ event: 'test', to: 'content@my-content-script-2345', payload: 'Hello from a content-script!' })
  .then(responsePayload => { ... })
  .catch(err => { ... })

// Listen for connection events
// (the "@quasar:ports" is an internal event name registered automatically by the bridge)
// --> ({ portList: string[], added?: string } | { portList: string[], removed?: string })
bridge.on('@quasar:ports', ({ portList, added, removed }) => {
  console.log('Ports:', portList)
  if (added) {
    console.log('New connection:', added)
  } else if (removed) {
    console.log('Connection removed:', removed)
  }
})

// Current bridge port name (can be 'background', 'app', or 'content@<name>-<xxxxx>')
console.log(bridge.portName)
```

::: warning Warning! Sending large amounts of data
All browser extensions have a hard limit on the amount of data that can be passed as communication messages (example: 50MB). If you exceed that amount on your payload, you can send chunks (**`payload` param should be an Array**).

<br>

```js
bridge.send({
  event: 'some.event',
  to: 'app',
  payload: [chunk1, chunk2, ...chunkN]
})
```

<br>

When calculating the payload size, have in mind that the payload is wrapped in a message built by the Bridge that contains some other properties too. That takes a few bytes as well. So your chunks' size should be with a few bytes below the browser's threshold.
:::

::: warning Warning! Performance on sending an Array
Like we've seen on the warning above, if `payload` is Array then the bridge will send a message for each of the Array's elements.
When you actually want to send an Array (not split the payload into chunks), this will be **VERY** inefficient.

<br>

The solution is to wrap your Array in an Object (so only one message will be sent):

<br>

```js
bridge.send({
  event: 'some.event',
  to: 'background',
  payload: {
    myArray: [
      /*...*/
    ]
  }
})
```

:::

### Bridge debug mode

If you encounter problems with sending messages between the BEX parts, you could enable the debug mode for the bridges that interest you. In doing so, the communication will also be outputted to the browser console:

```js Bridge debug mode
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
```

### Clean up your listeners

Don't forget to remove the listeners that are no longer needed, during the lifetime of your BEX:

```js
bridge.off('some.event', this.someFunction)
```
