---
title: Content Scripts
desc: (@quasar/app-vite) How to communicate using your content script with your Quasar App and Background Script in Quasar Browser Extension mode.
---

`src-bex/my-content-script.js` is essentially a standard [content script](https://developer.chrome.com/extensions/content_scripts) and you are welcome to use it as such. Content scripts are able to access the DOM of the underlying webpage and thus you are able to manipulate the content of said page.

::: tip
You can have multiple content scripts with the name of your desire (that includes renaming the default `my-content-script.js`). Each time that you create a new one, please make sure that you reference it in `/src-bex/manifest.json`. Use the `.js` extension even if your filename ends in `.ts`.
:::

The added benefit of this file is this function:

```js
import { bexContent } from 'quasar/wrappers'

export default bexContent((bridge) => {
  //
})
```

This function is called automatically via the Quasar BEX build chain and injects a bridge which is shared between your Quasar App instance and the background script of the BEX.

For example, let's say we want to react to a button being pressed on our Quasar App and highlight some text on the underlying web page, this would be done via the content scripts like so:

```js
// Quasar App, /src

setup () {
  const $q = useQuasar()

  async function myButtonClickHandler () {
    await $q.bex.send('highlight.content', { selector: '.some-class' })
    $q.notify('Text has been highlighted')
  }

  return { myButtonClickHandler }
}
```

```css
/* src-bex/assets/content.css */

.bex-highlight {
    background-color: red;
}
```

```js
// src-bex/my-content-script.js:
import { bexContent } from 'quasar/wrappers'

export default bexContent((bridge) => {
  bridge.on('highlight.content', ({ data, respond }) => {
    const el = document.querySelector(data.selector)
    if (el !== null) {
      el.classList.add('bex-highlight')
    }

    // Let's resolve the `send()` call's promise, this way we can await it on the other side then display a notification.
    respond()
  })
})
```

Content scripts live in an [isolated world](https://developer.chrome.com/extensions/content_scripts#isolated_world), allowing a content script to makes changes to its JavaScript environment without conflicting with the page or additional content scripts.

Isolated worlds do not allow for content scripts, the extension, and the web page to access any variables or functions created by the others. This also gives content scripts the ability to enable functionality that should not be accessible to the web page.

This is where the `dom-script` comes in.
