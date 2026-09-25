---
title: useEventSource composable
desc: What is useEventSource() composable and how you can use it
keys: useEventSource
badge: v2.34+
examples: useEventSource
related:
  - /vue-composables/use-broadcast-channel
  - /vue-composables/use-web-socket
---

The `useEventSource()` composable receives [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) from a component: it opens an [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) stream, exposes the last event received as a reactive value, listens to the named events you ask for, reopens a stream the browser gave up on (with a backoff, and right away when the browser comes back online), and closes the stream when the component gets destroyed.

Server-Sent Events are a one-way channel: the server pushes text events over a plain HTTP response and the browser reconnects by itself when the connection drops. For a two-way connection, see [useWebSocket](/vue-composables/use-web-socket).

> [!NOTE]
> On the server-side of SSR or SSG modes, no stream gets created: `sourceStatus` stays `closed` and no event ever arrives. The stream opens on the client once the component is mounted, so the status is `closed` before hydration too.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. There is no mount to wait for there, so the stream opens right away (unless `lazy` is set) and nothing closes it by itself: call `closeSource()` when you are done. It releases everything the composable holds (the stream, the `online`/`offline` listeners and the watcher on a reactive `url`), and a later `openSource()` sets it all up again.

## Syntax

```js
import { useEventSource } from 'quasar'

setup () {
  const {
    sourceStatus, sourceData, sourceLastEventId, sourceError, openSource, closeSource
  } = useEventSource(
    url, // String, URL, or a ref/getter of one
    {
      // all optional:

      lazy: true, // do not open the stream on mount;
                  // openSource() does it

      withCredentials: true, // send cookies on a cross-origin URL
      events: ['update'],    // named events to listen to, on top of
                             // the unnamed ("message") ones

      autoReconnect: {  // default: true (Infinity retries, 1s doubling up to 30s);
        retries: 5,     // false disables it
        delay: attempt => 500 * (attempt + 1) // ms; a number works too
      },

      onOpen (evt) { // called each time the stream opens
        // ...
      },
      onMessage (data, evt) { // called with each event received
        // evt.type is the event name, evt.lastEventId its id
      },
      onClose (reason) { // called when the stream closes;
        // reason: 'programmatic' | 'unmount' | 'url' | 'remote'
      },
      onError (evt) { // called with the stream's "error" event
        // ...
      },
      onReconnect (attempt, delay) { // called when a reconnect gets scheduled
        // ...
      }
    }
  )

  // ...
}
```

```ts
function useEventSource(
  url: MaybeRefOrGetter<string | URL>,
  options?: {
    lazy?: boolean
    withCredentials?: boolean
    events?: string[]
    autoReconnect?:
      | boolean
      | {
          retries?: number
          delay?: number | ((attempt: number) => number)
        }
    onOpen?: (evt: Event) => void
    onMessage?: (data: string, evt: MessageEvent<string>) => void
    onClose?: (reason: 'programmatic' | 'unmount' | 'url' | 'remote') => void
    onError?: (evt: Event) => void
    onReconnect?: (attempt: number, delay: number) => void
  }
): {
  sourceStatus: Ref<'closed' | 'connecting' | 'open'>
  sourceData: ShallowRef<string | null>
  sourceLastEventId: ShallowRef<string | null>
  sourceError: ShallowRef<Event | null>
  openSource: () => void
  closeSource: () => void
}
```

## Lifecycle

The stream opens when the component is mounted (or right away, when the composable is used outside of a component) and is closed when the component gets destroyed. Set `lazy: true` for a stream that should wait for your `openSource()` call.

Each call of `useEventSource()` manages one stream from one endpoint; for several streams, call it several times.

`closeSource()` closes the stream and stops any reconnecting. It is not final: a later `openSource()` opens a fresh stream.

Once the component got destroyed, the composable is done: `openSource()` does nothing anymore, so a late async callback cannot open a stream that nothing would close.

`sourceStatus` is `connecting` from the moment the stream is requested until it is open, `open` while events flow, and `closed` when it was never opened, when you closed it, or when reconnecting was given up. While the browser retries on its own or while the composable waits to reconnect, the status is `connecting` too.

When the `url` is a ref or a getter and its value changes while the stream is wanted, the current stream is closed and a new one is opened to the new URL (a token in the query string, a different channel).

## Receiving events

`sourceData` holds the `data` of the last event received (always a String: parse it yourself with `JSON.parse()` if your server sends JSON) and `sourceLastEventId` the `id` of the last event that carried one. `sourceError` holds the last `error` event of the stream. The `onMessage`, `onError`, `onOpen` and `onClose` hooks get called in the same situations, so you do not need to watch the refs.

An `EventSource` only delivers the events without an `event:` field (the "message" ones) by default. List the other event names your server sends under `events` to receive them too; `onMessage(data, evt)` gets them all, with `evt.type` telling the name.

`onClose(reason)` is called for every close, with an argument saying who asked for it: `programmatic` for your `closeSource()` call, `unmount` when the component got destroyed, `url` when the stream was moved to a new URL, and `remote` when the browser gave up on the connection. For `remote` the hook runs before any reconnect gets scheduled, so a `closeSource()` call from within it keeps the stream closed.

## Reconnecting

The browser reconnects by itself when a stream's connection drops (respecting the `retry:` field sent by the server) and fires an `error` event before each try; the composable reports it through `sourceError` and `onError` while `sourceStatus` says `connecting`, and nothing else is needed.

The browser gives up, though, when the server answers with a status other than 200, with a content type other than `text/event-stream`, or when the connection is refused outright (a proxy answering 502 while the server restarts). This is where the composable steps in: such a stream is reopened after a delay, 1s then doubling up to 30s, for as long as it takes. Tune it with `autoReconnect: { retries, delay }`, where `delay` is a number of ms or a function of the attempt index (starting at 0), or turn it off with `autoReconnect: false`. A successful connection resets the attempt count. `onReconnect(attempt, delay)` is called each time a reconnect gets scheduled, with the attempt number (starting at 1) and the ms to wait; when the retries run out, `sourceStatus` becomes `closed`.

No attempt is made while the browser reports being offline: the composable waits for the `online` event and reconnects right away when it fires (`onReconnect(1, 0)`), starting a fresh run of attempts, even when the retries had run out. `closeSource()` ends all that: the stream stays closed until you call `openSource()` again.

A stream reopened by the composable (its own auto-reconnect included) is a new `EventSource`, so the browser does not send the `Last-Event-ID` header the way it does on its own retries. If your server can resume from an id, put `sourceLastEventId.value` in the URL yourself before you call `openSource()` after a close; read it there rather than from a `url` getter, since a getter that reads `sourceLastEventId` would move the stream to a new URL on every event that carries an id.

## Example

The example below listens to Wikimedia's public stream of recent edits, which pushes several events a second. The stream waits for your click (`lazy`); open and close it to see the status follow.

<DocExample title="Basic" file="Basic" />

> [!TIP]
> **Content Security Policy**
>
> A stream URL must be allowed by the `connect-src` directive of your CSP.
