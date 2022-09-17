
/**
 * Run a list of Promises sequentially, optionally on multiple threads.
 *
 * @param {*} promiseList - Array of Functions
 *                          Function form: () => Promise
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
 *         { promiseIndex: number, data: any }
 *      The Promise rejects with an Object of the following form:
 *         { promiseIndex: number, error: Error }
 *    With opts.abortOnFail set to false:
 *       The Promise resolves with an Array of Objects of the following form:
 *         { promiseIndex: number, data: any } | { promiseIndex: number, error: Error }
 *       The Promise is never rejected (no catch() needed)
 */
export default function runSequentialPromises (
  promiseList,
  { threadsNumber = 1, abortOnFail = true } = {}
) {
  let jobIndex = -1, hasAborted = false

  const totalJobs = promiseList.length
  const resultList = Array(totalJobs).fill()

  const getPromiseThread = () => new Promise((resolve, reject) => {
    function runNextPromise () {
      const currentJobIndex = ++jobIndex
      console.log('running', currentJobIndex)

      if (hasAborted === true || currentJobIndex >= totalJobs) {
        resolve()
        return
      }

      promiseList[ currentJobIndex ]()
        .catch(err => ({ promiseIndex: currentJobIndex, error: err }))
        .then(result => {
          if (hasAborted === true) {
            resolve()
            return // early exit
          }

          // if we have an error (caught earlier):
          if (result !== void 0 && result !== null && result.error !== void 0) {
            if (abortOnFail === true) {
              hasAborted = true
              reject(result)
              return // early exit
            }
            else {
              resultList[ currentJobIndex ] = result
            }
          }
          // yay, we have a success:
          else {
            resultList[ currentJobIndex ] = { promiseIndex: currentJobIndex, data: result }
          }

          console.log('running next')
          runNextPromise()
        })
    }

    runNextPromise()
  })

  const threads = Array(threadsNumber).fill(getPromiseThread())
  return Promise.all(threads).then(() => resultList)
}
