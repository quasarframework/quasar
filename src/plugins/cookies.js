import { isSSR } from './platform.js'

function encode (string) {
  return encodeURIComponent(string)
}

function decode (string) {
  return decodeURIComponent(string)
}

function stringifyCookieValue (value) {
  return encode(value === Object(value) ? JSON.stringify(value) : '' + value)
}

function read (string) {
  if (string === '') {
    return string
  }

  if (string.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    string = string.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  }

  // Replace server-side written pluses with spaces.
  // If we can't decode the cookie, ignore it, it's unusable.
  // If we can't parse the cookie, ignore it, it's unusable.
  string = decode(string.replace(/\+/g, ' '))

  try {
    string = JSON.parse(string)
  }
  catch (e) {}

  return string
}

function set (key, val, opts = {}, ssr) {
  let time = opts.expires
  const hasExpire = typeof opts.expires === 'number'

  if (hasExpire) {
    time = new Date()
    time.setMilliseconds(time.getMilliseconds() + opts.expires * 864e+5)
  }

  const keyValue = `${encode(key)}=${stringifyCookieValue(val)}`

  const cookie = [
    keyValue,
    time ? '; Expires=' + time.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    opts.path ? '; Path=' + opts.path : '',
    opts.domain ? '; Domain=' + opts.domain : '',
    opts.httpOnly ? '; HttpOnly' : '',
    opts.secure ? '; Secure' : ''
  ].join('')

  if (ssr) {
    ssr.res.setHeader('Set-Cookie', cookie)

    // make temporary update so future get()
    // within same SSR timeframe would return the set value

    let all = ssr.req.headers.cookie || ''

    if (hasExpire && opts.expires < 0) {
      const val = get(key, ssr)
      if (val !== undefined) {
        all = all
          .replace(`${key}=${val}; `, '')
          .replace(`; ${key}=${val}`, '')
          .replace(`${key}=${val}`, '')
      }
    }
    else {
      all = all
        ? `${keyValue}; ${all}`
        : cookie
    }

    ssr.req.headers.cookie = all
  }
  else {
    document.cookie = cookie
  }
}

function get (key, ssr) {
  let
    result = key ? undefined : {},
    cookieSource = ssr ? ssr.req.headers : document,
    cookies = cookieSource.cookie ? cookieSource.cookie.split('; ') : [],
    i = 0,
    l = cookies.length,
    parts,
    name,
    cookie

  for (; i < l; i++) {
    parts = cookies[i].split('=')
    name = decode(parts.shift())
    cookie = parts.join('=')

    if (!key) {
      result[name] = cookie
    }
    else if (key === name) {
      result = read(cookie)
      break
    }
  }

  return result
}

function remove (key, options, ssr) {
  set(
    key,
    '',
    Object.assign({}, options, { expires: -1 }),
    ssr
  )
}

function has (key, ssr) {
  return get(key, ssr) !== undefined
}

export function getObject (ctx = {}) {
  const ssr = ctx.ssr

  return {
    get: key => get(key, ssr),
    set: (key, val, opts) => set(key, val, opts, ssr),
    has: key => has(key, ssr),
    remove: (key, options) => remove(key, options, ssr),
    all: () => get(null, ssr)
  }
}

export default {
  install ({ $q, queues }) {
    if (isSSR) {
      queues.server.push((q, ctx) => {
        q.cookies = getObject(ctx)
      })
    }
    else {
      Object.assign(this, getObject())
      $q.cookies = this
    }
  }
}
