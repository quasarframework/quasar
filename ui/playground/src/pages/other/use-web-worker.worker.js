onmessage = ({ data }) => {
  if (data.buffer !== void 0) {
    postMessage({ receivedBytes: data.buffer.byteLength })
    return
  }

  const start = performance.now()
  const primes = []
  for (let n = 2; primes.length < data.count; n++) {
    if (primes.every(p => n % p !== 0)) primes.push(n)
  }

  postMessage({
    count: data.count,
    largest: primes.at(-1),
    ms: Math.round(performance.now() - start)
  })
}
