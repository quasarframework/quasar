import {
  customRef,
  effectScope,
  getCurrentScope,
  onScopeDispose,
  reactive,
  toValue,
  watch
} from 'vue'

import { isObject } from '../../utils/is/is.js'

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

    // the request now carries the new value (one entry per cookie)
    const encodedKey = encodeURIComponent(key)
    const others = ssr.req.headers.cookie
      ? ssr.req.headers.cookie
          .split('; ')
          .filter(entry => entry.split('=', 1)[0] !== encodedKey)
      : []

    ssr.req.headers.cookie = (isDeletion ? others : [keyValue, ...others]).join(
      '; '
    )
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
      // a __proto__ cookie holding an object would retarget the result's
      // prototype instead of adding a key to it; extend() skips it too
      if (name !== '__proto__' && !Object.hasOwn(result, name)) {
        const value = read(cookie)
        if (value !== void 0) {
          result[name] = value
        }
      }
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

function noDefault() {
  return null
}

function getCookieRefOptions(options) {
  const {
    // a function, called each time the ref takes the default: an Object
    // or Array default is a fresh one every time
    default: getDefault = noDefault,
    deep = true,
    disabled,
    ...cookieOpts
  } = options ?? {}

  return { getDefault, deep, disabled, cookieOpts }
}

export function getObject(ssr) {
  // name -> the receivers of the cookie refs attached to that cookie;
  // each one is told about every change made through this object,
  // another ref of the cookie or (when the browser reports them) the
  // server and the other documents of the origin
  const attached = new Map()

  // a null value means the cookie is gone
  function notify(name, value, except) {
    attached.get(name)?.forEach(receive => {
      if (receive !== except) {
        receive(value)
      }
    })
  }

  // the cookie jar changed: another document, a response header, a
  // native write... (Cookie Store API; without it, only the writes
  // made through this object reach the refs). The event also echoes
  // the writes made through this object, later and possibly stale, so
  // the jar is re-read instead of trusting the payload; the event
  // carries the name as stored (encoded)
  function onChange(evt) {
    const names = new Set()

    for (const cookie of [...evt.changed, ...evt.deleted]) {
      try {
        names.add(decodeURIComponent(cookie.name))
      } catch {}
    }

    names.forEach(name => {
      if (attached.has(name)) {
        notify(name, get(name))
      }
    })
  }

  function attach(name, receive) {
    let receivers = attached.get(name)

    if (receivers === void 0) {
      if (attached.size === 0 && ssr === void 0) {
        window.cookieStore?.addEventListener('change', onChange)
      }

      receivers = new Set()
      attached.set(name, receivers)
    }

    receivers.add(receive)
  }

  function detach(name, receive) {
    const receivers = attached.get(name)

    if (receivers?.delete(receive) && receivers.size === 0) {
      attached.delete(name)

      if (attached.size === 0 && ssr === void 0) {
        window.cookieStore?.removeEventListener('change', onChange)
      }
    }
  }

  function useCookie(name, options) {
    const { getDefault, deep, disabled, cookieOpts } =
      getCookieRefOptions(options)
    // a removal must carry the same path/domain, never the expiry
    const { expires: _, ...removeOpts } = cookieOpts

    // the value as the plugin reads it (a Number comes back as a
    // String); a plain object or Array is handed out reactive by the
    // getter, so that a nested change gets tracked and persisted
    let value = getDefault(),
      // the encoded form of what the cookie jar last agreed on, so that
      // a change made through the ref (to persist) can be told from one
      // it merely got told about
      synced = null,
      isAttached = false,
      trigger

    const cookieRef = customRef((track, triggerRef) => {
      trigger = triggerRef

      return {
        get() {
          track()
          return deep && (isObject(value) || Array.isArray(value))
            ? reactive(value)
            : value
        },

        set(newValue) {
          assign(
            newValue === null || newValue === void 0 ? getDefault() : newValue
          )
          persist()
        }
      }
    })

    function assign(newValue) {
      value = newValue
      trigger()
    }

    function persist() {
      if (!isAttached) return

      const encoded = value === null ? null : stringifyCookieValue(value)
      if (encoded === synced) return

      if (encoded === null) {
        remove(name, removeOpts, ssr)
        synced = null
      } else {
        set(name, value, cookieOpts, ssr)
        // what reads back is what the ref holds (the browser drops a
        // write it does not accept without a word)
        const stored = get(name, ssr)
        synced = stored === null ? null : stringifyCookieValue(stored)
        assign(stored)
      }

      notify(name, value, receive)
    }

    // the cookie changed on the jar side (set(), remove(), another ref
    // of the cookie, another document); a removed cookie goes back to
    // the default, which gets stored again
    function receive(newValue) {
      if (newValue === null) {
        // another ref of the cookie, told first, may have stored its
        // default meanwhile: the first one to attach settles it
        newValue = get(name, ssr)
      }

      const encoded = newValue === null ? null : stringifyCookieValue(newValue)
      if (encoded === synced) return

      synced = encoded
      assign(newValue === null ? getDefault() : newValue)
      persist()
    }

    function seed() {
      const stored = get(name, ssr)

      if (stored === null) {
        // whatever was agreed on before detaching is gone
        synced = null
      } else {
        synced = stringifyCookieValue(stored)
        assign(stored)
      }

      // a missing cookie gets the current value (the default, or what
      // the ref was set to meanwhile); the server leaves it to the
      // client, which attaches to the same missing cookie
      if (ssr === void 0) {
        persist()
      }
    }

    const scope = effectScope(true)

    scope.run(() => {
      // attached: the ref follows the cookie and persists into it;
      // detached: a plain in-memory ref. A disabled ref stays detached
      // and attaches like a new one once enabled
      watch(
        () => toValue(disabled) !== true,
        on => {
          if (on) {
            isAttached = true
            attach(name, receive)
            seed()
          } else if (isAttached) {
            isAttached = false
            detach(name, receive)
          }
        },
        { immediate: true }
      )

      // the server renders once: no nested change to persist there
      if (deep && ssr === void 0) {
        watch(cookieRef, persist, { deep: true })
      }
    })

    cookieRef.stop = () => {
      scope.stop()

      if (isAttached) {
        isAttached = false
        detach(name, receive)
      }
    }

    // released with the calling scope (a component, a Pinia store, an
    // effectScope()); outside of one, stop() is the caller's job
    if (getCurrentScope() !== void 0) {
      onScopeDispose(cookieRef.stop)
    }

    return cookieRef
  }

  return {
    get: key => get(key, ssr),
    set: (key, val, opts) => {
      set(key, val, opts, ssr)
      notify(key, get(key, ssr))
    },
    has: key => has(key, ssr),
    remove: (key, options) => {
      remove(key, options, ssr)
      notify(key, null)
    },
    getAll: () => get(null, ssr),
    useCookie
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
