let
  buf,
  bufIdx = 0,
  hexBytes = []

// Pre-calculate toString(16) for speed
for (let i = 0; i < 256; i++) {
  hexBytes[i] = (i + 0x100).toString(16).substr(1)
}

// Buffer random numbers for speed
// Reduce memory usage by decreasing this number (min 16)
// or improve speed by increasing this number (try 16384)
const BUFFER_SIZE = 4096

// Node & Browser support
let crypt0
if (crypto !== void 0) {
  crypt0 = crypto
}
else if (module !== void 0 && typeof require === 'function') {
  crypt0 = require('crypto') // Node
} 
else if (window !== void 0 && window.msCrypto !== void 0) {
  crypt0 = window.msCrypto // IE11
}

// Use best available PRNG
// Also expose this so you can override it.
const randomBytes = (function () {
  if (crypt0 !== void 0) {
    if (crypt0.randomBytes !== void 0) {
      return crypt0.randomBytes
    }
    if (crypt0.getRandomValues !== void 0) {
      return function (n) {
        var bytes = new Uint8Array(n)
        crypt0.getRandomValues(bytes)
        return bytes
      }
    }
  }
  return function (n) {
    let i = 0, r = []
    for (; i < n; i++) {
      r.push(Math.floor(Math.random() * 256))
    }
    return r
  }
})()

// Buffer some random bytes for speed
function randomBytesBuffered (n) {
  if (buf === void 0 || ((bufIdx + n) > BUFFER_SIZE)) {
    bufIdx = 0
    buf = randomBytes(BUFFER_SIZE)
  }
  return buf.slice(bufIdx, (bufIdx += n))
}

// uuid.bin
function uuidBin () {
  const b = randomBytesBuffered(16)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  return b
}

// String UUIDv4 (Random)
export default function () {
  const b = uuidBin()
  return hexBytes[b[0]] + hexBytes[b[1]] +
        hexBytes[b[2]] + hexBytes[b[3]] + '-' +
        hexBytes[b[4]] + hexBytes[b[5]] + '-' +
        hexBytes[b[6]] + hexBytes[b[7]] + '-' +
        hexBytes[b[8]] + hexBytes[b[9]] + '-' +
        hexBytes[b[10]] + hexBytes[b[11]] +
        hexBytes[b[12]] + hexBytes[b[13]] +
        hexBytes[b[14]] + hexBytes[b[15]]
}
