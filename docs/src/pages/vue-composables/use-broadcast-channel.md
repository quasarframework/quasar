---
title: useBroadcastChannel composable
desc: What is useBroadcastChannel() composable and how you can use it
keys: useBroadcastChannel
badge: v2.34+
examples: useBroadcastChannel
related:
  - /vue-composables/use-web-socket
  - /vue-composables/use-event-source
  - /vue-composables/use-web-worker
---

The `useBroadcastChannel()` composable talks to the other tabs, windows, iframes and workers of your app through a [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel): it opens a channel, exposes the last message received as a reactive value, posts your messages to every other context listening on the same channel name, and closes the channel when the component gets destroyed.

Use it to keep the tabs of your app in sync without a server round-trip: log the user out everywhere at once, propagate a theme or language change, tell the other tabs that a record got saved, or let one tab hold a [WebSocket](/vue-composables/use-web-socket) connection and forward what it receives to the others.

> [!NOTE]
> On the server-side of SSR or SSG modes, no channel gets created: `isChannelConnected` stays `false` and no message ever arrives. The channel is connected on the client once the component is mounted, so it is not connected before hydration either.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. There is no mount to wait for there, so the channel is connected right away (unless `lazy` is set) and nothing closes it by itself: call `closeChannel()` when you are done.

## Syntax

```js
import { useBroadcastChannel } from 'quasar'

setup () {
  const {
    isChannelConnected,
    channelData,
    channelError,
    postChannelMessage,
    connectChannel,
    closeChannel
  } = useBroadcastChannel(
    name, // String, or a ref/getter of one
    {
      // all optional:

      lazy: true, // do not connect the channel on mount;
                  // connectChannel() or postChannelMessage() does it

      onConnect () { // called each time the channel gets connected
        // ...
      },
      onMessage (data, evt) { // called with each message received
        // ...
      },
      onError (evt) { // called with the channel's "messageerror" event
        // ...
      },
      onClose (reason) { // called each time the channel gets closed
        // ...
      }
    }
  )

  // ...
}
```

```ts
function useBroadcastChannel<T = any>(
  name: MaybeRefOrGetter<string>,
  options?: {
    lazy?: boolean
    onConnect?: () => void
    onMessage?: (data: T, evt: MessageEvent<T>) => void
    onError?: (evt: MessageEvent) => void
    onClose?: (reason: 'programmatic' | 'unmount' | 'name') => void
  }
): {
  isChannelConnected: Ref<boolean>
  channelData: ShallowRef<T | null>
  channelError: ShallowRef<MessageEvent | null>
  postChannelMessage: (message: T) => void
  connectChannel: () => void
  closeChannel: () => void
}
```

## Lifecycle

The channel is connected when the component is mounted (or right away, when the composable is used outside of a component) and is closed when the component gets destroyed. Set `lazy: true` for a channel that should stay silent until your `connectChannel()` call (or your first `postChannelMessage()`): listening only once the user is logged in, for instance.

Each call of `useBroadcastChannel()` manages one channel with one name; for several channels, call it several times. Every context that connects a channel with the same name, on the same origin, is part of it: there is no handshake to wait for, so `isChannelConnected` flips to `true` as soon as the channel is connected and back to `false` when it is closed.

`closeChannel()` closes the channel, so no message arrives anymore. It is not final: a later `connectChannel()` connects a fresh channel with the current name, and so does `postChannelMessage()`.

When the `name` is a ref or a getter and its value changes while the channel is open, the current channel is closed and a new one is opened with the new name (one channel per user account, per document being edited).

`onConnect()` gets called each time a channel gets connected (on mount, after a `connectChannel()` that follows a close, after a name change) and `onClose(reason)` each time one gets closed, with `reason` set to `'programmatic'` for a `closeChannel()` call, `'unmount'` for the component being destroyed or `'name'` when the channel moves to a new name (in which case `onConnect()` follows right away). Use them to announce the tab to the others, or to tell them it is leaving.

## Messaging

`postChannelMessage(message)` posts the message to every other context listening on the channel. It never comes back to the context that posted it: `channelData` and `onMessage` only ever see what the others posted.

A message can be anything the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) can copy: plain objects and arrays, strings, numbers, `Date`, `Map`, `Set`, `Blob`, `File`, `ArrayBuffer`... Each receiver gets its own copy. Functions, DOM nodes, class instances (only their own properties survive) and Vue reactive proxies are not cloneable, so pass plain data (`toRaw()` a reactive object first) or `postChannelMessage()` throws a `DataCloneError`.

`channelData` holds the last message received and `channelError` the last `messageerror` event (a message the browser could not deserialize on this side, a rare thing with same-origin contexts running the same code). The `onMessage` and `onError` hooks get called in the same situations, so you do not need to watch the refs.

> [!WARNING]
> A `BroadcastChannel` reaches only the contexts of the same origin, in the same browser profile: not another browser, another device or another user. What you post is only as trusted as the other tabs of your own app. It is a bus for notifications and small state, not a transport for large or frequent data (each message gets cloned for every listener); for that, share a worker or keep the data in a store each tab reads on its own.

## Example

Open this page in a second tab or window, then type a message in one of them and post it: it shows up in the other. The composable never receives what it posted itself, so the tab that posts stays silent.

<DocExample title="Between tabs" file="Basic" />
