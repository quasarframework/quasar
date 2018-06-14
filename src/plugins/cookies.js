import { isSSR } from './platform'

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

  if (typeof opts.expires === 'number') {
    time = new Date()
    time.setMilliseconds(time.getMilliseconds() + opts.expires * 864e+5)
  }

  const keyValue = `${encode(key)}=${stringifyCookieValue(val)}`

  const cookie = [
    keyValue,
    time ? '; expires=' + time.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    opts.path ? '; path=' + opts.path : '',
    opts.domain ? '; domain=' + opts.domain : '',
    opts.secure ? '; secure' : ''
  ].join('')

  if (ssr) {
    ssr.res.setHeader('Set-Cookie', cookie)

    // make temporary update so future get()
    // within same SSR timeframe would return the set value
    ssr.req.headers.cookie = ssr.req.headers.cookie
      ? `${keyValue}; ${ssr.req.headers.cookie}`
      : cookie
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

export function ssrGetCookies (ssr) {
  return {
    get: key => get(key, ssr),
    set: (key, val, opts) => set(key, val, opts, ssr),
    has: key => has(key, ssr),
    remove: (key, options) => remove(key, options, ssr),
    all: () => get(null, ssr)
  }
}

export default {
  get,
  set,
  has,
  remove,
  all: () => get(),

  install ({ $q }) {
    if (!isSSR) {
      $q.cookies = this
    }
  }
}
