import os from 'node:os'

const nodejsVersion = `Node.js ${process.versions.node} ${os.type()}`

/**
 * @typedef {import('node:http').IncomingMessage | import('node:http2').Http2ServerRequest} SsrRequest
 */

/**
 * @param {SsrRequest} req
 */
function getRequestProtocol(req) {
  const proto = req.headers['x-forwarded-proto']
  return proto
    ? proto.split(/\s*,\s*/)[0].toUpperCase()
    : req.socket.encrypted
      ? 'HTTPS'
      : 'HTTP'
}

/**
 * @param {SsrRequest} req
 */
function getRequestData(req) {
  const url = new URL(req.url, 'http://localhost')

  return {
    'Node.js': nodejsVersion,
    'Server protocol': `${getRequestProtocol(req)}/${req.httpVersion}`,
    'Remote address':
      (req.headers['x-forwarded-for'] || '').split(',')[0] ||
      req.socket.remoteAddress,
    'Remote port': req.socket.remotePort,
    'Request URI': req.url,
    'Request method': req.method,
    'Request pathname': url.pathname,
    'Request query string': url.search || ''
  }
}

/**
 * @param {SsrRequest} req
 */
function getHeadersData(req) {
  return Object.keys(req.headers).reduce((acc, name) => {
    acc[name] = req.headers[name]
    return acc
  }, Object.create(null))
}

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * @param {SsrRequest} req
 */
function getCookiesData(req) {
  const { cookie } = req.headers
  if (cookie === void 0) return {}

  return cookie.split(';').reduce((acc, entry) => {
    const parts = entry.split('=')
    const name = parts.shift().trim()

    if (name !== '') {
      acc[name] = decodeCookieValue(parts.join('=').trim())
    }

    return acc
  }, Object.create(null))
}

/**
 * @param {SsrRequest} req
 */
export function getEnv(req) {
  return {
    Request: getRequestData(req),
    Headers: getHeadersData(req),
    Cookies: getCookiesData(req)
  }
}
