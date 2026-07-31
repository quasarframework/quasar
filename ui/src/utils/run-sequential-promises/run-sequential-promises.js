function parsePromises(sequentialPromises) {
  if (Array.isArray(sequentialPromises)) {
    const totalJobs = sequentialPromises.length
    return {
      isList: true,
      totalJobs,
      // oxlint-disable-next-line unicorn/new-for-builtins
      resultAggregator: Array(totalJobs).fill(null)
    }
  }

  const resultKeys = Object.keys(sequentialPromises)
  const resultAggregator = resultKeys.reduce((acc, key) => {
    acc[key] = null
    return acc
  }, Object.create(null))

  return {
    isList: false,
    totalJobs: resultKeys.length,
    resultAggregator,
    resultKeys
  }
}

/**
 * Run a list of Promises sequentially, optionally on multiple threads.
 *
 * @param {*} sequentialPromises - Array of Functions or Object with Functions as values
 *                          Array of Function form: [ (resultAggregator: Array) => Promise<any>, ... ]
 *                          Object form: { [key: string]: (resultAggregator: object) => Promise<any>, ... }
 * @param {*} opts - Optional options Object
 *                   Object form: { threadsNumber?: number, abortOnFail?: boolean }
 *                   Default: { threadsNumber: 1, abortOnFail: true }
 *                   threadsNumber must be a positive integer; invalid values
 *                       fall back to 1
 *                   When configuring threadsNumber AND using http requests, be
 *                       aware of the maximum threads that the hosting browser
 *                       supports (usually 5); any number of threads above that
 *                       won't add any real benefits
 * @returns Promise<Array<Object> | Object>
 *    With opts.abortOnFail set to true (which is default):
 *        When sequentialPromises param is Array:
 *          The Promise resolves with an Array of Objects of the following form:
 *             [ { key: number, status: 'fulfilled', value: any }, ... ]
 *          The Promise rejects with an Object of the following form:
 *             { key: number, status: 'rejected', reason: Error, resultAggregator: array }
 *        When sequentialPromises param is Object:
 *          The Promise resolves with an Object of the following form:
 *             { [key: string]: { key: string, status: 'fulfilled', value: any }, ... }
 *          The Promise rejects with an Object of the following form:
 *             { key: string, status: 'rejected', reason: Error, resultAggregator: object }
 *    With opts.abortOnFail set to false:
 *       The Promise is never rejected (no catch() needed)
 *       The Promise resolves with:
 *          An Array of Objects (when sequentialPromises param is also an Array) of the following form:
 *             [ { key: number, status: 'fulfilled', value: any } | { status: 'rejected', reason: Error }, ... ]
 *          An Object (when sequentialPromises param is also an Object) of the following form:
 *             { [key: string]: { key: string, status: 'fulfilled', value: any } | { key: string, status: 'rejected', reason: Error }, ... }
 */
export default function runSequentialPromises(
  sequentialPromises,
  { threadsNumber = 1, abortOnFail = true } = {}
) {
  let jobIndex = -1,
    hasAborted = false

  const { isList, totalJobs, resultAggregator, resultKeys } =
    parsePromises(sequentialPromises)

  if (totalJobs === 0) return Promise.resolve(resultAggregator)

  const maxJobIndex = totalJobs - 1
  const runNextPromise = threadCtx => {
    if (hasAborted || jobIndex >= maxJobIndex) {
      return threadCtx.resolve()
    }

    const currentJobIndex = ++jobIndex
    const key = isList ? currentJobIndex : resultKeys[currentJobIndex]

    // Promise.resolve() protects against synchronous errors if the user
    // accidentally passes a normal function instead of an async one.
    Promise.resolve()
      .then(() => sequentialPromises[key](resultAggregator))
      .then(value => {
        if (!hasAborted) {
          resultAggregator[key] = { key, status: 'fulfilled', value }
        }
      })
      .catch(err => {
        if (hasAborted) return

        const result = { key, status: 'rejected', reason: err }
        resultAggregator[key] = result

        if (abortOnFail) {
          hasAborted = true
          threadCtx.reject({ ...result, resultAggregator })
        }
      })
      .finally(() => {
        if (!hasAborted) runNextPromise(threadCtx)
      })
  }

  const concurrencyLimit = Math.min(
    totalJobs,
    Number.isInteger(threadsNumber) && threadsNumber > 0 ? threadsNumber : 1
  )
  const threads = Array.from({ length: concurrencyLimit }, () => {
    const threadCtx = Promise.withResolvers()
    runNextPromise(threadCtx)
    return threadCtx.promise
  })

  return Promise.all(threads).then(() => resultAggregator)
}
