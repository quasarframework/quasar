const nonceRE = /^[A-Za-z0-9+/_-]+={0,2}$/
const htmlCharsRE = /[&<>"']/g
const encodeHtmlChars = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

export function injectNonceAttr(ssrContext) {
  const { nonce } = ssrContext
  if (!nonce) {
    ssrContext.__quasarNonceAttr = ''
    return
  }

  if (typeof nonce !== 'string' || !nonceRE.test(nonce)) {
    throw new TypeError(
      'Invalid SSR nonce. Expected a non-empty base64 or base64url value.'
    )
  }

  const value = nonce.replaceAll(htmlCharsRE, char => encodeHtmlChars[char])
  ssrContext.__quasarNonceAttr = ` nonce="${value}"`
}
