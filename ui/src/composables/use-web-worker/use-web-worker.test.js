import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef } from 'vue'

import useWebWorker from './use-web-worker.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.restoreAllMocks()
})

const scriptUrls = []

// a script that replies to each message with what it received (plus the
// worker's name when it has one, to check the options reached it)
function createScriptUrl(
  body = `onmessage = evt => {
    postMessage(
      self.name === '' ? { echo: evt.data } : { echo: evt.data, name: self.name }
    )
  }`
) {
  const url = URL.createObjectURL(new Blob([body], { type: 'text/javascript' }))
  scriptUrls.push(url)
  return url
}

afterEach(() => {
  scriptUrls.forEach(url => {
    URL.revokeObjectURL(url)
  })
  scriptUrls.length = 0
})

function mountWorker(source, options) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useWebWorker(source, options)
        return () => h('div')
      }
    })
  )

  return { wrapper, ...result }
}

function nextMessage(worker) {
  return new Promise(resolve => {
    worker.addEventListener('message', evt => resolve(evt.data), {
      once: true
    })
  })
}

describe('[useWebWorker API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const {
          workerStatus,
          workerData,
          workerError,
          postWorkerMessage,
          terminateWorker
        } = mountWorker(createScriptUrl())

        expect(isRef(workerStatus)).toBe(true)
        expect(workerStatus.value).toBe('running')
        expect(isRef(workerData)).toBe(true)
        expect(workerData.value).toBeNull()
        expect(isRef(workerError)).toBe(true)
        expect(workerError.value).toBeNull()
        expect(postWorkerMessage).toBeTypeOf('function')
        expect(terminateWorker).toBeTypeOf('function')
      })

      test('creates the worker from a string URL', async () => {
        const { workerData, postWorkerMessage } = mountWorker(createScriptUrl())

        postWorkerMessage({ value: 1 })

        await expect
          .poll(() => workerData.value)
          .toEqual({ echo: { value: 1 } })
      })

      test('creates the worker from a URL object', async () => {
        const { workerData, postWorkerMessage } = mountWorker(
          new URL(createScriptUrl())
        )

        postWorkerMessage('hi')

        await expect.poll(() => workerData.value).toEqual({ echo: 'hi' })
      })

      test('uses a Worker instance as is', async () => {
        const instance = new Worker(createScriptUrl())
        const { workerStatus, workerData, postWorkerMessage } = mountWorker(
          instance,
          { lazy: true }
        )

        expect(workerStatus.value).toBe('idle')

        postWorkerMessage('hi')
        expect(workerStatus.value).toBe('running')

        postWorkerMessage('hi')

        await expect.poll(() => workerData.value).toEqual({ echo: 'hi' })
      })

      test('calls an arrow function factory', async () => {
        const url = createScriptUrl()
        const calls = []
        const factory = opts => {
          calls.push(opts)
          return new Worker(url, opts)
        }
        const { workerStatus, workerData, postWorkerMessage } = mountWorker(
          factory,
          { lazy: true, name: 'arrow' }
        )

        expect(calls).toEqual([])

        postWorkerMessage('hi')

        expect(calls).toEqual([{ type: 'module', name: 'arrow' }])
        expect(workerStatus.value).toBe('running')

        await expect
          .poll(() => workerData.value)
          .toEqual({
            echo: 'hi',
            name: 'arrow'
          })
      })

      test('constructs a class (Vite "?worker" import)', async () => {
        const url = createScriptUrl()
        class MyWorker extends Worker {
          constructor(opts) {
            super(url, opts)
          }
        }

        const { workerStatus, workerData, postWorkerMessage } = mountWorker(
          MyWorker,
          {
            name: 'class'
          }
        )

        postWorkerMessage('hi')

        expect(workerStatus.value).toBe('running')

        await expect
          .poll(() => workerData.value)
          .toEqual({
            echo: 'hi',
            name: 'class'
          })
      })

      test('constructs a regular function factory', async () => {
        const url = createScriptUrl()
        function factory(opts) {
          return new Worker(url, opts)
        }

        const { workerStatus, workerData, postWorkerMessage } = mountWorker(
          factory,
          {
            name: 'fn'
          }
        )

        postWorkerMessage('hi')

        expect(workerStatus.value).toBe('running')

        await expect
          .poll(() => workerData.value)
          .toEqual({ echo: 'hi', name: 'fn' })
      })

      test('passes the native options to a URL worker', async () => {
        // top-level "this" is undefined in a module script only
        const url = createScriptUrl(`
          postMessage({
            name: self.name,
            kind: this === undefined ? 'module' : 'classic'
          })
        `)

        const { workerData } = mountWorker(url, {
          type: 'classic',
          name: 'legacy'
        })

        await expect
          .poll(() => workerData.value)
          .toEqual({
            name: 'legacy',
            kind: 'classic'
          })
      })

      test('creates a module worker by default', async () => {
        const url = createScriptUrl(`
          postMessage(this === undefined ? 'module' : 'classic')
        `)

        const { workerData } = mountWorker(url)

        await expect.poll(() => workerData.value).toBe('module')
      })

      test('calls onMessage with the data and the event', async () => {
        const onMessage = vi.fn()
        const { workerData, postWorkerMessage } = mountWorker(
          createScriptUrl(),
          {
            onMessage
          }
        )

        postWorkerMessage(2)

        await expect.poll(() => onMessage).toHaveBeenCalledTimes(1)

        const [payload, evt] = onMessage.mock.calls[0]
        expect(payload).toEqual({ echo: 2 })
        expect(evt).toBeInstanceOf(MessageEvent)
        expect(workerData.value).toBe(payload)
      })

      test('calls onCreate with each worker created', async () => {
        const url = createScriptUrl()
        const workers = []
        const onCreate = vi.fn()
        const { workerData, postWorkerMessage, terminateWorker } = mountWorker(
          () => {
            const worker = new Worker(url)
            workers.push(worker)
            return worker
          },
          { lazy: true, onCreate }
        )

        expect(onCreate).not.toHaveBeenCalled()

        postWorkerMessage(1)
        await expect.poll(() => workerData.value).toEqual({ echo: 1 })
        expect(onCreate).toHaveBeenCalledTimes(1)
        expect(onCreate).toHaveBeenLastCalledWith(workers[0])

        terminateWorker()
        postWorkerMessage(2)
        await expect.poll(() => workerData.value).toEqual({ echo: 2 })
        expect(onCreate).toHaveBeenCalledTimes(2)
        expect(onCreate).toHaveBeenLastCalledWith(workers[1])
      })

      test('onCreate can post the init message', async () => {
        const url = createScriptUrl()
        const { workerData } = mountWorker(url, {
          onCreate(worker) {
            worker.postMessage('init')
          }
        })

        await expect.poll(() => workerData.value).toEqual({ echo: 'init' })
      })

      test('calls onTerminate with the killed worker and the reason, on terminateWorker() and on unmount', () => {
        const url = createScriptUrl()
        const workers = []
        const onTerminate = vi.fn()
        const { wrapper, workerStatus, postWorkerMessage, terminateWorker } =
          mountWorker(
            () => {
              const worker = new Worker(url)
              workers.push(worker)
              return worker
            },
            { lazy: true, onTerminate }
          )

        terminateWorker()
        expect(onTerminate).not.toHaveBeenCalled()

        postWorkerMessage(1)
        terminateWorker()
        expect(onTerminate).toHaveBeenCalledTimes(1)
        expect(onTerminate).toHaveBeenLastCalledWith(workers[0], 'terminate')
        expect(workerStatus.value).toBe('idle')

        postWorkerMessage(2)
        wrapper.unmount()
        expect(onTerminate).toHaveBeenCalledTimes(2)
        expect(onTerminate).toHaveBeenLastCalledWith(workers[1], 'unmount')
        expect(workerStatus.value).toBe('terminated')
      })

      test('postWorkerMessage() transfers the listed objects', async () => {
        const url = createScriptUrl(`onmessage = evt => {
          postMessage(evt.data.byteLength)
        }`)
        const { workerData, postWorkerMessage } = mountWorker(url)
        const buffer = new ArrayBuffer(16)

        postWorkerMessage(buffer, [buffer])

        expect(buffer.byteLength).toBe(0)
        await expect.poll(() => workerData.value).toBe(16)
      })

      test('reports a failing worker script through workerError and onError', async () => {
        const onError = vi.fn(evt => {
          // keep the uncaught error away from window
          evt.preventDefault()
        })
        const { workerError } = mountWorker(
          createScriptUrl('throw new Error("boom")'),
          { onError }
        )

        await expect.poll(() => workerError.value).toBeInstanceOf(ErrorEvent)
        expect(workerError.value.message).toContain('boom')
        expect(onError).toHaveBeenCalledWith(workerError.value)
      })

      test('terminateWorker() kills a Worker instance for good', async () => {
        const url = createScriptUrl()
        const instance = new Worker(url)
        const terminateSpy = vi.spyOn(instance, 'terminate')
        const postSpy = vi.spyOn(instance, 'postMessage')

        const { workerStatus, workerData, postWorkerMessage, terminateWorker } =
          mountWorker(instance)

        postWorkerMessage(1)
        await expect.poll(() => workerData.value).toEqual({ echo: 1 })

        terminateWorker()

        expect(terminateSpy).toHaveBeenCalledTimes(1)
        expect(workerStatus.value).toBe('terminated')

        postWorkerMessage(2)
        terminateWorker()

        expect(postSpy).toHaveBeenCalledTimes(1)
        expect(terminateSpy).toHaveBeenCalledTimes(1)
        expect(workerData.value).toEqual({ echo: 1 })
      })

      test('"lazy" option does not create the worker until the first postWorkerMessage()', () => {
        const url = createScriptUrl()
        let created = 0
        const { workerStatus, postWorkerMessage } = mountWorker(
          () => {
            created++
            return new Worker(url)
          },
          { lazy: true }
        )

        expect(created).toBe(0)
        expect(workerStatus.value).toBe('idle')

        postWorkerMessage('hi')
        postWorkerMessage('hi')

        expect(created).toBe(1)
        expect(workerStatus.value).toBe('running')
      })

      test('creates the worker on mount, not in setup', () => {
        const url = createScriptUrl()
        let result, statusAtSetup
        mount(
          defineComponent({
            setup() {
              result = useWebWorker(url)
              statusAtSetup = result.workerStatus.value
              return () => h('div')
            }
          })
        )

        expect(statusAtSetup).toBe('idle')
        expect(result.workerStatus.value).toBe('running')
      })

      test('creates the worker right away outside of a component', () => {
        const { workerStatus, terminateWorker } =
          useWebWorker(createScriptUrl())

        expect(workerStatus.value).toBe('running')
        terminateWorker()
      })

      test('creates the worker at a postWorkerMessage() before mount', async () => {
        const url = createScriptUrl()
        let result, statusAtSetup
        const wrapper = mount(
          defineComponent({
            setup() {
              result = useWebWorker(url)
              result.postWorkerMessage('early')
              statusAtSetup = result.workerStatus.value
              return () => h('div')
            }
          })
        )

        expect(statusAtSetup).toBe('running')
        expect(result.workerStatus.value).toBe('running')
        await expect
          .poll(() => result.workerData.value)
          .toEqual({ echo: 'early' })

        wrapper.unmount()
        expect(result.workerStatus.value).toBe('terminated')
      })

      test('terminateWorker() releases the worker and the next postWorkerMessage() creates a new one', async () => {
        const url = createScriptUrl()
        const workers = []
        const { workerStatus, workerData, postWorkerMessage, terminateWorker } =
          mountWorker(() => {
            const worker = new Worker(url)
            vi.spyOn(worker, 'terminate')
            workers.push(worker)
            return worker
          })

        postWorkerMessage(1)
        await expect.poll(() => workerData.value).toEqual({ echo: 1 })

        terminateWorker()

        expect(workers).toHaveLength(1)
        expect(workers[0].terminate).toHaveBeenCalledTimes(1)
        expect(workerStatus.value).toBe('idle')

        postWorkerMessage(2)

        expect(workers).toHaveLength(2)
        expect(workerStatus.value).toBe('running')
        await expect.poll(() => workerData.value).toEqual({ echo: 2 })
      })

      test('terminateWorker() before the worker exists keeps it idle', () => {
        const url = createScriptUrl()
        let created = 0
        const { workerStatus, postWorkerMessage, terminateWorker } =
          mountWorker(
            () => {
              created++
              return new Worker(url)
            },
            { lazy: true }
          )

        terminateWorker()

        expect(created).toBe(0)
        expect(workerStatus.value).toBe('idle')

        postWorkerMessage('now')
        expect(created).toBe(1)
        expect(workerStatus.value).toBe('running')
      })

      test('the worker created on mount is not re-created by terminateWorker()', () => {
        const url = createScriptUrl()
        let created = 0
        const { workerStatus, postWorkerMessage, terminateWorker } =
          mountWorker(() => {
            created++
            return new Worker(url)
          })

        expect(created).toBe(1)

        terminateWorker()

        expect(created).toBe(1)
        expect(workerStatus.value).toBe('idle')

        postWorkerMessage('again')
        expect(created).toBe(2)
      })

      test('does not create the worker after unmount', () => {
        const url = createScriptUrl()
        let created = 0
        const { wrapper, workerStatus, postWorkerMessage } = mountWorker(() => {
          created++
          return new Worker(url)
        })

        postWorkerMessage('hi')
        expect(created).toBe(1)

        wrapper.unmount()
        expect(workerStatus.value).toBe('terminated')

        postWorkerMessage('never')
        expect(created).toBe(1)
        expect(workerStatus.value).toBe('terminated')
      })

      test('terminates the worker when the component unmounts', () => {
        const instance = new Worker(createScriptUrl())
        const terminateSpy = vi.spyOn(instance, 'terminate')

        const { wrapper, workerStatus } = mountWorker(instance)

        expect(terminateSpy).not.toHaveBeenCalled()
        expect(workerStatus.value).toBe('running')

        wrapper.unmount()

        expect(terminateSpy).toHaveBeenCalledTimes(1)
        expect(workerStatus.value).toBe('terminated')
      })

      test('"lazy" option waits for the first postWorkerMessage() outside of a component', async () => {
        const { workerStatus, workerData, postWorkerMessage, terminateWorker } =
          useWebWorker(createScriptUrl(), { lazy: true })

        expect(workerStatus.value).toBe('idle')

        postWorkerMessage('hi')
        expect(workerStatus.value).toBe('running')
        await expect.poll(() => workerData.value).toEqual({ echo: 'hi' })

        terminateWorker()
        expect(workerStatus.value).toBe('idle')
      })

      test('a passed-in Worker instance stops replying after unmount', async () => {
        // the composable owns the lifecycle regardless of the source form
        const instance = new Worker(createScriptUrl())
        const { wrapper } = mountWorker(instance)

        const reply = nextMessage(instance)
        instance.postMessage('direct')
        await expect(reply).resolves.toEqual({ echo: 'direct' })

        wrapper.unmount()

        const afterUnmount = vi.fn()
        instance.addEventListener('message', afterUnmount)
        instance.postMessage('after')

        await new Promise(resolve => {
          setTimeout(resolve, 50)
        })
        expect(afterUnmount).not.toHaveBeenCalled()
      })
    })
  })
})
