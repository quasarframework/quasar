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
 *      workerStatus, workerData, workerError, postWorkerMessage, terminateWorker
 *    } = useWebWorker(source, options)
 *
 * source  - the script URL (string or URL), a Worker instance, or a
 *           function returning a Worker (also the constructor of a Vite
 *           `?worker` import)
 * options - plain object (all optional):
 *    lazy                    - do not create the worker on mount (or
 *                              right away, outside of a component); the
 *                              first postWorkerMessage() does it
 *    type, name, credentials - the native Worker options, for a URL
 *                              source (type defaults to 'module')
 *    onMessage(data, evt)    - called with each message from the worker
 *    onError(evt)            - called with the 'error' / 'messageerror'
 *                              events of the worker
 *    onCreate(worker)        - called with each Worker the composable
 *                              starts using (send the init message here)
 *    onTerminate(worker, reason) - called right after a worker got
 *                              killed; reason is 'terminate' (a
 *                              terminateWorker() call) or 'unmount'
 *
 * workerStatus      - Ref<'idle' | 'running' | 'terminated'>; 'idle'
 *                     while there is no worker (before it gets created
 *                     and after a terminateWorker()), 'terminated' once
 *                     the component unmounts (or, for a Worker instance
 *                     source, once terminated)
 * workerData        - ShallowRef of the last message's data
 * workerError       - ShallowRef of the last 'error' / 'messageerror'
 *                     event
 * postWorkerMessage - sends a message (with an optional transfer list)
 *                     to the worker, creating it if there is none;
 *                     no-op once 'terminated'
 * terminateWorker   - kills the worker; the next postWorkerMessage()
 *                     creates a new one from a URL or function source
 *                     (a Worker instance cannot be re-created, so it
 *                     stays terminated)
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
  const workerData = shallowRef(null)
  const workerError = shallowRef(null)

  if (__QUASAR_SSR_SERVER__) {
    return {
      workerStatus,
      workerData,
      workerError,
      postWorkerMessage: noop,
      terminateWorker: noop
    }
  }

  const vm = getCurrentInstance()
  const {
    lazy,
    type = 'module',
    name,
    credentials,
    onMessage,
    onError,
    onCreate,
    onTerminate
  } = options ?? {}

  let instance = null

  function onWorkerMessage(evt) {
    workerData.value = evt.data
    onMessage?.(evt.data, evt)
  }

  function onWorkerError(evt) {
    workerError.value = evt
    onError?.(evt)
  }

  function getWorker() {
    if (instance === null && workerStatus.value === statusIdle) {
      instance = createWorker(source, { type, name, credentials })

      instance.addEventListener('message', onWorkerMessage)
      instance.addEventListener('error', onWorkerError)
      instance.addEventListener('messageerror', onWorkerError)

      workerStatus.value = statusRunning
      onCreate?.(instance)
    }

    return instance
  }

  function stop(status, reason) {
    workerStatus.value = status

    if (instance !== null) {
      instance.removeEventListener('message', onWorkerMessage)
      instance.removeEventListener('error', onWorkerError)
      instance.removeEventListener('messageerror', onWorkerError)
      instance.terminate()

      const worker = instance
      instance = null
      onTerminate?.(worker, reason)
    }
  }

  if (vm !== null) {
    if (lazy !== true) {
      // the server has no worker, so the client cannot have one before
      // hydration either
      onMounted(getWorker)
    }

    onBeforeUnmount(() => {
      stop(statusTerminated, 'unmount')
    })
  } else if (lazy !== true) {
    getWorker()
  }

  return {
    workerStatus,
    workerData,
    workerError,

    postWorkerMessage(message, transfer) {
      getWorker()?.postMessage(message, transfer)
    },

    terminateWorker() {
      stop(
        source instanceof Worker ? statusTerminated : statusIdle,
        'terminate'
      )
    }
  }
}
