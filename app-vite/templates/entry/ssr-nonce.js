const nonceRE = /^[A-Za-z0-9+/_-]+={0,2}$/

const encodeHtmlChars = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

export function encodeHtmlAttribute(value) {
  return String(value).replaceAll(/[&<>"']/g, char => encodeHtmlChars[char])
}

export function getNonceAttr(ssrContext) {
  const { nonce } = ssrContext

  if (nonce === void 0) return ''

  if (typeof nonce !== 'string' || nonceRE.test(nonce) === false) {
    throw new TypeError(
      'Invalid SSR nonce. Expected a non-empty base64 or base64url value.'
    )
  }

  return ` nonce="${encodeHtmlAttribute(nonce)}"`
}
