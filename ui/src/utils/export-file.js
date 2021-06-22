function clean (link) {
  // allow time for iOS
  setTimeout(() => {
    window.URL.revokeObjectURL(link.href)
  }, 10000)

  link.remove()
}

/**
 * Forces browser to download file with specified content
 *
 * @param {*} fileName - String
 * @param {*} rawData - String | ArrayBuffer | ArrayBufferView | Blob
 * @param {*} opts - String (mimeType) or Object
 *                   Object form: { mimeType?: String, byteOrderMark?: String | Uint8Array, encoding?: String }
 * @returns Boolean | Error
 *
 * mimeType       - Examples: 'application/octect-stream' (default), 'text/plain', 'application/json',
 *                  'text/plain;charset=UTF-8', 'video/mp4', 'image/png', 'application/pdf'
 *                  https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 *
 * byteOrderMark  - (BOM) Example: '\uFEFF'
 *                  https://en.wikipedia.org/wiki/Byte_order_mark
 *
 * encoding       - Performs a TextEncoder.encode() over the rawData;
 *                  Example: 'windows-1252' (ANSI, a subset of ISO-8859-1)
 *                  https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
 */
export default function (fileName, rawData, opts = {}) {
  const { mimeType, byteOrderMark, encoding } = typeof opts === 'string'
    ? { mimeType: opts }
    : opts

  const data = encoding !== void 0
    ? (new TextEncoder(encoding)).encode([ rawData ])
    : rawData

  const blobData = byteOrderMark !== void 0 ? [ byteOrderMark, data ] : [ data ]
  const blob = new Blob(blobData, { type: mimeType || 'application/octet-stream' })
  const link = document.createElement('a')

  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', fileName)

  // Check for "download" attribute support;
  // If not supported, open this in new window
  if (typeof link.download === 'undefined') {
    link.setAttribute('target', '_blank')
  }

  link.classList.add('hidden')
  link.style.position = 'fixed' // avoid scrolling to bottom
  document.body.appendChild(link)

  try {
    link.click()
    clean(link)
    return true
  }
  catch (err) {
    clean(link)
    return err
  }
}
