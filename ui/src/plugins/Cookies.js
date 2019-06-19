import { isSSR } from './Platform.js'

function encode (string) {
  return encodeURIComponent(string)
}

function decode (string) {
  return decodeURIComponent(string)
}

function stringifyCookieValue (value) {
  return encode(value === Object(value) ? JSON.stringify(value) : '' + value)
}

function read (string, reviverFn) {
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
    string = JSON.parse(string, reviverFn)
  }
  catch (e) {}

  return string
}

function set (key, val, opts = {}, ssr) {
  let expire, expireValue

  if (opts.expires !== void 0) {
    expireValue = parseFloat(opts.expires)

    if (isNaN(expireValue)) {
      expire = opts.expires
    }
    else {
      expire = new Date()
      expire.setMilliseconds(expire.getMilliseconds() + expireValue * 864e+5)
      expire = expire.toUTCString()
    }
  }

  const keyValue = `${encode(key)}=${stringifyCookieValue(val)}`

  const cookie = [
    keyValue,
    expire !== void 0 ? '; Expires=' + expire : '', // use expires attribute, max-age is not supported by IE
    opts.path ? '; Path=' + opts.path : '',
    opts.domain ? '; Domain=' + opts.domain : '',
    opts.httpOnly ? '; HttpOnly' : '',
    opts.secure ? '; Secure' : ''
  ].join('')

  if (ssr) {
    if (ssr.req.qCookies) {
      ssr.req.qCookies.push(cookie)
    }
    else {
      ssr.req.qCookies = [ cookie ]
    }

    ssr.res.setHeader('Set-Cookie', ssr.req.qCookies)

    // make temporary update so future get()
    // within same SSR timeframe would return the set value

    let all = ssr.req.headers.cookie || ''

    if (expire !== void 0 && expireValue < 0) {
      const oldVal = get(key, ssr, void 0, true)
      if (oldVal !== undefined) {
        const replaceKeyValue = `${encode(key)}=${stringifyCookieValue(oldVal)}`
        all = all
          .replace(`${replaceKeyValue}; `, '')
          .replace(`; ${replaceKeyValue}`, '')
          .replace(`${replaceKeyValue}`, '')
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

function get (key, ssr, reviverFn, raw) {
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
      result[name] = read(cookie, reviverFn)
    }
    else if (key === name) {
      result = raw === true ? cookie : read(cookie, reviverFn)
      break
    }
  }

  return result
}

function remove (key, options, ssr) {
  set(
    key,
    '',
    { ...options, expires: -1 },
    ssr
  )
}

function has (key, ssr, reviverFn) {
  return get(key, ssr, reviverFn) !== undefined
}

export function getObject (ctx = {}) {
  const ssr = ctx.ssr

  return {
    get: (key, reviverFn) => get(key, ssr, reviverFn),
    set: (key, val, opts) => set(key, val, opts, ssr),
    has: (key, reviverFn) => has(key, ssr, reviverFn),
    remove: (key, options) => remove(key, options, ssr),
    getAll: reviverFn => get(null, ssr, reviverFn)
  }
}

export default {
  parseSSR (/* ssrContext */ ssr) {
    return ssr ? getObject({ ssr }) : this
  },

  install ({ $q, queues }) {
    if (isSSR === true) {
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
