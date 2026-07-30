import { describe, expect, test, vi } from 'vitest'
import runSequentialPromises from './run-sequential-promises.js'

// Helper to simulate asynchronous tasks
const delay = (ms, value, shouldReject = false) => {
  const { promise, resolve, reject } = Promise.withResolvers()
  setTimeout(() => {
    if (shouldReject) reject(value)
    else resolve(value)
  }, ms)

  return promise
}

describe('[runSequentialPromises API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('resolves with an empty array if passed an empty array', async () => {
        const result = await runSequentialPromises([])
        expect(result).toEqual([])
      })

      test('resolves with an empty object if passed an empty object', async () => {
        const result = await runSequentialPromises({})
        expect(result).toEqual({})
      })

      describe('Array Inputs', () => {
        test('runs an array of promises and returns fulfilled statuses', async () => {
          const tasks = [() => delay(10, 'first'), () => delay(10, 'second')]
          const result = await runSequentialPromises(tasks)

          expect(result).toEqual([
            { key: 0, status: 'fulfilled', value: 'first' },
            { key: 1, status: 'fulfilled', value: 'second' }
          ])
        })

        test('passes the resultAggregator down to subsequent promises', async () => {
          const tasks = [
            () => delay(10, 'first'),
            agg => delay(10, agg[0].value + ' and second')
          ]

          const result = await runSequentialPromises(tasks)

          expect(result[1].value).toBe('first and second')
        })
      })

      describe('Object Inputs', () => {
        test('runs an object of promises and returns fulfilled statuses', async () => {
          const tasks = {
            taskA: () => delay(10, 'alpha'),
            taskB: () => delay(10, 'beta')
          }

          const result = await runSequentialPromises(tasks)

          expect(result).toEqual({
            taskA: { key: 'taskA', status: 'fulfilled', value: 'alpha' },
            taskB: { key: 'taskB', status: 'fulfilled', value: 'beta' }
          })
        })

        test('passes the resultAggregator correctly for objects', async () => {
          const tasks = {
            taskA: () => delay(10, 100),
            taskB: agg => delay(10, agg.taskA.value + 50)
          }

          const result = await runSequentialPromises(tasks)

          expect(result.taskB.value).toBe(150)
        })

        test('supports object jobs with reserved property names', async () => {
          const names = ['__proto__', 'constructor', 'toString']
          const tasks = Object.fromEntries(
            names.map(name => [name, () => Promise.resolve(name)])
          )

          const result = await runSequentialPromises(tasks)

          expect(Object.getPrototypeOf(result)).toBeNull()

          for (const name of names) {
            expect(result[name]).toStrictEqual({
              key: name,
              status: 'fulfilled',
              value: name
            })
          }
        })
      })

      describe('Error Handling (abortOnFail)', () => {
        test('rejects immediately on first error if abortOnFail is true (default)', async () => {
          const mockTask3 = vi.fn(() => delay(10, 'third'))

          const tasks = [
            () => delay(10, 'first'),
            () => delay(10, new Error('Task 2 Failed'), true), // Rejects
            mockTask3 // Should not run
          ]

          await expect(runSequentialPromises(tasks)).rejects.toMatchObject({
            key: 1,
            status: 'rejected',
            reason: new Error('Task 2 Failed'),
            resultAggregator: [
              { key: 0, status: 'fulfilled', value: 'first' },
              {
                key: 1,
                status: 'rejected',
                reason: new Error('Task 2 Failed')
              },
              null // Task 3 never ran
            ]
          })

          // Ensure the next task was aborted
          expect(mockTask3).not.toHaveBeenCalled()
        })

        test('continues execution if abortOnFail is false and resolves with mixed results', async () => {
          const mockTask3 = vi.fn(() => delay(10, 'third'))

          const tasks = {
            task1: () => delay(10, 'first'),
            task2: () => delay(10, new Error('Task 2 Failed'), true), // Rejects
            task3: mockTask3 // Should run
          }

          const result = await runSequentialPromises(tasks, {
            abortOnFail: false
          })

          expect(result).toMatchObject({
            task1: { key: 'task1', status: 'fulfilled', value: 'first' },
            task2: {
              key: 'task2',
              status: 'rejected',
              reason: new Error('Task 2 Failed')
            },
            task3: { key: 'task3', status: 'fulfilled', value: 'third' }
          })

          expect(mockTask3).toHaveBeenCalled()
        })
      })

      describe('Concurrency Limits (threadsNumber)', () => {
        test('processes tasks concurrently when threadsNumber > 1', async () => {
          let runningTasks = 0
          let maxConcurrency = 0

          const trackConcurrency = async () => {
            runningTasks++
            maxConcurrency = Math.max(maxConcurrency, runningTasks)
            await delay(20, 'done')
            runningTasks--
          }

          const tasks = [
            trackConcurrency,
            trackConcurrency,
            trackConcurrency,
            trackConcurrency,
            trackConcurrency
          ]

          await runSequentialPromises(tasks, { threadsNumber: 3 })

          // If they ran sequentially, maxConcurrency would be 1.
          // If threading worked, it should hit exactly 3.
          expect(maxConcurrency).toBe(3)
        })

        test.each([
          Number.NaN,
          Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY,
          0,
          -1,
          1.5,
          '2'
        ])('falls back to one thread for %o', async threadsNumber => {
          let runningTasks = 0
          let maxConcurrency = 0

          const trackConcurrency = async () => {
            runningTasks++
            maxConcurrency = Math.max(maxConcurrency, runningTasks)
            await Promise.resolve()
            runningTasks--
          }

          const result = await runSequentialPromises(
            [trackConcurrency, trackConcurrency, trackConcurrency],
            { threadsNumber }
          )

          expect(result).toHaveLength(3)
          expect(maxConcurrency).toBe(1)
        })
      })

      describe('Edge Cases', () => {
        test('wraps synchronous functions safely without crashing', async () => {
          const tasks = [
            () => 'sync value 1',
            () => {
              throw new Error('sync error')
            },
            () => 'sync value 2'
          ]

          // Because of the Promise.resolve() wrap in the implementation,
          // this should cleanly reject rather than synchronously crashing Vitest
          await expect(runSequentialPromises(tasks)).rejects.toMatchObject({
            key: 1,
            status: 'rejected',
            reason: new Error('sync error')
          })
        })
      })
    })
  })
})
