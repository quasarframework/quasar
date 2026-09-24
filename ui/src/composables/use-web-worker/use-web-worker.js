import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef
} from 'vue'

import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const {
 *      workerStatus, data, error, postMessage, terminate
 *    } = useWebWorker(source, options)
 *
 * source  - the script URL (string or URL), a Worker instance, or a
 *           function returning a Worker (also the constructor of a Vite
 *           `?worker` import)
 * options - plain object (all optional):
 *    type, name, credentials - the native Worker options, for a URL
 *                              source (type defaults to 'module')
 *    eager                   - create the worker as soon as the component
 *                              is mounted (default: at the first
 *                              postMessage)
 *    onMessage(data, evt)    - called with each message from the worker
 *    onError(evt)            - called with the 'error' / 'messageerror'
 *                              events of the worker
 *
 * workerStatus - Ref<'idle' | 'running' | 'terminated'>; 'idle' until
 *               the worker gets created
 * data        - ShallowRef of the last message's data
 * error       - ShallowRef of the last 'error' / 'messageerror' event
 * postMessage - sends a message (with an optional transfer list) to the
 *               worker, creating it if that did not happen yet; no-op
 *               once terminated
 * terminate   - kills the worker for good (also happens on unmount)
 */

function createWorker(source, opts) {
  if (source instanceof Worker) {
    return source
  }

  if (typeof source === 'function') {
    // arrow functions have no prototype and cannot be constructed; a
    // regular function factory or a class (Vite's `?worker` default
    // export) hands back the Worker either way
    return source.prototype === void 0
      ? source(opts)
      : Reflect.construct(source, [opts])
  }

  return new Worker(source, opts)
}

const statusIdle = 'idle',
  statusRunning = 'running',
  statusTerminated = 'terminated'

export default function useWebWorker(source, options) {
  const workerStatus = ref(statusIdle)
  const data = shallowRef(null)
  const error = shallowRef(null)

  if (__QUASAR_SSR_SERVER__) {
    return { workerStatus, data, error, postMessage: noop, terminate: noop }
  }

  const vm = getCurrentInstance()
  const {
    type = 'module',
    name,
    credentials,
    eager,
    onMessage,
    onError
  } = options ?? {}

  let instance = null

  function onWorkerMessage(evt) {
    data.value = evt.data
    onMessage?.(evt.data, evt)
  }

  function onWorkerError(evt) {
    error.value = evt
    onError?.(evt)
  }

  function getWorker() {
    if (instance === null && workerStatus.value === statusIdle) {
      instance = createWorker(source, { type, name, credentials })

      instance.addEventListener('message', onWorkerMessage)
      instance.addEventListener('error', onWorkerError)
      instance.addEventListener('messageerror', onWorkerError)

      workerStatus.value = statusRunning
    }

    return instance
  }

  function terminate() {
    workerStatus.value = statusTerminated

    if (instance !== null) {
      instance.removeEventListener('message', onWorkerMessage)
      instance.removeEventListener('error', onWorkerError)
      instance.removeEventListener('messageerror', onWorkerError)
      instance.terminate()

      instance = null
    }
  }

  if (vm !== null) {
    if (eager === true) {
      // the server has no worker, so the client cannot have one before
      // hydration either
      onMounted(getWorker)
    }

    onBeforeUnmount(terminate)
  } else if (eager === true) {
    getWorker()
  }

  return {
    workerStatus,
    data,
    error,

    postMessage(message, transfer) {
      getWorker()?.postMessage(message, transfer)
    },

    terminate
  }
}
