---
title: Local/Session Storage Plugins
desc: A Quasar plugin that wraps the Local/Session Storage, retrieving data with its original JS type and exposing it reactively.
keys: LocalStorage,SessionStorage,useStorage,items
examples: WebStorage
---

Quasar provides a wrapper over [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). Besides the usual methods, it exposes the storage as a [reactive view](#reactive-items) (v2.34+): read `$q.localStorage.items.myTheme` in a template or a computed and it updates whenever the item changes, from anywhere in your app or from another tab or window.

> [!NOTE]
> Web Storage API only retrieves strings. **Quasar retrieves data with its original data type.** You tell it to store a Number then to retrieve it and it will still be a Number, not a string representation of the number as with Web Storage API. Same for JSON, Regular Expressions, Dates, Booleans and so on.

> [!WARNING]
> **Note about SSR/SSG**
>
> Web Storage is a browser API only. On the server-side of SSR/SSG builds every item reads as missing and every write is dropped, so guard anything that must run against real data with a client-side check (or `onMounted()`); the client-side works as usual.

<DocApi file="LocalStorage" />

<DocApi file="SessionStorage" />

<DocInstall :plugins="['LocalStorage', 'SessionStorage']" />

## Usage

```js Outside of a Vue file
import { LocalStorage, SessionStorage } from 'quasar'

LocalStorage.setItem(key, value)
const value = LocalStorage.getItem(key)

SessionStorage.setItem(key, value)
const otherValue = SessionStorage.getItem(key)
```

```js Inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.localStorage.setItem(key, value)
  const value = $q.localStorage.getItem(key)

  $q.sessionStorage.setItem(key, value)
  const otherValue = $q.sessionStorage.getItem(key)
}
```

For a bulletproof approach when setting a value, it's best to also catch any potential errors raised by the underlying Local/Session Storage Web API, like when exceeding quota:

```js
try {
  $q.localStorage.setItem(key, value)
} catch (e) {
  // data wasn't successfully saved due to
  // a Web Storage API error
}
```

> [!NOTE]
> For an exhaustive list of methods, please check the API section.

## Reactive items <q-badge label="v2.34+" />

The `items` property is a reactive view of the storage, one property per key. Reading a property gives you the item value (`null` while it is missing), assigning one persists it and deleting it removes it. A template, a computed or a watcher reading it re-evaluates whenever the item changes, from anywhere in your app or from another tab or window of the same origin.

```js
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()
  const { items } = $q.localStorage

  items.myTheme // 'dark', or null while missing
  items.myTheme = 'dark' // persisted
  delete items.myTheme // removed; same as removeItem('myTheme')

  items.myTheme ??= 'light' // stores a default the first time only

  // a nested change of an object (or Array) gets persisted too
  items.settings = { notifications: true }
  items.settings.notifications = false
}
```

```html
<!-- straight in a template -->
<q-toggle
  v-model="$q.localStorage.items.enableNotifications"
  label="Notifications"
/>
```

<DocExample title="Reactive items" file="Basic" />

<DocExample title="Nested changes" file="Nested" />

> [!TIP]
> **Typed keys**
>
> The view is typed as any key holding any storable value. Declare your own keys once, per storage area, to have them checked everywhere:
>
> ```ts
> declare module 'quasar' {
>   interface LocalStorageItems {
>     theme?: 'light' | 'dark'
>   }
>
>   interface SessionStorageItems {
>     draft?: { title: string }
>   }
> }
> ```

> [!NOTE]
> The view is deliberately not enumerable and has no `in`: `Object.keys()` or a `v-for` over it see nothing and `'theme' in items` is always `false`, so that no key gets tracked without being read. Use `getAllKeys()`, `getAll()` or `hasItem()` for those.

> [!NOTE]
> Nested changes are tracked when made through the view (`items.settings.notifications = false`), on plain Objects and Arrays only. Mutating the original object you assigned, or a `Date` in place (`items.since.setFullYear(2027)`), persists nothing: assign through the view instead.

> [!TIP]
> **Outside of a component**
>
> - The view can be used anywhere: in a boot file, a store or a plain module. A key read from a component (or any Vue effect scope, a Pinia store included) is tracked while that scope lives and released with the last of them; a key first read outside of any scope stays tracked for the rest of the page.
> - One quirk follows from this: a `watch()` created outside of any scope, on a key that a component is already reading, gets released together with that component and stops firing. Create such a watcher inside an `effectScope()` (or read the key from it before any component does, so that the key gets tracked for the rest of the page).

> [!WARNING]
> **Note about SSR/SSG**
>
> The server has no storage, so it renders every item as missing. On the client, the view reads the same way until the page is hydrated, then every reader catches up on its own: the markup matches on both sides and no hydration error gets triggered. Expect a flash of the missing state on the first paint, and make it read well (a `?? 'light'` fallback, for instance).

## Data Types

The following data types are retrieved with the same data type they were stored with:

- Strings
- Numbers
- Booleans
- Dates
- Regular Expressions (flags included, v2.34+)
- Plain JavaScript Objects and Arrays (anything `JSON.stringify()` handles)

A Function is stored as its source and comes back as a String. Any other value, `null` and `undefined` included, is stored the way the browser stringifies it and comes back as that String; a `null` read always means a missing item, and removing one is `removeItem()`'s job.
