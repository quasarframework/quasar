
import os from 'node:os'

const nodejsVersion = `Node.js ${ process.versions.node } ${ os.type() }`

function getRequestProtocol (req) {
  const proto = req.headers[ 'X-Forwarded-Proto' ]
  return proto
    ? proto.split(/\s*,\s*/)[ 0 ].toUpperCase()
    : (req.connection.encrypted ? 'HTTPS' : 'HTTP')
}

function getRequestData (req) {
  const url = new URL(req.url, 'http://localhost')

  return {
    'Node.js': nodejsVersion,
    'Server protocol': `${ getRequestProtocol(req) }/${ req.httpVersion }`,
    'Remote address': (req.headers[ 'x-forwarded-for' ] || '').split(',')[ 0 ] || req.connection.remoteAddress,
    'Remote port': req.connection.remotePort,
    'Request URI': req.url,
    'Request method': req.method,
    'Request pathname': url.pathname,
    'Request query string': url.search || ''
  }
}

function getHeadersData (req) {
  return Object.keys(req.headers).reduce((acc, name) => {
    acc[ name ] = req.headers[ name ]
    return acc
  }, {})
}

function getCookiesData (req) {
  const { cookie } = req.headers
  if (cookie === void 0) return {}
  return cookie.split('; ').reduce((acc, entry) => {
    const parts = entry.split('=')
    acc[ parts.shift().trim() ] = decodeURIComponent(parts.join('='))
    return acc
  }, {})
}

function getEnvironmentVariablesData () {
  return Object.keys(process.env).reduce((acc, name) => {
    acc[ name ] = process.env[ name ]
    return acc
  }, {})
}

export function getEnv (req) {
  return {
    Request: getRequestData(req),
    Headers: getHeadersData(req),
    Cookies: getCookiesData(req),
    'Shell environment variables': getEnvironmentVariablesData()
  }
}
