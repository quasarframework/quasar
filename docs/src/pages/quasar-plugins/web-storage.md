---
title: Local/Session Storage Plugins
desc: A Quasar plugin that wraps the Local/Session Storage, retrieving data with its original JS type.
keys: LocalStorage,SessionStorage
---

Quasar provides a wrapper over [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).

::: tip
Web Storage API only retrieves strings. **Quasar retrieves data with its original data type.** You tell it to store a Number then to retrieve it and it will still be a Number, not a string representation of the number as with Web Storage API. Same for JSON, Regular Expressions, Dates, Booleans and so on.
:::

::: danger Note about SSR
When running the code server-side on SSR builds, this feature can't work. Web Storage is a browser API only. You can however make use of it on the client-side with SSR.
:::

<doc-api file="LocalStorage" />

<doc-api file="SessionStorage" />

<doc-installation :plugins="['LocalStorage', 'SessionStorage']" />

## Usage

```js
// outside of a Vue file
import { LocalStorage, SessionStorage } from 'quasar'

LocalStorage.set(key, value)
let value = LocalStorage.getItem(key)

SessionStorage.set(key, value)
let value = SessionStorage.getItem(key)
```

```js
// inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.localStorage.set(key, value)
  const value = $q.localStorage.getItem(key)

  $q.sessionStorage.set(key, value)
  const otherValue = $q.sessionStorage.getItem(key)
}
```

For a bulletproof approach when setting a value, it's best to also catch any potential errors raised by the underlying Local/Session Storage Web API, like when exceeding quota:

```js
try {
  $q.localStorage.set(key, value)
} catch (e) {
  // data wasn't successfully saved due to
  // a Web Storage API error
}
```

::: tip
For an exhaustive list of methods, please check the API section.
:::

## Data Types

Quasar Storage supports (but not limited to) the following data types out of the box. If you store one of these types, the retrieved data will have the same data type.

* Dates
* Regular Expressions
* Numbers
* Booleans
* Strings
* Plain Javascript Objects

If you store any *other* data type, the returned value will be a String.

So you can even store functions, but be careful that you need to eval() the returned value (which is a String representation of the function).
