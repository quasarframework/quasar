---
title: Background Script
desc: (@quasar/app-vite) How to communicate using your background script with other parts of your Browser Extension (BEX).
---

The background script runs in the context of the BEX itself and can listen to all available browser extension events.

::: warning
In Chrome with [Manifest v3](https://developer.chrome.com/docs/extensions/mv3/intro/) your background script is actually a Service Worker. This does not currently apply to Firefox with Manifest v3 (yet).
:::

## Registering a background script

Your `/src-bex/manifest.json` is the central point that defines your BEX. This is the place where you also define your background script(s):

```json /src-bex/manifest.json
"chrome": {
  "background": {
    "service_worker": "background.js"
  }
},

"firefox": {
  "background": {
    "scripts": [ "background.js" ]
  }
}
```

::: warning For TS devs
Your background and content scripts have the `.ts` extension. Use that extension in the manifest.json file as well! Examples: "background.ts", "my-content-script.ts". While the browser vendors do support only the `.js` extension, Quasar CLI will convert the file extensions automatically.
:::

## Case study

Let's say we want to listen for a new tab being opened in the web browser and then react to it in our Quasar App. First, we'd need to listen for the new tab being opened and emit a new event to tell the Quasar App this has happened:

```js /src-bex/background.js
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

const bridge = createBridge({ debug: false })

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  bridge.send('bex.tab.opened', { url: tab.url })
})
```

Then in our Quasar App, we'd listen for this in one of our component lifecycle hooks, like so:

```js /Quasar App, /src
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

export default {
  setup() {
    const $q = useQuasar()

    // Our function which receives the URL sent by the background script.
    function doOnTabOpened(url) {
      console.log('New Browser Tab Openend: ', url)
    }

    // Add our listener
    $q.bex.on('bex.tab.opened', doOnTabOpened)

    // Don't forget to clean it up
    onBeforeUnmount(() => {
      $q.bex.off('bex.tab.opened', doOnTabOpened)
    })

    return {}
  }
}
```

There are wide variety of events available to the browser extension background script - Google is your friend if you're trying to do something in this area.
