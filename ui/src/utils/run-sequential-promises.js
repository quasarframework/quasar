
/**
 * Run a list of Promises sequentially, optionally on multiple threads.
 *
 * @param {*} promiseList - Array of Functions
 *                          Function form: (resultList: Array) => Promise<any>
 * @param {*} opts - Optional options Object
 *                   Object form: { threadsNumber?: number, abortOnFail?: boolean }
 *                   Default: { threadsNumber: 1, abortOnFail: true }
 *                   When configuring threadsNumber AND using http requests, be
 *                       aware of the maximum threads that the hosting browser
 *                       supports (usually 3); any number of threads above that
 *                       won't add any real benefits
 * @returns Promise<Array<Object>>
 *    With opts.abortOnFail set to true (which is default):
 *      The Promise resolves with an Array of Objects of the following form:
 *         { index: number, status: 'fulfilled', value: any }
 *      The Promise rejects with an Object of the following form:
 *         { index: number, status: 'rejected', reason: Error, resultList: Array }
 *    With opts.abortOnFail set to false:
 *       The Promise is never rejected (no catch() needed)
 *       The Promise resolves with an Array of Objects of the following form:
 *         { index: number, status: 'fulfilled', value: any } | { index: number, status: 'rejected', reason: Error }
 */
export default function runSequentialPromises (
  promiseList,
  { threadsNumber = 1, abortOnFail = true } = {}
) {
  let jobIndex = -1, hasAborted = false

  const totalJobs = promiseList.length
  const resultList = Array(totalJobs).fill(null)

  const getPromiseThread = () => new Promise((resolve, reject) => {
    function runNextPromise () {
      const currentJobIndex = ++jobIndex

      if (hasAborted === true || currentJobIndex >= totalJobs) {
        resolve()
        return
      }

      promiseList[ currentJobIndex ]([ ...resultList ])
        .then(value => {
          if (hasAborted === true) {
            resolve()
            return // early exit
          }

          resultList[ currentJobIndex ] = { index: currentJobIndex, status: 'fulfilled', value }

          // timeout so it doesn't interfere with the .catch() below
          setTimeout(runNextPromise)
        })
        .catch(reason => {
          if (hasAborted === true) {
            resolve()
            return // early exit
          }

          const result = { index: currentJobIndex, status: 'rejected', reason }
          resultList[ currentJobIndex ] = result

          if (abortOnFail === true) {
            hasAborted = true
            reject({ ...result, resultList: [ ...resultList ] })
            return // early exit
          }

          // timeout so no interference
          setTimeout(runNextPromise)
        })
    }

    runNextPromise()
  })

  const threads = Array(threadsNumber).fill(getPromiseThread())
  return Promise.all(threads).then(() => resultList)
}
