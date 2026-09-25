---
title: useWebWorkerFn composable
desc: What is useWebWorkerFn() composable and how you can use it
keys: useWebWorkerFn
badge: v2.34+
examples: useWebWorkerFn
related:
  - /vue-composables/use-web-worker
---

The `useWebWorkerFn()` composable runs a function of yours in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API), off the main thread, and hands you its result as a Promise. There is no worker file to write: the function itself becomes the worker script. Use it for a CPU-bound computation (sorting or filtering a large data set, parsing a big file, image processing, hashing) that would otherwise freeze the UI.

To drive a long-lived worker script of your own, with its own messages, see [useWebWorker](/vue-composables/use-web-worker).

> [!NOTE]
> On the server-side of SSR or SSG modes, there are no workers: `runWorkerFn()` runs your function inline (in the same process) and resolves with its result, so a value computed during SSR is the same one the client would compute. Scripts listed in `dependencies` are not loaded there.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. Nothing terminates the worker by itself there: call `terminateWorkerFn()` when you are done.

## Syntax

```js
import { useWebWorkerFn } from 'quasar'

setup () {
  const { workerFnStatus, runWorkerFn, terminateWorkerFn } = useWebWorkerFn(
    (a, b) => a + b, // the function to run in the worker
    {
      // all optional:
      timeout: 10000,          // ms before a running call gets rejected
      dependencies: [ /* ... */ ],      // script URLs the function needs
      localDependencies: [ /* ... */ ], // your own functions it calls
      transfer: (a, b) => [ /* ... */ ], // Transferables among the arguments

      onSuccess (result, args) { // called when a call resolves
        // ...
      },
      onError (error, args) { // called when a call rejects with an error
        // ...
      },
      onTimeout (args) { // called when a call hits the timeout
        // ...
      },
      onTerminate (reason) { // called right after the worker got killed
        // ...
      }
    }
  )

  // ...
}
```

```ts
function useWebWorkerFn<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options?: {
    timeout?: number
    dependencies?: (string | URL)[]
    localDependencies?: Function[]
    transfer?: (...args: Parameters<Fn>) => Transferable[]
    onSuccess?: (result: Awaited<ReturnType<Fn>>, args: Parameters<Fn>) => void
    onError?: (error: unknown, args: Parameters<Fn>) => void
    onTimeout?: (args: Parameters<Fn>) => void
    onTerminate?: (
      reason: 'terminate' | 'timeout' | 'error' | 'unmount'
    ) => void
  }
): {
  workerFnStatus: Ref<'idle' | 'running' | 'success' | 'error' | 'timeout'>
  runWorkerFn: (...args: Parameters<Fn>) => Promise<Awaited<ReturnType<Fn>>>
  terminateWorkerFn: () => void
}
```

`runWorkerFn(...args)` calls your function with the arguments in the worker and resolves with what it returned (a returned Promise is awaited). It rejects with the error your function threw (an `Error` arrives as an `Error`, with its message), when the worker script itself fails to load, when the call takes longer than `timeout`, when `terminateWorkerFn()` is called meanwhile and when another call is still running: one call at a time, await it before the next one.

`workerFnStatus` follows the last call: `idle` before the first one (and after a termination), then `running`, `success`, `error` or `timeout`.

The worker gets created at the first call and is kept for the next ones, so repeated calls do not pay the startup cost again. `terminateWorkerFn()` kills it (rejecting a running call); the next call starts a fresh one. The composable terminates the worker by itself when the component gets destroyed.

The hooks report the outcome of each call, with the arguments it was made with, so that one handler can react wherever the call came from: `onSuccess(result, args)` when it resolves, `onError(error, args)` when it rejects with an error (your function threw, the worker script failed to load, an argument could not be cloned) and `onTimeout(args)` when it exceeds `timeout`. `onTerminate(reason)` gets called right after the worker got killed, after the outcome hook of the call it interrupted, with `reason` naming the cause: `'terminate'` for a `terminateWorkerFn()` call, `'timeout'`, `'error'` for a failing script or `'unmount'` for the component being destroyed. A rejection caused by `terminateWorkerFn()` or by a call made while another one runs is not an outcome of your function, so no hook reports it.

## The function is serialized

Your function travels to the worker as source code (through `Function.prototype.toString()`), where it gets evaluated in the worker's own global scope. This has consequences:

- it must be self-contained: no variables from the surrounding scope, no imported modules, no component state, no `$q`. Only its arguments, the `dependencies` and the `localDependencies` listed in the options and what a worker offers by itself (`fetch()`, `self`, `crypto`, `indexedDB`...) are available to it
- its arguments and its return value must be [structured-cloneable](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm): plain data, Arrays, typed arrays, `Map`, `Set`, `Date`, `Blob`, `File`, `ImageData`... but no functions, DOM nodes, class instances (they arrive as plain objects) or Vue reactive proxies (unwrap them with `toRaw()` first)
- a thrown value that cannot be cloned rejects with its String form instead

`localDependencies` inlines your own helper functions (or classes) into the worker script; they must have a name (a `function` declaration or an arrow function assigned to a `const`), and your function calls them by that name. `dependencies` lists scripts to load through `importScripts()` before your function runs; they must be classic scripts (no ES modules), and what they define on the global scope is then available.

```js
import { useWebWorkerFn } from 'quasar'

function distance (a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

setup () {
  const { runWorkerFn } = useWebWorkerFn(
    (points, origin) => points.filter(p => distance(p, origin) < 10),
    { localDependencies: [ distance ] }
  )

  // ...
}
```

## Transferring instead of copying

Arguments get copied to the worker. For a large `ArrayBuffer` (the pixels of an image, a file's content) you can move it instead, which costs nothing regardless of its size: the `transfer` option receives the call's arguments and returns the objects to transfer. Once moved, the object is unusable on the main thread (its `byteLength` becomes 0).

```js
const { runWorkerFn } = useWebWorkerFn(
  (pixels, width, height) => {
    const view = new Uint8ClampedArray(pixels)
    // ...heavy work on view...
    return result
  },
  { transfer: pixels => [pixels] }
)

await runWorkerFn(imageData.data.buffer, imageData.width, imageData.height)
```

The return value always gets copied back.

## Examples

<DocExample title="Basic" file="Basic" />

<DocExample title="Timeout and termination" file="Timeout" />

> [!TIP]
> **Content Security Policy**
>
> The worker script is created from a Blob URL, so the `worker-src` directive of your CSP (which falls back to `script-src`) must allow `blob:`. Without it, `runWorkerFn()` rejects with a SecurityError. This concerns apps that ship a strict CSP, such as Electron apps with a `Content-Security-Policy` meta tag.
