export function timeToPass (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
