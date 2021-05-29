---
title: Cookies
desc: A Quasar plugin which manages browser cookies over the standardized 'document.cookie', making it easy to read and write cookies even with SSR apps.
---
This is a wrapper over the standardized `document.cookie`.

> **NOTE**
>
> In addition to the standard way of dealing with cookies, with Cookie Plugin you can read and write cookies using JSON objects. It can also manage cookies from SSR.

::: tip
With Electron version >= v1.12.2 the Cookie Plugin isn't functional in the Electron Enviroment. You may want to look up the [Electron Cookies](https://www.electronjs.org/docs/api/cookies) documentation.
:::

## Cookies API
<doc-api file="Cookies" />

## Installation
<doc-installation plugins="Cookies" />

## Notes on SSR
When building for SSR, use only the `$q.cookies` form. If you need to use the `import { Cookies } from 'quasar'`, then you'll need to do it like this:

```js
import { Cookies } from 'quasar'

// you need access to `ssrContext`
function (ssrContext) {
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies // otherwise we're on client

  // "cookies" is equivalent to the global import as in non-SSR builds
}
```

The `ssrContext` is available in [boot files](/quasar-cli/boot-files) or [preFetch feature](/quasar-cli/prefetch-feature) where it is supplied as parameter.

The reason for this is that in a client-only app, every user will be using a fresh instance of the app in their browser. For server-side rendering we want the same: each request should have a fresh, isolated app instance so that there is no cross-request state pollution. So Cookies needs to be bound to each request separately.


## Read a Cookie

``` js
// outside of a Vue file
import { Cookies } from 'quasar'

var value = Cookies.get('cookie_name')
```

When cookie is not set, the return value is `null`.

```js
// inside of a Vue file
this.$q.cookies.get('cookie_name')
```

## Read All Cookies

``` js
// outside of a Vue file
import { Cookies } from 'quasar'

const cookies = Cookies.getAll()
```

`cookies` variable will be an object with key-value pairs (cookie_name : cookie_value).

```js
// inside of a Vue file
this.$q.cookies.getAll()
```

## Verify if Cookie is Set

``` js
// outside of a Vue file
import { Cookies } from 'quasar'

(Boolean) Cookies.has('cookie_name')
```

```js
// inside of a Vue file
this.$q.cookies.has('cookie_name')
```

## Write a Cookie

``` js
// outside of a Vue file
import { Cookies } from 'quasar'

Cookies.set('cookie_name', cookie_value)

// or pass in options also:
Cookies.set('cookie_name', cookie_value, options)
```

``` js
// outside of a Vue file
import { Cookies } from 'quasar'

Cookies.set('quasar', 'framework', {
  secure: true
})
```

```js
// inside of a Vue file

this.$q.cookies.set('cookie_name', cookie_value)

// or pass in options also:
this.$q.cookies.set('cookie_name', cookie_value, options)
```

The (optional) `options` parameter is an Object which is explained below, property by property.

### Option: expires

``` js
expires: 10 // in 10 days
expires: -1 // yesterday
expires: 'Mon, 06 Jan 2020 12:52:55 GMT'
expires: new Date() // some JS Date Object

// Following formats require Quasar v1.7+:

expires: '1d 3h 5m' // in 1 day, 3 hours, 5 minutes
expires: '2d' // in 2 days
expires: '15m 10s' // in 15 minutes, 10 seconds
```

Define lifetime of the cookie. Value can be a Number which will be interpreted as days from time of creation or a Date object or a raw stringified Date ("Mon, 06 Jan 2020 12:52:55 GMT") or a special string format ("1d", "15m", "13d", "1d 15m", "1d 3h 5m 3s"). If omitted, the cookie becomes a session cookie.

### Option: path

``` js
path: '/'
```

Define the path where the cookie is valid. By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior). If you want to make it available for instance across the entire domain use path: '/'. Default: path of page where the cookie was created.

### Option: domain

``` js
domain: 'quasar.dev'
```

Define the domain where the cookie is valid. Default: domain of page where the cookie was created.

### Option: sameSite

``` js
sameSite: 'Strict'
// or
sameSite: 'Lax'
```

SameSite cookies let servers require that a cookie shouldn't be sent with cross-site (where Site is defined by the registrable domain) requests, which provides some protection against cross-site request forgery attacks (CSRF).

**Strict** - If a same-site cookie has this attribute, the browser will only send cookies if the request originated from the website that set the cookie. If the request originated from a different URL than the URL of the current location, none of the cookies tagged with the Strict attribute will be included.

**Lax** - If the attribute is set to Lax, same-site cookies are withheld on cross-site subrequests, such as calls to load images or frames, but will be sent when a user navigates to the URL from an external site, for example, by following a link.

For more information on the `same-site` setting, go [here](https://web.dev/samesite-cookies-explained/).

### Option: httpOnly

``` js
httpOnly: true
```

To help mitigate cross-site scripting (XSS) attacks, HttpOnly cookies are inaccessible to JavaScript's Document.cookie API; they are only sent to the server. For example, cookies that persist server-side sessions don't need to be available to JavaScript, and the HttpOnly flag should be set.

### Option: secure

``` js
secure: true
```

If true, the cookie transmission requires a secure protocol (HTTPS) and will NOT be sent over HTTP. Default value is `false`.

::: tip
If using Quasar CLI and [on dev mode](/quasar-cli/quasar-conf-js#property-devserver), you can enable HTTPS through quasar.conf.js > devServer > https: true.
:::

### Option: other

``` js
other: 'SomeNewProp'
```

Raw string for other cookie options. To be used as a last resort for possible newer props that are currently not yet implemented in Quasar.

## Remove a Cookie
``` js
// outside of a Vue file
import { Cookies } from 'quasar'

Cookies.remove('cookie_name')

// if cookie was set with specific options like path and/or domain
// then you need to also supply them when removing:
Cookies.remove('cookie_name', options)
```

```js
// inside of a Vue file
this.$q.cookies.remove('cookie_name')

// if cookie was set with specific options like path and/or domain
// then you need to also supply them when removing:
this.$q.cookies.remove('cookie_name', options)
```

::: warning
When a cookie was previously set with specific `path` and/or `domain` then it can be successfully removed only if the same attributes are passed in to remove() through the `options` parameter. This is in accordance to RFC6265.
:::
