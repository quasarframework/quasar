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
    const parsed = JSON.parse(string)

    if (parsed === Object(parsed) || Array.isArray(parsed) === true) {
      string = parsed
    }
  }
  catch (e) {}

  return string
}

function getString (msOffset) {
  const time = new Date()
  time.setMilliseconds(time.getMilliseconds() + msOffset)
  return time.toUTCString()
}

function parseExpireString (str) {
  let timestamp = 0

  const days = str.match(/(\d+)d/)
  const hours = str.match(/(\d+)h/)
  const minutes = str.match(/(\d+)m/)
  const seconds = str.match(/(\d+)s/)

  if (days) { timestamp += days[ 1 ] * 864e+5 }
  if (hours) { timestamp += hours[ 1 ] * 36e+5 }
  if (minutes) { timestamp += minutes[ 1 ] * 6e+4 }
  if (seconds) { timestamp += seconds[ 1 ] * 1000 }

  return timestamp === 0
    ? str
    : getString(timestamp)
}

function set (key, val, opts = {}, ssr) {
  let expire, expireValue

  if (opts.expires !== void 0) {
    // if it's a Date Object
    if (Object.prototype.toString.call(opts.expires) === '[object Date]') {
      expire = opts.expires.toUTCString()
    }
    // if it's a String (eg. "15m", "1h", "13d", "1d 15m", "31s")
    // possible units: d (days), h (hours), m (minutes), s (seconds)
    else if (typeof opts.expires === 'string') {
      expire = parseExpireString(opts.expires)
    }
    // otherwise it must be a Number (defined in days)
    else {
      expireValue = parseFloat(opts.expires)
      expire = isNaN(expireValue) === false
        ? getString(expireValue * 864e+5)
        : opts.expires
    }
  }

  const keyValue = `${ encode(key) }=${ stringifyCookieValue(val) }`

  const cookie = [
    keyValue,
    expire !== void 0 ? '; Expires=' + expire : '', // use expires attribute, max-age is not supported by IE
    opts.path ? '; Path=' + opts.path : '',
    opts.domain ? '; Domain=' + opts.domain : '',
    opts.sameSite ? '; SameSite=' + opts.sameSite : '',
    opts.httpOnly ? '; HttpOnly' : '',
    opts.secure ? '; Secure' : '',
    opts.other ? '; ' + opts.other : ''
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
      const val = get(key, ssr)
      if (val !== undefined) {
        all = all
          .replace(`${ key }=${ val }; `, '')
          .replace(`; ${ key }=${ val }`, '')
          .replace(`${ key }=${ val }`, '')
      }
    }
    else {
      all = all
        ? `${ keyValue }; ${ all }`
        : cookie
    }

    ssr.req.headers.cookie = all
  }
  else {
    document.cookie = cookie
  }
}

function get (key, ssr) {
  const
    cookieSource = ssr ? ssr.req.headers : document,
    cookies = cookieSource.cookie ? cookieSource.cookie.split('; ') : [],
    l = cookies.length
  let
    result = key ? null : {},
    i = 0,
    parts,
    name,
    cookie

  for (; i < l; i++) {
    parts = cookies[ i ].split('=')
    name = decode(parts.shift())
    cookie = parts.join('=')

    if (!key) {
      result[ name ] = cookie
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
    { expires: -1, ...options },
    ssr
  )
}

function has (key, ssr) {
  return get(key, ssr) !== null
}

export function getObject (ssr) {
  return {
    get: key => get(key, ssr),
    set: (key, val, opts) => set(key, val, opts, ssr),
    has: key => has(key, ssr),
    remove: (key, options) => remove(key, options, ssr),
    getAll: () => get(null, ssr)
  }
}

const Plugin = {
  install ({ $q, ssrContext }) {
    $q.cookies = __QUASAR_SSR_SERVER__
      ? getObject(ssrContext)
      : this
  }
}

if (__QUASAR_SSR__) {
  Plugin.parseSSR = ssrContext => {
    if (ssrContext !== void 0) {
      return getObject(ssrContext)
    }
  }
}

if (__QUASAR_SSR_SERVER__ !== true) {
  Object.assign(Plugin, getObject())
}

export default Plugin
