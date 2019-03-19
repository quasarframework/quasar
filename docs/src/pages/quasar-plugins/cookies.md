---
title: Cookies
---
This is a wrapper over the standardized `document.cookie`.

> **NOTE**
>
> In addition to the standard way of dealing with cookies, with Cookie Plugin you can read and write cookies using JSON objects.

## Installation
<doc-installation plugins="Cookies" />

### Note about SSR
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

The `ssrContext` is available in App Plugins or preFetch feature where it is supplied as parameter.

The reason for this is that in a client-only app, every user will be using a fresh instance of the app in their browser. For server-side rendering we want the same: each request should have a fresh, isolated app instance so that there is no cross-request state pollution. So Cookies needs to be bound to each request separately.

## Read a Cookie
``` js
// outside of a Vue file
import { Cookies } from 'quasar'

var value = Cookies.get('cookie_name')
```
When cookie is not set, the return value is `undefined`.

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

Cookies.set('cookie_name', cookie_value, options)
```

`options` is an Object which can have the following properties: `expires`, `path`, `domain`, `secure`. They are explained below.

``` js
// outside of a Vue file
import { Cookies } from 'quasar'

Cookies.set('quasar', 'framework', {
  secure: true
})
```

```js
// inside of a Vue file
this.$q.cookies.set('cookie_name', cookie_value, options)
```

### Option: expires
``` js
expires: 10
```
Define lifetime of the cookie. Value can be a Number which will be interpreted as days from time of creation or a Date object. If omitted, the cookie becomes a session cookie.

### Option: path
``` js
path: '/'
```
Define the path where the cookie is valid. By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior). If you want to make it available for instance across the entire domain use path: '/'. Default: path of page where the cookie was created.

### Option: domain
``` js
domain: 'quasar-framework.org'
```
Define the domain where the cookie is valid. Default: domain of page where the cookie was created.

### Option: secure
``` js
secure: true
```
If true, the cookie transmission requires a secure protocol (HTTPS) and will NOT be sent over HTTP. Default value is `false`.

## Remove a Cookie
``` js
// outside of a Vue file
import { Cookies } from 'quasar'

Cookies.remove('cookie_name')
```

```js
// inside of a Vue file
this.$q.cookies.remove('cookie_name')
```

## Cookies API
<doc-api file="Cookies" />
