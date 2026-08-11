function createUidFn() {
  if (typeof crypto === 'undefined') {
    return () => {
      throw new Error(
        '[Quasar uid()] Secure RNG not available. Cannot generate collision-resistant UUID.'
      )
    }
  }

  // Fast Path: Native C++/Rust implementation (Node.js & HTTPS Browsers)
  if (crypto.randomUUID) return () => crypto.randomUUID()

  // Pre-compute hex map for the HTTP fallback
  const hex = Array.from({ length: 256 }, (_, i) =>
    (i + 0x1_00).toString(16).slice(1)
  )
  let buf, bufIdx

  return () => {
    if (buf === void 0 || bufIdx + 16 > 4096) {
      bufIdx = 0
      buf = new Uint8Array(4096)
      crypto.getRandomValues(buf)
    }

    const i = bufIdx
    bufIdx += 16

    // Set UUIDv4 version (4) and variant (8, 9, a, or b)
    buf[i + 6] = (buf[i + 6] & 0x0f) | 0x40
    buf[i + 8] = (buf[i + 8] & 0x3f) | 0x80

    return (
      hex[buf[i]] +
      hex[buf[i + 1]] +
      hex[buf[i + 2]] +
      hex[buf[i + 3]] +
      '-' +
      hex[buf[i + 4]] +
      hex[buf[i + 5]] +
      '-' +
      hex[buf[i + 6]] +
      hex[buf[i + 7]] +
      '-' +
      hex[buf[i + 8]] +
      hex[buf[i + 9]] +
      '-' +
      hex[buf[i + 10]] +
      hex[buf[i + 11]] +
      hex[buf[i + 12]] +
      hex[buf[i + 13]] +
      hex[buf[i + 14]] +
      hex[buf[i + 15]]
    )
  }
}

export default /*#__PURE__*/ createUidFn()
