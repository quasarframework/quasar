---
title: Types of BEX
desc: How to configure each type of Browser Extensions in Quasar.
---

As already discussed, Quasar can handle the various places where a browser extension can live, namely New Tab, Web Page, Dev Tools Options or Popup. You don't need a separate Quasar App for each of these. You can do some handy work with the router.

## New Tab

This is the default way in which a BEX will run. It is accessed by clicking on the BEX icon in your browser. The Quasar App will run in that new (blank) tab.

## Dev Tools, Options and Popup

These all follow the same pattern, set up a route and configure the `manifest.json` file to look at that route when it's trying to show either one of the types. For instance:

```js
// routes.js:

const routes = [
  { path: '/options', component: () => import('pages/OptionsPage.vue') },
  { path: '/popup', component: () => import('pages/PopupPage.vue') },
  { path: '/devtools', component: () => import('pages/DevToolsPage.vue') }
]
```

You could configure your `manifest.json` file with the following so the options page is loaded from that route:

```json
{
  "name": "My extension",
  ...
  "options_page": "www/index.html#/options", // Options Page
  ...
  "browser_action": {
    "default_popup": "www/index.html#/popup" // Popup Page
  },
  ...
  "devtools_page": "www/index.html#/devtools", // Dev Tools
}
```

## Web Page

This is where the real power comes in. With a little ingenuity we can inject our Quasar application into a web page and and use it as an overlay making it seem like our Quasar App is part of the page experience.

Here's a brief rundown of how you could achieve this:

* `src-bex/js/content-hooks.js`

The idea here is to create an IFrame and add our Quasar app into it, then inject that into the page.

Given our Quasar App might need to take the full height of the window (and thus stop any interaction with the underlying page) we have an event to handle setting the height of the IFrame. By default the IFrame height is just high enough to allow for the Quasar toolbar to show (and in turn allowing interaction with the rest of the page).

We can call this event from our Quasar App any time we know we're opening the drawer and thus changing the height of the IFrame to allow the whole draw to be visible.

```js
const
  iFrame = document.createElement('iframe'),
  defaultFrameHeight = '62px'

/**
 * Set the height of our iFrame housing our BEX
 * @param height
 */
const setIFrameHeight = height => {
  iFrame.height = height
}

/**
 * Reset the iFrame to its default height e.g The height of the top bar.
 */
const resetIFrameHeight = () => {
  setIFrameHeight(defaultFrameHeight)
}

/**
 * Content hooks which listen for messages from the BEX in the iFrame
 * @param bridge
 */
export default function attachContentHooks (bridge) {
  /**
   * When the drawer is toggled set the iFrame height to take the whole page.
   * Reset when the drawer is closed.
   */
  bridge.on('wb.drawer.toggle', event => {
    const payload = event.data
    if (payload.open) {
      setIFrameHeight('100%')
    } else {
      resetIFrameHeight()
    }
    bridge.send(event.eventResponseKey)
  })
}

/**
 * The code below will get everything going. Initialize the iFrame with defaults and add it to the page.
 * @type {string}
 */
iFrame.id = 'bex-app-iframe'
iFrame.width = '100%'
resetIFrameHeight()

// Assign some styling so it looks seamless
Object.assign(iFrame.style, {
  position: 'fixed',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  border: '0',
  zIndex: '9999999', // Make sure it's on top
  overflow: 'visible'
})

;(function () {
  // When the page loads, insert our browser extension app.
  iFrame.src = chrome.runtime.getURL(`www/index.html`)
  document.body.prepend(iFrame)
})()
```

* `src-bex/css/content-css.css`

Add a margin to the top of our document so our Quasar toolbar doesn't overlap the actual page content.

```css
.target-some-header-class {
  margin-top: 62px;
}
```

* `Quasar App`

Then in our Quasar app (/src), we have a function that toggles the drawer and sends an event to the content script telling it to
resize the IFrame thus allowing our whole app to be visible:

```html
<q-drawer :value="drawerIsOpen" @input="drawerToggled">
  Some Content
</q-drawer>
```

```js
methods: {
  drawerToggled () {
    this.$q.bex
      .send('wb.drawer.toggle', {
        open: this.drawerIsOpen // So it knows to make it bigger / smaller
      })
      .then(r => {
        // Only set this once the promise has resolved so we can see the entire slide animation.
        this.drawerIsOpen = !this.drawerIsOpen
      })
  }
}
```

Now you have a Quasar App running in a web page. You can now trigger other events from the Quasar App that the content
script can listen to and interact with the underlying page.
