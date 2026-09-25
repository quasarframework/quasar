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
        const { workerStatus, data, error, postMessage, terminate } =
          mountWorker(createScriptUrl())

        expect(isRef(workerStatus)).toBe(true)
        expect(workerStatus.value).toBe('idle')
        expect(isRef(data)).toBe(true)
        expect(data.value).toBeNull()
        expect(isRef(error)).toBe(true)
        expect(error.value).toBeNull()
        expect(postMessage).toBeTypeOf('function')
        expect(terminate).toBeTypeOf('function')
      })

      test('creates the worker from a string URL', async () => {
        const { data, postMessage } = mountWorker(createScriptUrl())

        postMessage({ value: 1 })

        await expect.poll(() => data.value).toEqual({ echo: { value: 1 } })
      })

      test('creates the worker from a URL object', async () => {
        const { data, postMessage } = mountWorker(new URL(createScriptUrl()))

        postMessage('hi')

        await expect.poll(() => data.value).toEqual({ echo: 'hi' })
      })

      test('uses a Worker instance as is', async () => {
        const instance = new Worker(createScriptUrl())
        const { workerStatus, data, postMessage } = mountWorker(instance)

        expect(workerStatus.value).toBe('idle')

        postMessage('hi')
        expect(workerStatus.value).toBe('running')

        postMessage('hi')

        await expect.poll(() => data.value).toEqual({ echo: 'hi' })
      })

      test('calls an arrow function factory', async () => {
        const url = createScriptUrl()
        const calls = []
        const factory = opts => {
          calls.push(opts)
          return new Worker(url, opts)
        }
        const { workerStatus, data, postMessage } = mountWorker(factory, {
          name: 'arrow'
        })

        expect(calls).toEqual([])

        postMessage('hi')

        expect(calls).toEqual([{ type: 'module', name: 'arrow' }])
        expect(workerStatus.value).toBe('running')

        await expect
          .poll(() => data.value)
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

        const { workerStatus, data, postMessage } = mountWorker(MyWorker, {
          name: 'class'
        })

        postMessage('hi')

        expect(workerStatus.value).toBe('running')

        await expect
          .poll(() => data.value)
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

        const { workerStatus, data, postMessage } = mountWorker(factory, {
          name: 'fn'
        })

        postMessage('hi')

        expect(workerStatus.value).toBe('running')

        await expect.poll(() => data.value).toEqual({ echo: 'hi', name: 'fn' })
      })

      test('passes the native options to a URL worker', async () => {
        // top-level "this" is undefined in a module script only
        const url = createScriptUrl(`
          postMessage({
            name: self.name,
            kind: this === undefined ? 'module' : 'classic'
          })
        `)

        const { data } = mountWorker(url, {
          type: 'classic',
          name: 'legacy',
          eager: true
        })

        await expect
          .poll(() => data.value)
          .toEqual({
            name: 'legacy',
            kind: 'classic'
          })
      })

      test('creates a module worker by default', async () => {
        const url = createScriptUrl(`
          postMessage(this === undefined ? 'module' : 'classic')
        `)

        const { data } = mountWorker(url, { eager: true })

        await expect.poll(() => data.value).toBe('module')
      })

      test('calls onMessage with the data and the event', async () => {
        const onMessage = vi.fn()
        const { data, postMessage } = mountWorker(createScriptUrl(), {
          onMessage
        })

        postMessage(2)

        await expect.poll(() => onMessage).toHaveBeenCalledTimes(1)

        const [payload, evt] = onMessage.mock.calls[0]
        expect(payload).toEqual({ echo: 2 })
        expect(evt).toBeInstanceOf(MessageEvent)
        expect(data.value).toBe(payload)
      })

      test('calls onCreate with each worker created', async () => {
        const url = createScriptUrl()
        const workers = []
        const onCreate = vi.fn()
        const { data, postMessage, terminate } = mountWorker(
          () => {
            const worker = new Worker(url)
            workers.push(worker)
            return worker
          },
          { onCreate }
        )

        expect(onCreate).not.toHaveBeenCalled()

        postMessage(1)
        await expect.poll(() => data.value).toEqual({ echo: 1 })
        expect(onCreate).toHaveBeenCalledTimes(1)
        expect(onCreate).toHaveBeenLastCalledWith(workers[0])

        terminate()
        postMessage(2)
        await expect.poll(() => data.value).toEqual({ echo: 2 })
        expect(onCreate).toHaveBeenCalledTimes(2)
        expect(onCreate).toHaveBeenLastCalledWith(workers[1])
      })

      test('onCreate can post the init message', async () => {
        const url = createScriptUrl()
        const { data } = mountWorker(url, {
          eager: true,
          onCreate(worker) {
            worker.postMessage('init')
          }
        })

        await expect.poll(() => data.value).toEqual({ echo: 'init' })
      })

      test('calls onTerminate with the killed worker, on terminate() and on unmount', () => {
        const url = createScriptUrl()
        const workers = []
        const onTerminate = vi.fn()
        const { wrapper, workerStatus, postMessage, terminate } = mountWorker(
          () => {
            const worker = new Worker(url)
            workers.push(worker)
            return worker
          },
          { onTerminate }
        )

        terminate()
        expect(onTerminate).not.toHaveBeenCalled()

        postMessage(1)
        terminate()
        expect(onTerminate).toHaveBeenCalledTimes(1)
        expect(onTerminate).toHaveBeenLastCalledWith(workers[0])
        expect(workerStatus.value).toBe('idle')

        postMessage(2)
        wrapper.unmount()
        expect(onTerminate).toHaveBeenCalledTimes(2)
        expect(onTerminate).toHaveBeenLastCalledWith(workers[1])
        expect(workerStatus.value).toBe('terminated')
      })

      test('postMessage() transfers the listed objects', async () => {
        const url = createScriptUrl(`onmessage = evt => {
          postMessage(evt.data.byteLength)
        }`)
        const { data, postMessage } = mountWorker(url)
        const buffer = new ArrayBuffer(16)

        postMessage(buffer, [buffer])

        expect(buffer.byteLength).toBe(0)
        await expect.poll(() => data.value).toBe(16)
      })

      test('reports a failing worker script through error and onError', async () => {
        const onError = vi.fn(evt => {
          // keep the uncaught error away from window
          evt.preventDefault()
        })
        const { error } = mountWorker(
          createScriptUrl('throw new Error("boom")'),
          { eager: true, onError }
        )

        await expect.poll(() => error.value).toBeInstanceOf(ErrorEvent)
        expect(error.value.message).toContain('boom')
        expect(onError).toHaveBeenCalledWith(error.value)
      })

      test('terminate() kills a Worker instance for good', async () => {
        const url = createScriptUrl()
        const instance = new Worker(url)
        const terminateSpy = vi.spyOn(instance, 'terminate')
        const postSpy = vi.spyOn(instance, 'postMessage')

        const { workerStatus, data, postMessage, terminate } =
          mountWorker(instance)

        postMessage(1)
        await expect.poll(() => data.value).toEqual({ echo: 1 })

        terminate()

        expect(terminateSpy).toHaveBeenCalledTimes(1)
        expect(workerStatus.value).toBe('terminated')

        postMessage(2)
        terminate()

        expect(postSpy).toHaveBeenCalledTimes(1)
        expect(terminateSpy).toHaveBeenCalledTimes(1)
        expect(data.value).toEqual({ echo: 1 })
      })

      test('does not create the worker until the first postMessage()', () => {
        const url = createScriptUrl()
        let created = 0
        const { workerStatus, postMessage } = mountWorker(() => {
          created++
          return new Worker(url)
        })

        expect(created).toBe(0)
        expect(workerStatus.value).toBe('idle')

        postMessage('hi')
        postMessage('hi')

        expect(created).toBe(1)
        expect(workerStatus.value).toBe('running')
      })

      test('"eager" option creates the worker on mount, not in setup', () => {
        const url = createScriptUrl()
        let result, statusAtSetup
        mount(
          defineComponent({
            setup() {
              result = useWebWorker(url, { eager: true })
              statusAtSetup = result.workerStatus.value
              return () => h('div')
            }
          })
        )

        expect(statusAtSetup).toBe('idle')
        expect(result.workerStatus.value).toBe('running')
      })

      test('"eager" option creates the worker right away outside of a component', () => {
        const { workerStatus, terminate } = useWebWorker(createScriptUrl(), {
          eager: true
        })

        expect(workerStatus.value).toBe('running')
        terminate()
      })

      test('creates the worker at a postMessage() before mount', async () => {
        const url = createScriptUrl()
        let result, statusAtSetup
        const wrapper = mount(
          defineComponent({
            setup() {
              result = useWebWorker(url)
              result.postMessage('early')
              statusAtSetup = result.workerStatus.value
              return () => h('div')
            }
          })
        )

        expect(statusAtSetup).toBe('running')
        expect(result.workerStatus.value).toBe('running')
        await expect.poll(() => result.data.value).toEqual({ echo: 'early' })

        wrapper.unmount()
        expect(result.workerStatus.value).toBe('terminated')
      })

      test('terminate() releases the worker and the next postMessage() creates a new one', async () => {
        const url = createScriptUrl()
        const workers = []
        const { workerStatus, data, postMessage, terminate } = mountWorker(
          () => {
            const worker = new Worker(url)
            vi.spyOn(worker, 'terminate')
            workers.push(worker)
            return worker
          }
        )

        postMessage(1)
        await expect.poll(() => data.value).toEqual({ echo: 1 })

        terminate()

        expect(workers).toHaveLength(1)
        expect(workers[0].terminate).toHaveBeenCalledTimes(1)
        expect(workerStatus.value).toBe('idle')

        postMessage(2)

        expect(workers).toHaveLength(2)
        expect(workerStatus.value).toBe('running')
        await expect.poll(() => data.value).toEqual({ echo: 2 })
      })

      test('terminate() before the worker exists keeps it idle', () => {
        const url = createScriptUrl()
        let created = 0
        const { workerStatus, postMessage, terminate } = mountWorker(() => {
          created++
          return new Worker(url)
        })

        terminate()

        expect(created).toBe(0)
        expect(workerStatus.value).toBe('idle')

        postMessage('now')
        expect(created).toBe(1)
        expect(workerStatus.value).toBe('running')
      })

      test('"eager" worker is not re-created by terminate()', () => {
        const url = createScriptUrl()
        let created = 0
        const { workerStatus, postMessage, terminate } = mountWorker(
          () => {
            created++
            return new Worker(url)
          },
          { eager: true }
        )

        expect(created).toBe(1)

        terminate()

        expect(created).toBe(1)
        expect(workerStatus.value).toBe('idle')

        postMessage('again')
        expect(created).toBe(2)
      })

      test('does not create the worker after unmount', () => {
        const url = createScriptUrl()
        let created = 0
        const { wrapper, workerStatus, postMessage } = mountWorker(() => {
          created++
          return new Worker(url)
        })

        postMessage('hi')
        expect(created).toBe(1)

        wrapper.unmount()
        expect(workerStatus.value).toBe('terminated')

        postMessage('never')
        expect(created).toBe(1)
        expect(workerStatus.value).toBe('terminated')
      })

      test('terminates the worker when the component unmounts', () => {
        const instance = new Worker(createScriptUrl())
        const terminateSpy = vi.spyOn(instance, 'terminate')

        const { wrapper, workerStatus } = mountWorker(instance, {
          eager: true
        })

        expect(terminateSpy).not.toHaveBeenCalled()
        expect(workerStatus.value).toBe('running')

        wrapper.unmount()

        expect(terminateSpy).toHaveBeenCalledTimes(1)
        expect(workerStatus.value).toBe('terminated')
      })

      test('can be used outside of a component', async () => {
        const { workerStatus, data, postMessage, terminate } =
          useWebWorker(createScriptUrl())

        expect(workerStatus.value).toBe('idle')

        postMessage('hi')
        expect(workerStatus.value).toBe('running')
        await expect.poll(() => data.value).toEqual({ echo: 'hi' })

        terminate()
        expect(workerStatus.value).toBe('idle')
      })

      test('a passed-in Worker instance stops replying after unmount', async () => {
        // the composable owns the lifecycle regardless of the source form
        const instance = new Worker(createScriptUrl())
        const { wrapper } = mountWorker(instance, { eager: true })

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
