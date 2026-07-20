---
title: BEX with TypeScript
description: (@quasar/app-vite) How to use TypeScript with Quasar BEX
canonical: https://quasar.dev/quasar-cli-vite/developing-browser-extensions/bex-with-typescript
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

When BEX mode is added to a TypeScript project, Quasar scaffolds TypeScript files in `/src-bex`. If the project was converted to TypeScript after BEX mode was added, rename the `.js` files in `/src-bex` to `.ts`, update their manifest entries, and apply the required type annotations.

```js /src-bex/background.ts
/**
 * Importing the file below initializes the extension background.
 *
 * Warnings:
 * 1. Do NOT remove the import statement below. It is required for the extension to work.
 *    If you don't need createBridge(), leave it as "import '#q-app/bex/background'".
 * 2. Do NOT import this file in multiple background scripts. Only in one!
 * 3. Import it in your background service worker (if available for your target browser).
 */
import { createBridge } from '#q-app/bex/background';

function openExtension () {
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL('www/index.html')
    },
    (/* newTab */) => {
      // Tab opened.
    }
  );
}

chrome.runtime.onInstalled.addListener(openExtension);
chrome.action.onClicked.addListener(openExtension);

declare module '@quasar/app-vite' {
  interface BexEventMap {
    log: [{ message: string; data?: any[] }, void];
    getTime: [never, number];

    'storage.get': [string | undefined, any];
    'storage.set': [{ key: string; value: any }, Promise<void>];
    'storage.remove': [string, Promise<void>];
  }
}

/**
 * Call createBridge() to enable communication with the app & content scripts
 * (and between the app & content scripts), otherwise skip calling
 * createBridge() and use no bridge.
 */
const bridge = createBridge({ debug: false });

bridge.on('log', ({ from, payload }) => {
  console.log(`[BEX] @log from "${ from }"`, payload);
});

bridge.on('getTime', () => {
  return Date.now();
});

bridge.on('storage.get', ({ payload: key }) => {
  const { promise, resolve } = Promise.withResolvers();
  if (key === void 0) {
    chrome.storage.local.get(null, items => {
      // Group the values up into an array to take advantage of the bridge's chunk splitting.
      resolve(Object.values(items));
    });
  } else {
    chrome.storage.local.get([key], items => {
      resolve(items[key]);
    });
  }

  return promise;
});
// Usage:
// bridge.send({
//   event: 'storage.get',
//   to: 'background',
//   payload: 'key' // or omit `payload` to get data for all keys
// }).then((result) => { ... }).catch((error) => { ... });

bridge.on('storage.set', async ({ payload: { key, value } }) => {
  await chrome.storage.local.set({ [key]: value });
});
// Usage:
// bridge.send({
//   event: 'storage.set',
//   to: 'background',
//   payload: { key: 'someKey', value: 'someValue' }
// }).then(() => { ... }).catch((error) => { ... });

bridge.on('storage.remove', async ({ payload: key }) => {
  await chrome.storage.local.remove(key);
});
// Usage:
// bridge.send({
//   event: 'storage.remove',
//   to: 'background',
//   payload: 'someKey'
// }).then(() => { ... }).catch((error) => { ... });

/*
// More examples:

// Listen to a message from the client
bridge.on('test', message => {
  console.log(message);
  console.log(message.payload);
});

// Send a message and split payload into chunks
// to avoid max size limit of BEX messages.
// Warning! This happens automatically when the payload is an array.
// If you actually want to send an Array, wrap it in an Object.
bridge.send({
  event: 'test',
  to: 'app',
  payload: [ 'chunk1', 'chunk2', 'chunk3', ... ]
}).then(responsePayload => { ... }).catch(err => { ... });

// Send a message and wait for a response
bridge.send({
  event: 'test',
  to: 'app',
  payload: { banner: 'Hello from background!' }
}).then(responsePayload => { ... }).catch(err => { ... });

// Listen to a message from the client and respond synchronously
bridge.on('test', message => {
  console.log(message);
  return { banner: 'Hello from background!' };
});

// Listen to a message from the client and respond asynchronously
bridge.on('test', async message => {
  console.log(message);
  const result = await someAsyncFunction();
  return result;
});
bridge.on('test', message => {
  console.log(message)
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(() => {
    resolve({ banner: 'Hello from a content-script!' });
  }, 1000);
  return promise;
});

// Broadcast a message to app & content scripts
bridge.portList.forEach(portName => {
  bridge.send({ event: 'test', to: portName, payload: 'Hello from background!' });
});

// Find any connected content script and send a message to it
const contentPort = bridge.portList.find(portName => portName.startsWith('content@'));
if (contentPort) {
  bridge.send({ event: 'test', to: contentPort, payload: 'Hello from background!' });
}

// Send a message to a certain content script
bridge
  .send({ event: 'test', to: 'content@my-content-script-2345', payload: 'Hello from background!' })
  .then(responsePayload => { ... })
  .catch(err => { ... });

// Listen for connection events
// (the "@quasar:ports" is an internal event name registered automatically by the bridge)
// --> ({ portList: string[], added?: string } | { portList: string[], removed?: string })
bridge.on('@quasar:ports', ({ portList, added, removed }) => {
  console.log('Ports:', portList)
  if (added) {
    console.log('New connection:', added);
  } else if (removed) {
    console.log('Connection removed:', removed);
  }
});

// Send a message to the client based on something happening.
chrome.tabs.onCreated.addListener(tab => {
  bridge.send(...).then(responsePayload => { ... }).catch(err => { ... });
});

// Send a message to the client based on something happening.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    bridge.send(...).then(responsePayload => { ... }).catch(err => { ... });
  }
});

// Dynamically set debug mode
bridge.setDebug(true); // boolean

// Log a message on the console (if debug is enabled)
bridge.log('Hello world!');
bridge.log('Hello', 'world!');
bridge.log('Hello world!', { some: 'data' });
bridge.log('Hello', 'world', '!', { some: 'object' });
// Log a warning on the console (regardless of the debug setting)
bridge.warn('Hello world!');
bridge.warn('Hello', 'world!');
bridge.warn('Hello world!', { some: 'data' });
bridge.warn('Hello', 'world', '!', { some: 'object' });
*/
```

```js /src-bex/my-content-script.ts
/**
 * Importing the file below initializes the content script.
 *
 * Warning:
 *   Do not remove the import statement below. It is required for the extension to work.
 *   If you don't need createBridge(), leave it as "import '#q-app/bex/content'".
 */
import { createBridge } from '#q-app/bex/content';

// The use of the bridge is optional.
const bridge = createBridge({ debug: false });
/**
 * bridge.portName is 'content@<path>-<number>'
 *   where <path> is the relative path of this content script
 *   filename (without extension) from /src-bex
 *   (eg. 'my-content-script', 'subdir/my-script')
 *   and <number> is a unique instance number (1-10000).
 */

declare module '@quasar/app-vite' {
  interface BexEventMap {
    'some.event': [{ someProp: string }, void];
  }
}

// Hook into the bridge to listen for events sent from the other BEX parts.
bridge.on('some.event', ({ payload }) => {
  if (payload.someProp) {
    // Access a DOM element from here.
    // Document in this instance is the underlying website the contentScript runs on
    const el = document.getElementById('some-id');
    if (el) {
      el.innerText = 'Quasar Rocks!';
    };
  };
});

/**
 * Leave this AFTER you attach your initial listeners
 * so that the bridge can properly handle them.
 *
 * You can also disconnect from the background script
 * later on by calling bridge.disconnectFromBackground().
 *
 * To check connection status, access bridge.isConnected
 */
bridge.connectToBackground()
  .then(() => {
    console.log('Connected to background');
  })
  .catch(err => {
    console.error('Failed to connect to background:', err);
  });

/*
// More examples:

// Listen to a message from the client
bridge.on('test', message => {
  console.log(message);
  console.log(message.payload);
});

// Send a message and split payload into chunks
// to avoid max size limit of BEX messages.
// Warning! This happens automatically when the payload is an array.
// If you actually want to send an Array, wrap it in an object.
bridge.send({
  event: 'test',
  to: 'app',
  payload: [ 'chunk1', 'chunk2', 'chunk3', ... ]
}).then(responsePayload => { ... }).catch(err => { ... });

// Send a message and wait for a response
bridge.send({
  event: 'test',
  to: 'background',
  payload: { banner: 'Hello from content-script' }
}).then(responsePayload => { ... }).catch(err => { ... });

// Listen to a message from the client and respond synchronously
bridge.on('test', message => {
  console.log(message);
  return { banner: 'Hello from a content-script!' };
});

// Listen to a message from the client and respond asynchronously
bridge.on('test', async message => {
  console.log(message);
  const result = await someAsyncFunction();
  return result;
});
bridge.on('test', message => {
  console.log(message);
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(() => {
    resolve({ banner: 'Hello from a content-script!' });
  }, 1000);
  return promise;
});

// Broadcast a message to background, app & the other content scripts
bridge.portList.forEach(portName => {
  bridge.send({ event: 'test', to: portName, payload: 'Hello from content-script!' });
});

// Find any connected content script and send a message to it
const contentPort = bridge.portList.find(portName => portName.startsWith('content@'));
if (contentPort) {
  bridge.send({ event: 'test', to: contentPort, payload: 'Hello from a content-script!' });
}

// Send a message to a certain content script
bridge
  .send({ event: 'test', to: 'content@my-content-script-2345', payload: 'Hello from a content-script!' })
  .then(responsePayload => { ... })
  .catch(err => { ... });

// Listen for connection events
// (the "@quasar:ports" is an internal event name registered automatically by the bridge)
// --> ({ portList: string[], added?: string } | { portList: string[], removed?: string })
bridge.on('@quasar:ports', ({ portList, added, removed }) => {
  console.log('Ports:', portList);
  if (added) {
    console.log('New connection:', added);
  } else if (removed) {
    console.log('Connection removed:', removed);
  }
});

// Current bridge port name (can be 'content@<name>-<xxxxx>')
console.log(bridge.portName);

// Dynamically set debug mode
bridge.setDebug(true); // boolean

// Log a message on the console (if debug is enabled)
bridge.log('Hello world!');
bridge.log('Hello', 'world!');
bridge.log('Hello world!', { some: 'data' });
bridge.log('Hello', 'world', '!', { some: 'object' });
// Log a warning on the console (regardless of the debug setting)
bridge.warn('Hello world!');
bridge.warn('Hello', 'world!');
bridge.warn('Hello world!', { some: 'data' });
bridge.warn('Hello', 'world', '!', { some: 'object' });
*/
```
