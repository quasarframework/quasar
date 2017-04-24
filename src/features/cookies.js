import extend from '../utils/extend'

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

function set (key, val, opts = {}) {
  let time = opts.expires

  if (typeof opts.expires === 'number') {
    time = new Date()
    time.setMilliseconds(time.getMilliseconds() + opts.expires * 864e+5)
  }

  document.cookie = [
    encode(key), '=', stringifyCookieValue(val),
    time ? '; expires=' + time.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    opts.path ? '; path=' + opts.path : '',
    opts.domain ? '; domain=' + opts.domain : '',
    opts.secure ? '; secure' : ''
  ].join('')
}

function get (key) {
  let
    result = key ? undefined : {},
    cookies = document.cookie ? document.cookie.split('; ') : [],
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

function remove (key, options) {
  set(key, '', extend(true, {}, options, {
    expires: -1
  }))
}

function has (key) {
  return get(key) !== undefined
}

export default {
  get,
  set,
  has,
  remove,
  all: () => get()
}
