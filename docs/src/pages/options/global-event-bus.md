---
title: Global Event Bus
desc: How to use a global event bus in a Quasar app.
---
Sometimes you need an event bus or a publish/subscribe channel. Vue already has an event bus for each component. For convenience, you can use the root Vue component for this through `this.$root` to register and listen for events.

::: danger
Not to be confused with events supported by Quasar Components. Those are Vue events emitted by the respective components and don't interfere with the global event bus.
:::

::: tip
Consider using [Vuex](https://vuex.vuejs.org) instead of an event bus.
:::

## Usage

Please check the Vue [Instance Methods / Events](https://vuejs.org/v2/api/#Instance-Methods-Events) page for the API. Then let's see how, for example, to register an event on the root Vue component of your app:

```js
// callback
function cb (msg) {
  console.log(msg)
}

// listen for an event
this.$root.$on('event_name', cb)

// listen once (only) for an event
this.$root.$once('event_name', cb)

// Make sure you stop listening for an event
// when your respective component gets destroyed
this.$root.$off('event_name', cb)


// Emitting an event:
this.$root.$emit('event_name', 'some message')
```

Example using event to open drawer from another component or page. Not recommended -- a better way would be through [Vuex](https://vuex.vuejs.org), but the example below is for educational purposes only.

```js
// (1) This code is inside layout file that has a drawer
//     if this.leftDrawerOpen is true, drawer is displayed

// (2) Listen for an event in created
created () {
  this.$root.$on('openLeftDrawer', this.openLeftDrawerCallback)
},

beforeDestroy () {
  // Don't forget to turn the listener off before your component is destroyed
  this.$root.$off('openLeftDrawer', this.openLeftDrawerCallback)
}

methods: {
  // (3) Define the callback in methods
  openLeftDrawerCallback () {
    this.leftDrawerOpen = !this.leftDrawerOpen
  }
}

// (4) In another component or page, emit the event!
//     Call the method when clicking button etc.
methods: {
  openLeftDrawer () {
    this.$root.$emit('openLeftDrawer')
  }
}
```

### Usage with QDialog and QMenu

These components use Quasar Portals so that content can be rendered at the end of the `<body>` tag in order to:
1. avoid css pollution
2. avoid z-index issues
3. avoid possible parent CSS overflow
4. work correctly on iOS

If you need to use a bus in these components, you must create your own global bus through a .js file:

```js
import Vue from 'vue'
const bus = new Vue()
export default bus
```

And then import this file wherever you need access to this bus.
