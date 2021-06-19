---
title: BEX Communication
desc: How to communicate between different parts of your Browser Extension (BEX) in Quasar.
---
Allowing a Quasar App to communicate with the various parts of the BEX is essential. Quasar closes this gap using a `bridge`.

There are 4 areas in a BEX which will need a communication layer:

1. The Quasar App itself - this is true for all types of BEX i.e Popup, Options Page, Dev Tools or Web Page
2. Background Script
3. Content Script
4. The web page that the BEX is running on

## Communication Rules

There is a fundamental rule to understand with the communication bridge in Quasar.

**Not all BEX types have a content script** - Only BEX which run in the context of a web page will have a content script. This is how browser extensions in general work. This means if you're adding a listener for an event on a content script and trying to trigger it from a Quasar BEX running as Dev Tools, Options Page or Popup - **it won't work**.

If you want to allow your Dev Tools, Popup or Options Page BEX to communicate with a web page, you will need to use the background script as a proxy. You would do this by:

1. Adding a listener on the background script which in turn emits another event.
2. Add a listener to your Quasar App running in the Web Page context which listens for the event the background script is
raising
2. Emitting the event to your background script from your Dev Tools, Popup or Options Page.

Once you get your head around this concept, there are no limits to how the BEX can communicate with each part.

## The Bridge

The bridge is a promise based event system which is shared between all parts of the BEX and as such allows you to listen for events in your Quasar App, emit them from other parts or vice versa. This is what gives Quasar BEX mode it's power.

To access the bridge from within your Quasar App you can use `$q.bex`. In other areas, the bridge is made available via the `bridge` parameter in the respective hook files.

Let's see how it works.

### Trigger an event and wait for the response

```js
bridge.send('some.event', { someKey: 'aValue' }).then(response => {
  console.log('Some response from the other side')
})
```

### Listen for an event and sending a response

```js
bridge.on('some.event', event => {
  console.log('Event Receieved, responding ...')
  bridge.send(event.eventResponseKey)
})
```

### Clean up your listeners

```js
bridge.off('some.event', this.someFunction)
```

Wait, what's `bridge.send(event.eventResponseKey)`?

The Quasar bridge does some work behind the scenes to convert the normal event based communication into promises and as such, in order for the promise to resolve, we need to send a *new* event which is captured and promisified.

:::warning
If you omit `bridge.send(event.eventResponseKey)` the promise on `.send()` will not resolve.
:::

:::tip
The bridge also does some work to split large data which is too big to be transmitted in one go due to the browser extension 60mb data transfer limit. In order for this to happen, the payload must be an array.
:::

