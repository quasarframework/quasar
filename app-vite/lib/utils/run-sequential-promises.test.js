import { describe, expect, test } from 'vitest'

import { runSequentialPromises } from './run-sequential-promises.js'

describe('[run-sequential-promises.js]', () => {
  test('runs an array of jobs and aggregates the results in order', async () => {
    const order = []
    const result = await runSequentialPromises([
      () => {
        order.push('one')
        return Promise.resolve(1)
      },
      () => {
        order.push('two')
        return Promise.resolve(2)
      }
    ])

    expect(order).toEqual(['one', 'two'])
    expect(result).toEqual([
      { key: 0, status: 'fulfilled', value: 1 },
      { key: 1, status: 'fulfilled', value: 2 }
    ])
  })

  test('runs an object of jobs keyed by name', async () => {
    const result = await runSequentialPromises({
      alpha: () => Promise.resolve('a'),
      beta: () => Promise.resolve('b')
    })

    expect(result.alpha).toEqual({
      key: 'alpha',
      status: 'fulfilled',
      value: 'a'
    })
    expect(result.beta).toEqual({
      key: 'beta',
      status: 'fulfilled',
      value: 'b'
    })
  })

  test('exposes earlier results to later jobs', async () => {
    const result = await runSequentialPromises([
      () => Promise.resolve('first'),
      aggregator => Promise.resolve(`saw ${aggregator[0].value}`)
    ])

    expect(result[1].value).toBe('saw first')
  })

  test('rejects with the failure and partial results by default', async () => {
    await expect(
      runSequentialPromises([
        () => Promise.resolve('ok'),
        () => Promise.reject(new Error('boom'))
      ])
    ).rejects.toMatchObject({
      key: 1,
      status: 'rejected',
      reason: new Error('boom')
    })
  })

  test('collects failures without rejecting when abortOnFail is false', async () => {
    const result = await runSequentialPromises(
      [
        () => Promise.reject(new Error('boom')),
        () => Promise.resolve('still ran')
      ],
      { abortOnFail: false }
    )

    expect(result[0].status).toBe('rejected')
    expect(result[1]).toEqual({
      key: 1,
      status: 'fulfilled',
      value: 'still ran'
    })
  })

  test('protects against synchronously throwing jobs', async () => {
    await expect(
      runSequentialPromises([
        () => {
          throw new Error('sync boom')
        }
      ])
    ).rejects.toMatchObject({ key: 0, status: 'rejected' })
  })

  test('limits concurrency to threadsNumber', async () => {
    let active = 0
    let maxActive = 0

    const job = () => async () => {
      active++
      maxActive = Math.max(maxActive, active)
      await new Promise(resolve => {
        setTimeout(resolve, 5)
      })
      active--
    }

    await runSequentialPromises(Array.from({ length: 6 }, job), {
      threadsNumber: 2
    })

    expect(maxActive).toBe(2)
  })

  test('resolves immediately without jobs', async () => {
    expect(await runSequentialPromises([])).toEqual([])
    expect(await runSequentialPromises({})).toEqual({})
  })
})
