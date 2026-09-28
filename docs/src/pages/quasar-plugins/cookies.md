---
title: Cookies Plugin
desc: A Quasar plugin which manages browser cookies over the standardized 'document.cookie', making it easy to read and write cookies even with SSR apps.
keys: Cookies,useCookie
examples: Cookies
---

This is a wrapper over the standardized `document.cookie`. It reads and writes JSON objects as well as strings, manages the request cookies on the server side of SSR/SSG builds and binds a cookie to a Vue ref (v2.34+): `$q.cookies.useCookie('theme')` reads and writes the cookie and updates whenever it changes through the plugin, from anywhere in your app.

<DocApi file="Cookies" />

> [!WARNING]
> The Cookies plugin is not functional in Electron apps. Use the [Electron Cookies](https://www.electronjs.org/docs/api/cookies) API instead.

<DocInstall plugins="Cookies" />

## Notes on SSR/SSG

When building for SSR/SSG, use only the `$q.cookies` form. Alternatively, when on server-side, this is one more example of how you can use it:

```js
import { Cookies } from 'quasar'

// you need access to `ssrContext`
function (ssrContext) {
  const cookies = import.meta.env.QUASAR_SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies // otherwise we're on client

  // "cookies" is equivalent to the global import as in non-SSR/SSG builds
}
```

The `ssrContext` is available in [@quasar/app-vite Boot File](/quasar-cli-vite/boot-files). And also in the [@quasar/app-vite preFetch](/quasar-cli-vite/prefetch-feature) feature, where it is supplied as a parameter.

The reason for this is that in a client-only app, every user will be using a fresh instance of the app in their browser. For server-side rendering we want the same: each request should have a fresh, isolated app instance so that there is no cross-request state pollution. So Cookies needs to be bound to each request separately.

## Cookie refs (useCookie) <q-badge label="v2.34+" />

`useCookie(name, options)` returns a Vue ref bound to a cookie. Reading it gives you the cookie value (its default, or `null`, while the cookie is missing), assigning it stores the value right away and a nested change of an Object or Array value gets stored too. A template, a computed or a watcher reading it re-evaluates whenever the cookie changes through the plugin, from anywhere in your app. Where the browser has the [Cookie Store API](https://developer.mozilla.org/en-US/docs/Web/API/Cookie_Store_API), a cookie set by the server, by another tab or natively is followed as well.

```js
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  const theme = $q.cookies.useCookie('theme', {
    default: () => 'light',
    expires: '30d'
  })

  theme.value // 'light' while the cookie is missing, the stored value otherwise
  theme.value = 'dark' // stored for 30 days; every other ref of the cookie follows
  theme.value = null // removed, which reads as the default again

  return { theme }
}
```

The options, all optional:

```js
$q.cookies.useCookie('settings', {
  // returns the value the ref reads while the cookie is missing; called
  // each time the ref takes the default, so an Object or Array is a
  // fresh one every time; the value gets stored when the ref attaches
  // to a missing cookie and whenever the cookie is removed (default:
  // none, the ref then reads null)
  default: () => ({ notifications: true }),

  // hand out an Object or Array value reactive, so that a nested change
  // gets tracked and stored; false for a value that you only ever
  // assign as a whole (default: true)
  deep: true,

  // while true the ref is detached from the cookie, a plain in-memory
  // ref; once false again it attaches like a new ref (default: false)
  disabled: false,

  // the cookie options every write from the ref uses, as set() takes
  // them (see "Write a Cookie" below); a removal carries them all but
  // the expiry (default: none)
  expires: '30d',
  path: '/',
  domain: '.example.com',
  sameSite: 'Lax',
  secure: true
})
```

### Example

<DocExample title="Cookie ref" file="Basic" />

> [!TIP]
> **Outside of a component**
>
> `useCookie()` can also be called outside of `setup()`: in a boot file, a store or a plain module. A ref created inside a Vue effect scope (a component or a Pinia store) is released together with it; one created outside of any scope stays bound to the cookie for the rest of the page: call its `stop()` method when you are done with it.

### Defaults

A cookie with a default always holds a value. While a ref with a default is attached to it, removing the cookie (`remove()`, assigning `null`, another tab) stores the default again, so every reader agrees on what the cookie holds. A ref without a default reads `null` for a removed cookie. Two refs of the same cookie with different defaults disagree only while the cookie is missing, and the first one to attach settles it.

### Objects and Arrays

An Object or Array is stored as JSON, like `set()` does, and read back as a fresh copy: nested changes are tracked when made through the ref (`settings.value.notifications = false`), on plain Objects and Arrays only, and every one of them writes the whole value again. Mutating the original object you assigned persists nothing: assign through the ref instead. With `deep: false` the ref hands out the plain value and only an assignment stores. A Number or a Boolean assigned to the ref reads back as a String, as `get()` returns it.

Keep in mind that a cookie holds about 4KB, attributes included, and the encoding triples every brace, quote and colon. The browser drops a write it does not accept (too large, or with attributes it rejects) without a word; the ref then reads back what the cookie jar holds, `null` or the default.

### Typed cookies

A ref is typed as a String or an Object, or after what its default returns when one is given (a String default types it as a String). Declare your cookies once to have every `useCookie()` call checked against them, defaults and unions included:

```ts TypeScript
declare module 'quasar' {
  interface CookieValues {
    theme: 'light' | 'dark'
  }
}
```

### On the server

On the server side of SSR/SSG builds, `$q.cookies.useCookie()` reads the request cookie, so the ref renders the real value and the client matches it on hydration. Outside of a component there, use `Cookies.parseSSR(ssrContext).useCookie()`, as the [notes on SSR/SSG](#notes-on-ssr-ssg) explain for the other methods; the `Cookies` import itself has no methods on the server. A write there goes out as a `Set-Cookie` header, like `set()` does; a missing cookie's default is not stored by the server, the client stores it once it attaches. A cookie set with `httpOnly` is the one the server reads and the client cannot, so keep those out of rendered markup.

## Read a Cookie

```js Outside of a Vue file
import { Cookies } from 'quasar'
const value = Cookies.get('cookie_name')
```

When cookie is not set, the return value is `null`.

```js Inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()
  const value = $q.cookies.get('cookie_name')
}
```

## Read All Cookies

```js Outside of a Vue file
import { Cookies } from 'quasar'
const cookies = Cookies.getAll()
```

`cookies` variable will be an object with key-value pairs (cookie_name : cookie_value), each value decoded and parsed as `get()` returns it.

```js Inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()
  const allCookies = $q.cookies.getAll()
}
```

## Verify if Cookie is Set

```js Outside of a Vue file
import { Cookies } from 'quasar'
Cookies.has('cookie_name') // Boolean
```

```js Inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()
  const hasIt = $q.cookies.has('cookie_name')
}
```

## Write a Cookie

```js Outside of a Vue file
import { Cookies } from 'quasar'

Cookies.set('cookie_name', cookie_value)

// or pass in options also:
Cookies.set('cookie_name', cookie_value, options)
```

```js Outside of a Vue file
import { Cookies } from 'quasar'

Cookies.set('quasar', 'framework', {
  secure: true
})
```

```js Inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.cookies.set('cookie_name', cookie_value)
  // or pass in options also:
  $q.cookies.set('cookie_name', cookie_value, options)
}
```

The (optional) `options` parameter is an Object which is explained below, property by property.

### Option: expires

```js
expires: 10 // in 10 days
expires: -1 // yesterday
expires: 'Mon, 06 Jan 2020 12:52:55 GMT'
expires: new Date() // some JS Date Object
expires: '1d 3h 5m' // in 1 day, 3 hours, 5 minutes
expires: '2d' // in 2 days
expires: '15m 10s' // in 15 minutes, 10 seconds
```

Define lifetime of the cookie. Value can be a Number which will be interpreted as days from time of creation or a Date object or a raw stringified Date ("Mon, 06 Jan 2020 12:52:55 GMT") or a special string format ("1d", "15m", "13d", "1d 15m", "1d 3h 5m 3s"). If omitted, the cookie becomes a session cookie.

### Option: path

```js
path: '/'
```

Define the path where the cookie is valid. By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior). If you want to make it available for instance across the entire domain use path: '/'. Default: path of page where the cookie was created.

### Option: domain

```js
domain: 'quasar.dev'
```

Define the domain where the cookie is valid. Default: domain of page where the cookie was created.

### Option: sameSite

```js
sameSite: 'Strict'
// or
sameSite: 'Lax'
```

SameSite cookies let servers require that a cookie shouldn't be sent with cross-site (where Site is defined by the registrable domain) requests, which provides some protection against cross-site request forgery attacks (CSRF).

**Strict** - If a same-site cookie has this attribute, the browser will only send cookies if the request originated from the website that set the cookie. If the request originated from a different URL than the URL of the current location, none of the cookies tagged with the Strict attribute will be included.

**Lax** - If the attribute is set to Lax, same-site cookies are withheld on cross-site subrequests, such as calls to load images or frames, but will be sent when a user navigates to the URL from an external site, for example, by following a link.

For more information on the `same-site` setting, go [here](https://web.dev/samesite-cookies-explained/).

### Option: httpOnly

```js
httpOnly: true
```

To help mitigate cross-site scripting (XSS) attacks, HttpOnly cookies are inaccessible to JavaScript's Document.cookie API; they are only sent to the server. For example, cookies that persist server-side sessions don't need to be available to JavaScript, and the HttpOnly flag should be set.

### Option: secure

```js
secure: true
```

If true, the cookie transmission requires a secure protocol (HTTPS) and will NOT be sent over HTTP. Default value is `false`.

> [!TIP]
> If using Quasar CLI and on dev mode, you can enable HTTPS through quasar.config file > devServer > https: true.

### Option: other

```js
other: 'SomeNewProp'
```

Raw string for other cookie options. To be used as a last resort for possible newer props that are currently not yet implemented in Quasar.

## Remove a Cookie

```js Outside of a Vue file
import { Cookies } from 'quasar'

Cookies.remove('cookie_name')

// if cookie was set with specific options like path and/or domain
// then you need to also supply them when removing:
Cookies.remove('cookie_name', options)
```

```js Inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.cookies.remove('cookie_name')

  // if cookie was set with specific options like path and/or domain
  // then you need to also supply them when removing:
  $q.cookies.remove('cookie_name', options)
}
```

> [!WARNING]
> When a cookie was previously set with specific `path` and/or `domain` then it can be successfully removed only if the same attributes are passed in to remove() through the `options` parameter. This is in accordance to RFC6265. A cookie with a `__Secure-` or `__Host-` prefixed name needs `secure: true` as well, as the browser accepts no write of it without the attribute.
