---
title: useWebWorker composable
desc: What is useWebWorker() composable and how you can use it
keys: useWebWorker
badge: v2.34+
examples: useWebWorker
related:
  - /vue-composables/use-web-worker-fn
---

The `useWebWorker()` composable connects a component to a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API): it creates the worker from a script you wrote, exposes the last message received as a reactive value, lets you post messages (with a transfer list) and terminates the worker when the component gets destroyed.

Use it for a long-lived worker with its own protocol (a parser fed with chunks, a search index, a simulation that streams progress). To simply run one function off the main thread and await its result, [useWebWorkerFn](/vue-composables/use-web-worker-fn) is the better fit.

> [!NOTE]
> On the server-side of SSR or SSG modes, no worker gets created: `worker` stays `null`, `postMessage()` does nothing and no message ever arrives.

## Syntax

```js
import { useWebWorker } from 'quasar'

setup () {
  const { workerStatus, data, error, postMessage, terminate } = useWebWorker(
    source,
    {
      // all optional:

      // the native Worker options, used when "source" is a URL:
      type: 'module',            // 'module' (default) or 'classic'
      name: 'primes',            // labels the worker in the devtools
      credentials: 'same-origin', // for a module worker script

      eager: true, // create the worker on mount instead of
                   // at the first postMessage()
      onMessage (data, evt) { // called with each message from the worker
        // ...
      },
      onError (evt) { // called with the "error" / "messageerror" events
        // ...
      }
    }
  )

  // ...
}
```

```ts
function useWebWorker<Data = any>(
  source: string | URL | Worker | ((options?: WorkerOptions) => Worker),
  options?: WorkerOptions & {
    eager?: boolean
    onMessage?: (data: any, evt: MessageEvent) => void
    onError?: (evt: ErrorEvent | MessageEvent) => void
  }
): {
  workerStatus: Ref<'idle' | 'running' | 'terminated'>
  data: ShallowRef<Data | null>
  error: ShallowRef<ErrorEvent | MessageEvent | null>
  postMessage: (message: any, transfer?: Transferable[]) => void
  terminate: () => void
}
```

The `source` can be:

- the URL of the worker script (a String or a `URL` object); the worker gets created with the native `type`, `name` and `credentials` options, and `type` defaults to `'module'` (set it to `'classic'` for a script that relies on `importScripts()`)
- a `Worker` instance you already created
- a function returning a `Worker`; the default export of a Vite `?worker` import is such a function, and so is an arrow function wrapping `new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })`, which keeps the script statically analyzable by the bundler; the function receives the native options as its argument, so a `?worker` constructor picks up the `name` you set

The worker gets created at the first `postMessage()`, so a component that never talks to it never starts a thread. Set `eager: true` for a worker that must be up as soon as the component is mounted, typically one that sends messages on its own (a script that boots a WASM module and reports when ready, a ticker). Either way the worker is `terminate()`d when the component gets destroyed, whatever form the `source` took. `workerStatus` follows this lifecycle: `idle` until the worker exists (on the server and on the client alike, so markup that depends on it hydrates without a mismatch), `running` while it is alive and `terminated` afterwards.

`data` holds the `data` of the last message received from the worker and `error` the last `error` (the worker threw or failed to load) or `messageerror` (a message could not be deserialized) event. The `onMessage` and `onError` hooks get called in the same situations, so you do not need to watch the refs. An error of the worker is still reported to the console as usual; call `evt.preventDefault()` in `onError` if you handled it.

`postMessage(message, transfer)` sends a message to the worker, moving the objects in the optional `transfer` list (an `ArrayBuffer`, a `MessagePort`, an `ImageBitmap`...) instead of copying them. It does nothing once the worker got terminated. `terminate()` kills the worker for good; you will rarely need it, as the composable does it by itself when the component gets destroyed.

## Writing the worker

With Quasar CLI (Vite), the worker script is a file of your own that you point to with `new URL()` so that it gets bundled:

```js
// src/workers/primes.js
onmessage = ({ data }) => {
  const primes = []
  for (let n = 2; primes.length < data.count; n++) {
    if (primes.every(p => n % p !== 0)) primes.push(n)
  }
  postMessage(primes)
}
```

```js
import { useWebWorker } from 'quasar'

setup () {
  const { data, postMessage } = useWebWorker(
    () => new Worker(new URL('../workers/primes.js', import.meta.url), { type: 'module' })
  )

  function compute () {
    postMessage({ count: 1000 })
  }

  // ...
}
```

The `?worker` import form works too:

```js
import PrimesWorker from '../workers/primes.js?worker'

const { data, postMessage } = useWebWorker(PrimesWorker)
```

## Example

The example below builds its worker from an inline script (through a Blob URL) so that everything fits in one file. In your app you would rather keep the worker in its own file, as shown above.

<DocExample title="Basic" file="Basic" />

> [!TIP]
> **Content Security Policy**
>
> A worker script must be allowed by the `worker-src` directive of your CSP (which falls back to `script-src`). Add `blob:` to it when creating workers from Blob URLs, as the example above and [useWebWorkerFn](/vue-composables/use-web-worker-fn) do.
