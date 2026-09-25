import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef } from 'vue'

import useWebWorkerFn from './use-web-worker-fn.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.restoreAllMocks()
})

function mountWorkerFn(fn, options) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useWebWorkerFn(fn, options)
        return () => h('div')
      }
    })
  )

  return { wrapper, ...result }
}

function sum(a, b) {
  return a + b
}

// counts the calls served by the same worker (its global scope survives
// between calls only while the worker does)
function countCalls() {
  self.calls = (self.calls ?? 0) + 1
  return self.calls
}

function busyWait(ms) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    // spin
  }
  return ms
}

describe('[useWebWorkerFn API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const { runWorkerFn, workerFnStatus, terminateWorkerFn } =
          mountWorkerFn(sum)

        expect(runWorkerFn).toBeTypeOf('function')
        expect(isRef(workerFnStatus)).toBe(true)
        expect(workerFnStatus.value).toBe('idle')
        expect(terminateWorkerFn).toBeTypeOf('function')
      })

      test('runs the function with the arguments and resolves its result', async () => {
        const { runWorkerFn, workerFnStatus } = mountWorkerFn(sum)

        const promise = runWorkerFn(2, 3)
        expect(workerFnStatus.value).toBe('running')

        await expect(promise).resolves.toBe(5)
        expect(workerFnStatus.value).toBe('success')
      })

      test('awaits an async function', async () => {
        const { runWorkerFn } = mountWorkerFn(
          n =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve(n * 2)
              }, 10)
            })
        )

        await expect(runWorkerFn(21)).resolves.toBe(42)
      })

      test('rejects with the error the function threw', async () => {
        const { runWorkerFn, workerFnStatus } = mountWorkerFn(() => {
          throw new RangeError('too far')
        })

        const promise = runWorkerFn()

        await expect(promise).rejects.toBeInstanceOf(Error)
        await expect(promise).rejects.toHaveProperty('message', 'too far')
        expect(workerFnStatus.value).toBe('error')
      })

      test('rejects with the string form of a value that cannot be cloned', async () => {
        const { runWorkerFn, workerFnStatus } = mountWorkerFn(() => () => 1)

        await expect(runWorkerFn()).rejects.toMatch(/DataCloneError/)
        expect(workerFnStatus.value).toBe('error')
      })

      test('rejects an argument that cannot be cloned', async () => {
        const { runWorkerFn, workerFnStatus } = mountWorkerFn(sum)

        await expect(runWorkerFn(() => 1, 2)).rejects.toThrow(/clone/)
        expect(workerFnStatus.value).toBe('error')

        // the worker is still usable
        await expect(runWorkerFn(1, 2)).resolves.toBe(3)
      })

      test('rejects a second call while one is running', async () => {
        const { runWorkerFn } = mountWorkerFn(sum)

        const first = runWorkerFn(1, 1)

        await expect(runWorkerFn(2, 2)).rejects.toThrow(/already running/)
        await expect(first).resolves.toBe(2)
      })

      test('reuses the worker across calls', async () => {
        const { runWorkerFn } = mountWorkerFn(countCalls)

        await expect(runWorkerFn()).resolves.toBe(1)
        await expect(runWorkerFn()).resolves.toBe(2)
      })

      test('"timeout" option kills the worker and rejects', async () => {
        // generous enough for a worker to start on a loaded machine
        const { runWorkerFn, workerFnStatus } = mountWorkerFn(busyWait, {
          timeout: 1000
        })

        await expect(runWorkerFn(10_000)).rejects.toThrow(/timed out/)
        expect(workerFnStatus.value).toBe('timeout')

        // the next call gets a fresh worker
        await expect(runWorkerFn(1)).resolves.toBe(1)
        expect(workerFnStatus.value).toBe('success')
      })

      test('a call that finishes in time is not affected by "timeout"', async () => {
        vi.useFakeTimers()

        const { runWorkerFn } = mountWorkerFn(sum, { timeout: 1000 })

        await expect(runWorkerFn(1, 2)).resolves.toBe(3)

        expect(vi.getTimerCount()).toBe(0)

        vi.useRealTimers()
      })

      test('"localDependencies" option inlines named functions', async () => {
        function double(n) {
          return n * 2
        }
        const triple = n => n * 3

        const { runWorkerFn } = mountWorkerFn(n => double(n) + triple(n), {
          localDependencies: [double, triple]
        })

        await expect(runWorkerFn(2)).resolves.toBe(10)
      })

      test('"localDependencies" option rejects an unnamed function', async () => {
        const { runWorkerFn, workerFnStatus } = mountWorkerFn(sum, {
          localDependencies: [
            (
              () => n =>
                n
            )()
          ]
        })

        await expect(runWorkerFn(1, 2)).rejects.toThrow(/named functions/)
        expect(workerFnStatus.value).toBe('error')
      })

      test('"dependencies" option loads scripts in the worker', async () => {
        const url = URL.createObjectURL(
          new Blob(['self.fromDep = 40'], { type: 'text/javascript' })
        )

        const { runWorkerFn } = mountWorkerFn(n => self.fromDep + n, {
          dependencies: [url]
        })

        await expect(runWorkerFn(2)).resolves.toBe(42)

        URL.revokeObjectURL(url)
      })

      test('rejects when the worker script fails to start', async () => {
        const { runWorkerFn, workerFnStatus } = mountWorkerFn(sum, {
          dependencies: ['/definitely-missing-script.js']
        })

        await expect(runWorkerFn(1, 2)).rejects.toBeInstanceOf(Error)
        expect(workerFnStatus.value).toBe('error')

        // the failed worker got discarded; the next call starts a new one,
        // which fails the same way
        await expect(runWorkerFn(1, 2)).rejects.toBeInstanceOf(Error)
      })

      test('"transfer" option moves the listed objects to the worker', async () => {
        const { runWorkerFn } = mountWorkerFn(buffer => buffer.byteLength, {
          transfer: buffer => [buffer]
        })
        const buffer = new ArrayBuffer(8)

        const promise = runWorkerFn(buffer)
        expect(buffer.byteLength).toBe(0)

        await expect(promise).resolves.toBe(8)
      })

      test('terminateWorkerFn() rejects the running call and resets the status', async () => {
        const { runWorkerFn, workerFnStatus, terminateWorkerFn } =
          mountWorkerFn(busyWait)

        const promise = runWorkerFn(2000)
        terminateWorkerFn()

        await expect(promise).rejects.toThrow(/terminated/)
        expect(workerFnStatus.value).toBe('idle')

        // a new worker serves the next call
        await expect(runWorkerFn(1)).resolves.toBe(1)
      })

      test('terminateWorkerFn() starts a fresh worker for the next call', async () => {
        const { runWorkerFn, workerFnStatus, terminateWorkerFn } =
          mountWorkerFn(countCalls)

        await expect(runWorkerFn()).resolves.toBe(1)

        terminateWorkerFn()
        expect(workerFnStatus.value).toBe('idle')

        await expect(runWorkerFn()).resolves.toBe(1)
      })

      test('terminates the worker and releases the script on unmount', async () => {
        const terminateSpy = vi.spyOn(Worker.prototype, 'terminate')
        const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')

        const { wrapper } = mountWorkerFn(busyWait)

        // nothing to release before the first call
        wrapper.unmount()
        expect(terminateSpy).not.toHaveBeenCalled()
        expect(revokeSpy).not.toHaveBeenCalled()

        const second = mountWorkerFn(busyWait)
        const promise = second.runWorkerFn(2000)

        second.wrapper.unmount()

        expect(terminateSpy).toHaveBeenCalledTimes(1)
        expect(revokeSpy).toHaveBeenCalledTimes(1)
        await expect(promise).rejects.toThrow(/terminated/)
        expect(second.workerFnStatus.value).toBe('idle')
      })

      test('calls onSuccess with the result and the arguments', async () => {
        const onSuccess = vi.fn()
        const { runWorkerFn } = mountWorkerFn(sum, { onSuccess })

        await expect(runWorkerFn(1, 2)).resolves.toBe(3)

        expect(onSuccess).toHaveBeenCalledTimes(1)
        expect(onSuccess).toHaveBeenCalledWith(3, [1, 2])
      })

      test('calls onError with the error the function threw', async () => {
        const onError = vi.fn()
        const { runWorkerFn } = mountWorkerFn(
          () => {
            throw new RangeError('too far')
          },
          { onError }
        )

        const promise = runWorkerFn('x')
        await expect(promise).rejects.toHaveProperty('message', 'too far')

        expect(onError).toHaveBeenCalledTimes(1)
        const [error, args] = onError.mock.calls[0]
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('too far')
        expect(args).toEqual(['x'])
      })

      test('calls onError for an argument that cannot be cloned', async () => {
        const onError = vi.fn()
        const { runWorkerFn } = mountWorkerFn(sum, { onError })
        const arg = () => 1

        await expect(runWorkerFn(arg, 2)).rejects.toThrow(/clone/)

        expect(onError).toHaveBeenCalledTimes(1)
        expect(onError.mock.calls[0][1]).toEqual([arg, 2])
      })

      test('calls onError and onTerminate when the worker script fails to start', async () => {
        const calls = []
        const { runWorkerFn } = mountWorkerFn(sum, {
          dependencies: ['/definitely-missing-script.js'],
          onError(error, args) {
            calls.push(['error', error, args])
          },
          onTerminate() {
            calls.push(['terminate'])
          }
        })

        await expect(runWorkerFn(1, 2)).rejects.toBeInstanceOf(Error)

        expect(calls).toHaveLength(2)
        expect(calls[0][0]).toBe('error')
        expect(calls[0][1]).toBeInstanceOf(Error)
        expect(calls[0][2]).toEqual([1, 2])
        expect(calls[1]).toEqual(['terminate'])
      })

      test('calls onTimeout then onTerminate on a timeout', async () => {
        const calls = []
        const onError = vi.fn()
        const { runWorkerFn } = mountWorkerFn(busyWait, {
          timeout: 1000,
          onError,
          onTimeout(args) {
            calls.push(['timeout', args])
          },
          onTerminate() {
            calls.push(['terminate'])
          }
        })

        await expect(runWorkerFn(10_000)).rejects.toThrow(/timed out/)

        expect(calls).toEqual([['timeout', [10_000]], ['terminate']])
        expect(onError).not.toHaveBeenCalled()
      })

      test('calls onTerminate on terminateWorkerFn() and on unmount, only when a worker existed', async () => {
        const onTerminate = vi.fn()
        const onError = vi.fn()
        const { wrapper, runWorkerFn, terminateWorkerFn } = mountWorkerFn(
          busyWait,
          { onTerminate, onError }
        )

        terminateWorkerFn()
        expect(onTerminate).not.toHaveBeenCalled()

        await expect(runWorkerFn(1)).resolves.toBe(1)
        terminateWorkerFn()
        expect(onTerminate).toHaveBeenCalledTimes(1)

        const promise = runWorkerFn(2000)
        wrapper.unmount()

        await expect(promise).rejects.toThrow(/terminated/)
        expect(onTerminate).toHaveBeenCalledTimes(2)
        // a termination is not an outcome of the call
        expect(onError).not.toHaveBeenCalled()
      })

      test('can be used outside of a component', async () => {
        const { runWorkerFn, workerFnStatus, terminateWorkerFn } =
          useWebWorkerFn(sum)

        await expect(runWorkerFn(1, 2)).resolves.toBe(3)
        expect(workerFnStatus.value).toBe('success')

        terminateWorkerFn()
        expect(workerFnStatus.value).toBe('idle')
      })
    })
  })
})
