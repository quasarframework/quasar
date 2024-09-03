function parsePromises (sequentialPromises) {
  const isList = Array.isArray(sequentialPromises)

  if (isList === true) {
    const totalJobs = sequentialPromises.length
    return {
      isList,
      totalJobs,
      resultAggregator: Array(totalJobs).fill(null)
    }
  }

  const resultKeys = Object.keys(sequentialPromises)
  const resultAggregator = {}
  resultKeys.forEach(keyName => { resultAggregator[ keyName ] = null })

  return {
    isList,
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
export default function runSequentialPromises (
  sequentialPromises,
  { threadsNumber = 1, abortOnFail = true } = {}
) {
  let jobIndex = -1, hasAborted = false

  const { isList, totalJobs, resultAggregator, resultKeys } = parsePromises(sequentialPromises)

  const getPromiseThread = () => new Promise((resolve, reject) => {
    function runNextPromise () {
      const currentJobIndex = ++jobIndex

      if (hasAborted === true || currentJobIndex >= totalJobs) {
        resolve()
        return
      }

      const key = isList === true ? currentJobIndex : resultKeys[ currentJobIndex ]

      sequentialPromises[ key ](resultAggregator)
        .then(value => {
          if (hasAborted === true) {
            resolve()
            return // early exit
          }

          resultAggregator[ key ] = { key, status: 'fulfilled', value }

          // timeout so it doesn't interfere with the .catch() below
          setTimeout(runNextPromise)
        })
        .catch(reason => {
          if (hasAborted === true) {
            resolve()
            return // early exit
          }

          const result = { key, status: 'rejected', reason }
          resultAggregator[ key ] = result

          if (abortOnFail === true) {
            hasAborted = true
            reject({ ...result, resultAggregator })
            return // early exit
          }

          // timeout so no interference
          setTimeout(runNextPromise)
        })
    }

    runNextPromise()
  })

  const threads = Array(threadsNumber).fill(getPromiseThread())
  return Promise.all(threads).then(() => resultAggregator)
}
