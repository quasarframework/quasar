---
title: useWebSocket composable
desc: What is useWebSocket() composable and how you can use it
keys: useWebSocket
badge: v2.34+
examples: useWebSocket
related:
  - /vue-composables/use-web-worker
---

The `useWebSocket()` composable keeps a [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) connection alive from a component: it opens the socket, exposes the last message received as a reactive value, queues what you send until the socket is ready, reconnects with a backoff when the connection drops (and right away when the browser comes back online), can send a heartbeat, and closes the socket when the component gets destroyed.

> [!NOTE]
> On the server-side of SSR or SSG modes, no socket gets created: `socketStatus` stays `closed`, `send()` does nothing and no message ever arrives. The socket opens on the client once the component is mounted, so the status is `closed` before hydration too.

## Syntax

```js
import { useWebSocket } from 'quasar'

setup () {
  const { socketStatus, data, error, send, openSocket, closeSocket } = useWebSocket(
    url, // String, URL, or a ref/getter of one;
         // '/live' and 'https://...' forms are mapped to ws(s)
    {
      // all optional:

      protocols: ['chat'],        // the native sub-protocol(s)
      binaryType: 'arraybuffer',  // 'blob' (default) or 'arraybuffer'

      manualOpen: true, // do not open the socket on mount;
                        // openSocket() or the first send() does it

      autoReconnect: {  // default: true (Infinity retries, 1s doubling up to 30s);
        retries: 5,     // false disables it
        delay: attempt => 500 * (attempt + 1) // ms; a number works too
      },

      heartbeat: {         // default: false; true for the defaults below
        message: 'ping',   // what to send
        interval: 30000    // every X ms while the socket is open
      },

      onOpen (evt) { // called each time the socket opens
        // ...
      },
      onMessage (data, evt) { // called with each message received
        // ...
      },
      onClose (evt, reason) { // called when the socket closes;
        // reason: 'programmatic' | 'unmount' | 'url' | 'remote'
      },
      onError (evt) { // called with the socket's "error" event
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
function useWebSocket<Data = any>(
  url: MaybeRefOrGetter<string | URL>,
  options?: {
    protocols?: string | string[]
    binaryType?: 'blob' | 'arraybuffer'
    manualOpen?: boolean
    autoReconnect?:
      | boolean
      | {
          retries?: number
          delay?: number | ((attempt: number) => number)
        }
    heartbeat?:
      | boolean
      | {
          message?: string | ArrayBufferLike | Blob | ArrayBufferView
          interval?: number
        }
    onOpen?: (evt: Event) => void
    onMessage?: (data: any, evt: MessageEvent) => void
    onClose?: (
      evt: CloseEvent,
      reason: 'programmatic' | 'unmount' | 'url' | 'remote'
    ) => void
    onError?: (evt: Event) => void
    onReconnect?: (attempt: number, delay: number) => void
  }
): {
  socketStatus: Ref<'closed' | 'connecting' | 'open'>
  data: ShallowRef<Data | null>
  error: ShallowRef<Event | null>
  send: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => void
  openSocket: () => void
  closeSocket: (code?: number, reason?: string) => void
}
```

## Lifecycle

The socket opens when the component is mounted (or right away, when the composable is used outside of a component) and is closed when the component gets destroyed. Set `manualOpen: true` for a socket that should wait for your `openSocket()` call (or your first `send()`, which opens the socket by itself).

Each call of `useWebSocket()` manages one connection to one endpoint; for several sockets, call it several times.

`closeSocket(code, reason)` closes the connection with the native close code and reason, drops the queued messages and stops any reconnecting. It is not final: a later `openSocket()` or `send()` opens a fresh connection.

`socketStatus` is `connecting` from the moment the socket is requested until it is open, `open` while messages flow, and `closed` when it was never opened, when you closed it, or when reconnecting was given up. While waiting to reconnect the status is `connecting` too, as the composable is still working on it.

When the `url` is a ref or a getter and its value changes while the socket is wanted, the current connection is closed and a new one is opened to the new URL (a token in the query string, a different room).

The `url` does not have to be a `ws://` or `wss://` one: a relative URL (`'/api/live'`) is resolved against the page and an `http://` or `https://` one is mapped to `ws://` or `wss://`. A socket that follows the page's own scheme this way can never be blocked as mixed content on an https page. The newest browsers accept such URLs natively; the composable does it for the older ones Quasar supports too.

## Sending and receiving

`send(message)` sends a String, `Blob`, `ArrayBuffer` or typed array. Messages sent while the socket is not open yet are queued and sent, in order, as soon as it opens; those sent from within `onOpen` go first, so a handshake (authentication, a subscription) reaches the server before the queued ones. Calling `send()` on a closed socket opens it. `closeSocket()` drops whatever is still queued.

`data` holds the `data` of the last message received and `error` the last `error` event of the socket. The `onMessage`, `onError`, `onOpen` and `onClose` hooks get called in the same situations, so you do not need to watch the refs. Messages arrive as they were sent: parse them yourself (`JSON.parse()`) in `onMessage` if your protocol is JSON.

`onClose(evt, reason)` is called for every close, with the native `CloseEvent` (its `code`, `reason` and `wasClean` tell how the connection ended) and a second argument saying who asked for it: `programmatic` for your `closeSocket()` call, `unmount` when the component got destroyed, `url` when the socket was moved to a new URL, and `remote` when the socket closed on its own (the server closed it, or the connection dropped). The hook runs when the close event arrives, so for `unmount` the component is already gone by then.

## Reconnecting

A socket that closes on its own (the server went away, the network dropped) is reopened after a delay: 1s, then doubling up to 30s, for as long as it takes. Tune it with `autoReconnect: { retries, delay }`, where `delay` is a number of ms or a function of the attempt index (starting at 0), or turn it off with `autoReconnect: false`. A successful connection resets the attempt count. `onReconnect(attempt, delay)` is called each time a reconnect gets scheduled, with the attempt number (starting at 1) and the ms to wait, so a "reconnecting..." notice can say how long; when the retries run out, `socketStatus` becomes `closed`.

No attempt is made while the browser reports being offline: the composable waits for the `online` event and reconnects right away when it fires (`onReconnect(1, 0)`), starting a fresh run of attempts, even when the retries had run out. `closeSocket()` ends all that: the socket stays closed until you call `openSocket()` again.

## Heartbeat

Some proxies and load balancers drop a connection that stays silent for a while. `heartbeat: true` sends the String `'ping'` every 30 seconds while the socket is open; set `{ message, interval }` to match what your server expects. The heartbeat stops with the socket and starts over on each (re)connection.

## Example

The example below talks to a public echo server, which greets each new connection then repeats everything it receives. Close the socket, open it again, or turn your network off and on to see the status follow.

<DocExample title="Basic" file="Basic" />

> [!TIP]
> **Content Security Policy**
>
> A socket URL must be allowed by the `connect-src` directive of your CSP.
