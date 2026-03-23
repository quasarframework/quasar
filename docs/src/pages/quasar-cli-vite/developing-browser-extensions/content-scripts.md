---
title: Content Scripts
desc: (@quasar/app-vite) How to communicate using your content script with your Quasar App and Background Script in Quasar Browser Extension mode.
---

The content script(s) run in the context of the web page. There will be a new content script instance per tab running the extension.

## Communication / Events

You communicate between the BEX parts of your app (background, content scripts & devtools/popup/options page) through our [BEX Bridge](/quasar-cli-vite/developing-browser-extensions/bex-bridge).

## Registering a content script

Your `/src-bex/manifest.json` is the central point that defines your BEX. This is the place where you also define your content script(s):

```json /src-bex/manifest.json
"content_scripts": [
  {
    "matches": [ "<all_urls>" ],
    "css": [ "assets/content.css" ],
    "js": [ "my-content-script.ts" ]
  }
]
```

::: warning For TS devs
Your background and content scripts have the `.ts` extension. Use that extension in the manifest.json file as well! Examples: "background.ts", "my-content-script.ts". While the browser vendors do support only the `.js` extension, Quasar CLI will convert the file extensions automatically.
:::

## Case study

Let's say we want to react to a button being pressed on our Quasar App and highlight some text on the underlying web page, this would be done via the content scripts like so:

```js Quasar App, /src
setup () {
  const $q = useQuasar()

  async function myButtonClickHandler () {
    await $q.bex.send('highlight.content', { selector: '.some-class' })
    $q.notify('Text has been highlighted')
  }

  return { myButtonClickHandler }
}
```

```css /src-bex/assets/content.css
.bex-highlight {
  background-color: red;
}
```

```js /src-bex/my-content-script.js:
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

bridge.on('highlight.content', ({ payload }) => {
  const el = document.querySelector(data.selector)
  if (el !== null) {
    el.classList.add('bex-highlight')
  }
})

bridge
  .connectToBackground()
  .then(() => {
    console.log('Connected to background')
  })
  .catch(err => {
    console.error('Failed to connect to background:', err)
  })
```

Content scripts live in an [isolated world](https://developer.chrome.com/extensions/content_scripts#isolated_world), allowing a content script to makes changes to its JavaScript environment without conflicting with the page or additional content scripts.

Isolated worlds do not allow for content scripts, the extension, and the web page to access any variables or functions created by the others. This also gives content scripts the ability to enable functionality that should not be accessible to the web page.
