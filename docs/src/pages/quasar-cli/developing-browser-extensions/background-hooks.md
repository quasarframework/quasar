---
title: Background Hooks
desc: How to communicate using your background script with other parts of your Browser Extension (BEX).
---

`src-bex/js/background-hooks.js` is essentially a standard [background script](https://developer.chrome.com/extensions/background_pages) and you are welcome to use it as such. Background scripts can communicate with **all** Web Pages, Dev Tools, Options and Popups running under your BEX.

The added benefit of this file is this function:

```js
export default function attachBackgroundHooks (bridge, activeConnections) {
}
```

This function is called automatically via the Quasar BEX build chain and injects a bridge which is shared between all parts of the BEX meaning you can communicate with any part of your BEX.

The `bridge` param is the bridge to use for communication. The `activeConnections` param provides an array of all the BEX connections registered via the bridge i.e All the Web Page, Options, Popup and Dev Tools BEX's used by the same Quasar App.

For example, let's say we want to listen for a new tab being opened in the web browser and then react to it in our Quasar App. First, we'd need to listen for the new tab being opened and emit a new event to tell the Quasar App this has happened:

```js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  bridge.send('bex.tab.opened', { url: tab.url })
})
```

Then in our Quasar App, we'd listen for this in one of our component lifecycle hooks, like so:

```js
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

export default {
  setup () {
    const $q = useQuasar()

    // Our function which receives the URL sent by the background script.
    function doOnTabOpened (url) {
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

What if you want to modify the underlying web page content in some way? That's where we'd use `content-hooks.js`. Let's look at that in the next section.
