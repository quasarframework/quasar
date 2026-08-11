function stringifyCookieValue(value) {
  return encodeURIComponent(
    value === Object(value) ? JSON.stringify(value) : String(value)
  )
}

function read(string) {
  if (string === '') {
    return string
  }

  if (string.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    string = string
      .slice(1, -1)
      .replaceAll(String.raw`\"`, '"')
      .replaceAll(String.raw`\\`, '\\')
  }

  // Replace server-side written pluses with spaces.
  // If we can't decode the cookie, ignore it, it's unusable.
  // If we can't parse the cookie, ignore it, it's unusable.
  try {
    string = decodeURIComponent(string.replaceAll('+', ' '))
  } catch {
    return
  }

  try {
    const parsed = JSON.parse(string)

    if (parsed === Object(parsed) || Array.isArray(parsed)) {
      string = parsed
    }
  } catch {}

  return string
}

const numberUnitRE = /(\d+)([dhms])/g
const numberUnitMultiplierMap = {
  d: 86_400,
  h: 3600,
  m: 60,
  s: 1
}

function parseExpireToSeconds(str) {
  let totalSeconds = 0
  let hasMatch = false

  // "1d", "15m"
  const matches = str.matchAll(numberUnitRE)

  for (const match of matches) {
    hasMatch = true
    const value = Number.parseInt(match[1], 10)
    const unit = match[2]

    totalSeconds += value * numberUnitMultiplierMap[unit]
  }

  if (hasMatch) return totalSeconds

  const timestamp = Date.parse(str)
  return Number.isNaN(timestamp)
    ? void 0
    : Math.round((timestamp - Date.now()) / 1000)
}

// oxlint-disable-next-line default-param-last
function set(key, val, opts = {}, ssr) {
  let maxAge
  let isDeletion = false

  if (opts.expires !== void 0) {
    // Number check (defined in days -> convert to seconds)
    if (Number.isFinite(opts.expires)) {
      maxAge = Math.round(opts.expires * 86_400) // 86400 seconds in a day
    } else if (opts.expires instanceof Date) {
      const timestamp = opts.expires.getTime()
      if (Number.isFinite(timestamp)) {
        maxAge = Math.round((timestamp - Date.now()) / 1000)
      }
    }
    // String check (eg. "15m", "1h", or a date string)
    else if (typeof opts.expires === 'string') {
      maxAge = parseExpireToSeconds(opts.expires)
    }

    if (maxAge !== void 0) isDeletion = maxAge <= 0
  }

  const keyValue = `${encodeURIComponent(key)}=${stringifyCookieValue(val)}`

  const cookie = [
    keyValue,
    maxAge !== void 0 ? `; Max-Age=${maxAge}` : '',
    opts.path ? `; Path=${opts.path}` : '',
    opts.domain ? `; Domain=${opts.domain}` : '',
    opts.sameSite ? `; SameSite=${opts.sameSite}` : '',
    opts.httpOnly ? '; HttpOnly' : '',
    opts.secure ? '; Secure' : '',
    opts.other ? `; ${opts.other}` : ''
  ].join('')

  if (ssr) {
    if (ssr.req.qCookies) {
      ssr.req.qCookies.push(cookie)
    } else {
      ssr.req.qCookies = [cookie]
    }

    ssr.res.setHeader('Set-Cookie', ssr.req.qCookies)

    let all = ssr.req.headers.cookie || ''

    if (maxAge !== void 0 && isDeletion) {
      const encodedKey = encodeURIComponent(key)
      all = all
        .split('; ')
        .filter(entry => entry.split('=', 1)[0] !== encodedKey)
        .join('; ')
    } else {
      all = all ? `${keyValue}; ${all}` : keyValue
    }

    ssr.req.headers.cookie = all
  } else {
    // oxlint-disable-next-line unicorn/no-document-cookie
    document.cookie = cookie
  }
}

function get(key, ssr) {
  const cookieSource = ssr ? ssr.req.headers : document,
    cookies = cookieSource.cookie ? cookieSource.cookie.split('; ') : [],
    l = cookies.length

  let result = key ? null : {},
    i = 0,
    parts,
    name,
    cookie

  for (; i < l; i++) {
    parts = cookies[i].split('=')

    try {
      name = decodeURIComponent(parts.shift())
    } catch {
      continue
    }

    cookie = parts.join('=')

    if (!key) {
      result[name] = cookie
    } else if (key === name) {
      result = read(cookie) ?? null
      break
    }
  }

  return result
}

function remove(key, options, ssr) {
  set(key, '', { expires: -1, ...options }, ssr)
}

function has(key, ssr) {
  return get(key, ssr) !== null
}

export function getObject(ssr) {
  return {
    get: key => get(key, ssr),
    set: (key, val, opts) => set(key, val, opts, ssr),
    has: key => has(key, ssr),
    remove: (key, options) => remove(key, options, ssr),
    getAll: () => get(null, ssr)
  }
}

const Plugin = {
  install({ $q, ssrContext }) {
    $q.cookies = __QUASAR_SSR_SERVER__ ? getObject(ssrContext) : this
  }
}

if (__QUASAR_SSR__) {
  Plugin.parseSSR = ssrContext => {
    if (ssrContext !== void 0) {
      return getObject(ssrContext)
    }
  }
}

if (!__QUASAR_SSR_SERVER__) {
  Object.assign(Plugin, getObject())
}

export default Plugin
