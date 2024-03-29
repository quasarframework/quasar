import is from '../src/utils/is.js'

export function timeToPass (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export { is }
