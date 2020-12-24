/**
 * Based on the work of https://github.com/jchook/uuid-random
 */

let
  buf,
  bufIdx = 0
const hexBytes = new Array(256)

// Pre-calculate toString(16) for speed
for (let i = 0; i < 256; i++) {
  hexBytes[ i ] = (i + 0x100).toString(16).substr(1)
}

// Use best available PRNG
const randomBytes = (() => {
  // Node & Browser support
  const lib = typeof crypto !== 'undefined'
    ? crypto
    : (
        typeof window !== 'undefined'
          ? window.crypto || window.msCrypto
          : void 0
      )

  if (lib !== void 0) {
    if (lib.randomBytes !== void 0) {
      return lib.randomBytes
    }
    if (lib.getRandomValues !== void 0) {
      return n => {
        const bytes = new Uint8Array(n)
        lib.getRandomValues(bytes)
        return bytes
      }
    }
  }

  return n => {
    const r = []
    for (let i = n; i > 0; i--) {
      r.push(Math.floor(Math.random() * 256))
    }
    return r
  }
})()

// Buffer random numbers for speed
// Reduce memory usage by decreasing this number (min 16)
// or improve speed by increasing this number (try 16384)
const BUFFER_SIZE = 4096

export default function () {
  // Buffer some random bytes for speed
  if (buf === void 0 || (bufIdx + 16 > BUFFER_SIZE)) {
    bufIdx = 0
    buf = randomBytes(BUFFER_SIZE)
  }

  const b = Array.prototype.slice.call(buf, bufIdx, (bufIdx += 16))
  b[ 6 ] = (b[ 6 ] & 0x0f) | 0x40
  b[ 8 ] = (b[ 8 ] & 0x3f) | 0x80

  return hexBytes[ b[ 0 ] ] + hexBytes[ b[ 1 ] ]
    + hexBytes[ b[ 2 ] ] + hexBytes[ b[ 3 ] ] + '-'
    + hexBytes[ b[ 4 ] ] + hexBytes[ b[ 5 ] ] + '-'
    + hexBytes[ b[ 6 ] ] + hexBytes[ b[ 7 ] ] + '-'
    + hexBytes[ b[ 8 ] ] + hexBytes[ b[ 9 ] ] + '-'
    + hexBytes[ b[ 10 ] ] + hexBytes[ b[ 11 ] ]
    + hexBytes[ b[ 12 ] ] + hexBytes[ b[ 13 ] ]
    + hexBytes[ b[ 14 ] ] + hexBytes[ b[ 15 ] ]
}
