import { getCurrentInstance, onBeforeUnmount, ref } from 'vue'

import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const {
 *      runWorkerFn, workerFnStatus, terminateWorkerFn
 *    } = useWebWorkerFn(fn, options)
 *
 * fn      - the function to run in a Web Worker; it is serialized with
 *           toString(), so it must be self-contained: no closure variables,
 *           no imports, no component state (its arguments and its return
 *           value travel through structured cloning)
 * options - plain object (all optional):
 *    timeout           - ms after which a running call gets rejected and
 *                        the worker killed
 *    dependencies      - script URLs loaded in the worker (importScripts)
 *    localDependencies - named functions (or classes) inlined into the
 *                        worker script, callable from fn by their name
 *    transfer(...args) - returns the Transferable objects among the call's
 *                        arguments (moved instead of cloned)
 *
 * runWorkerFn(...args) - Promise of fn's result; rejects with the error fn
 *                        threw, on timeout, on termination and while
 *                        another call is running
 * workerFnStatus       - Ref<'idle' | 'running' | 'success' | 'error'
 *                        | 'timeout'>
 * terminateWorkerFn()  - kills the worker (a later call starts a new one);
 *                        also happens on unmount
 */

const statusIdle = 'idle',
  statusRunning = 'running',
  statusSuccess = 'success',
  statusError = 'error',
  statusTimeout = 'timeout'

function getWorkerScript(fn, dependencies, localDependencies) {
  const imports =
    dependencies.length !== 0
      ? `importScripts(${dependencies.map(url => JSON.stringify(String(url))).join(',')});\n`
      : ''

  const locals = localDependencies
    .map(dep => {
      if (typeof dep !== 'function' || dep.name === '') {
        throw new Error(
          'useWebWorkerFn: localDependencies must be named functions'
        )
      }

      return `const ${dep.name} = ${dep.toString()};\n`
    })
    .join('')

  // a result (or a thrown value) that cannot be cloned would make
  // postMessage throw in the worker and leave the call hanging, so the
  // reply falls back to its string form
  return (
    imports +
    locals +
    `const __qFn = ${fn.toString()};
function __qReply (msg) {
  try { postMessage(msg) }
  catch (err) { postMessage({ ok: false, error: String(err) }) }
}
onmessage = evt => {
  Promise.resolve()
    .then(() => __qFn(...evt.data))
    .then(
      result => { __qReply({ ok: true, result }) },
      error => { __qReply({ ok: false, error }) }
    )
}`
  )
}

export default function useWebWorkerFn(fn, options) {
  const workerFnStatus = ref(statusIdle)

  if (__QUASAR_SSR_SERVER__) {
    return {
      workerFnStatus,
      // no worker on the server: the function runs inline
      runWorkerFn: async (...args) => await fn(...args),
      terminateWorkerFn: noop
    }
  }

  const {
    timeout,
    dependencies = [],
    localDependencies = [],
    transfer
  } = options ?? {}

  let worker = null,
    blobUrl = null,
    timer = null,
    // { resolve, reject } of the call in progress
    pending = null

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function settle(status, method, value) {
    clearTimer()
    workerFnStatus.value = status

    if (pending !== null) {
      const call = pending
      pending = null
      call[method](value)
    }
  }

  function destroyWorker() {
    if (worker === null) return

    worker.removeEventListener('message', onMessage)
    worker.removeEventListener('error', onError)
    worker.terminate()
    worker = null
  }

  function onMessage({ data }) {
    if (data.ok === true) {
      settle(statusSuccess, 'resolve', data.result)
    } else {
      settle(statusError, 'reject', data.error)
    }
  }

  // fn's own errors travel as messages; an 'error' event means the
  // worker script itself failed (a syntax error, a dependency that
  // cannot load), so the worker is useless
  function onError(evt) {
    // reported through the rejection, not as an uncaught error
    evt.preventDefault()
    destroyWorker()
    settle(statusError, 'reject', evt.error ?? new Error(evt.message))
  }

  function createWorker() {
    if (blobUrl === null) {
      blobUrl = URL.createObjectURL(
        new Blob([getWorkerScript(fn, dependencies, localDependencies)], {
          type: 'text/javascript'
        })
      )
    }

    const instance = new Worker(blobUrl)

    instance.addEventListener('message', onMessage)
    instance.addEventListener('error', onError)

    return instance
  }

  function runWorkerFn(...args) {
    if (pending !== null) {
      return Promise.reject(
        new Error('useWebWorkerFn: a call is already running')
      )
    }

    return new Promise((resolve, reject) => {
      if (worker === null) {
        try {
          worker = createWorker()
        } catch (err) {
          workerFnStatus.value = statusError
          reject(err)
          return
        }
      }

      pending = { resolve, reject }
      workerFnStatus.value = statusRunning

      if (timeout > 0) {
        timer = setTimeout(() => {
          timer = null
          destroyWorker()
          settle(
            statusTimeout,
            'reject',
            new Error(`useWebWorkerFn: timed out after ${timeout}ms`)
          )
        }, timeout)
      }

      try {
        worker.postMessage(args, transfer?.(...args))
      } catch (err) {
        // an argument that cannot be cloned
        settle(statusError, 'reject', err)
      }
    })
  }

  function terminateWorkerFn() {
    destroyWorker()

    if (pending === null) {
      workerFnStatus.value = statusIdle
    } else {
      settle(
        statusIdle,
        'reject',
        new Error('useWebWorkerFn: the worker was terminated')
      )
    }
  }

  if (getCurrentInstance() !== null) {
    onBeforeUnmount(() => {
      terminateWorkerFn()

      if (blobUrl !== null) {
        URL.revokeObjectURL(blobUrl)
        blobUrl = null
      }
    })
  }

  return { runWorkerFn, workerFnStatus, terminateWorkerFn }
}
