---
title: Local/Session Storage Plugins
desc: A Quasar plugin that wraps the Local/Session Storage, retrieving data with its original JS type and binding storage items to Vue refs.
keys: LocalStorage,SessionStorage,useItem,useStorage
examples: WebStorage
---

Quasar provides a wrapper over [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). Besides the usual methods, it binds a storage item to a Vue ref (v2.34+): `$q.localStorage.useItem('theme')` reads and writes the item, updates whenever the item changes through the plugin, from anywhere in your app or from another tab or window, and works in a template, a computed, a watcher or a Pinia store alike.

> [!NOTE]
> Web Storage API only retrieves strings. **Quasar retrieves data with its original data type.** You tell it to store a Number then to retrieve it and it will still be a Number, not a string representation of the number as with Web Storage API. Same for JSON, Regular Expressions, Dates, Booleans and so on.

> [!WARNING]
> Read and write through the plugin only. It encodes what it stores in order to keep the data type, so its methods and the native `localStorage`/`sessionStorage` ones are not interchangeable: an item written natively does not read back with its type and a native write in the same tab goes unnoticed by the [item refs](#item-refs).

> [!WARNING]
> **Note about SSR/SSG**
>
> Web Storage is a browser API only. On the server-side of SSR/SSG builds every item reads as missing, every write is dropped and an item ref reads as its default, so guard anything that must run against real data with a client-side check (or `onMounted()`); the client-side works as usual.

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

## Item refs <q-badge label="v2.34+" />

`useItem(key, options)` returns a Vue ref bound to a storage item. Reading it gives you the item value (its default, or `null`, while the item is missing), assigning it persists the value right away and a nested change of an object or Array value gets persisted too. A template, a computed or a watcher reading it re-evaluates whenever the item changes through the plugin, from anywhere in your app or from another tab or window of the same origin.

```js
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  const theme = $q.localStorage.useItem('theme', { default: 'light' })

  theme.value // 'light' while the item is missing, the stored value otherwise
  theme.value = 'dark' // persisted; every other ref of the item follows
  theme.value = null // removed, which reads as the default again

  // a nested change of an object (or Array) gets persisted too
  const settings = $q.localStorage.useItem('settings', {
    default: { notifications: true }
  })
  settings.value.notifications = false

  return { theme, settings }
}
```

```html
<!-- straight in a template -->
<q-toggle v-model="settings.notifications" label="Notifications" />
```

The options, all optional:

```js
$q.localStorage.useItem('settings', {
  // value the ref reads while the item is missing; it gets stored when
  // the ref attaches to a missing item and whenever the item is removed
  // (default: none, the ref then reads null)
  default: { notifications: true },

  // hand out an object or Array value reactive, so that a nested change
  // gets tracked and persisted; false for a large value that you only
  // ever assign as a whole (default: true)
  deep: true,

  // while true the ref is detached from the storage, a plain in-memory
  // ref; once false again it attaches like a new ref (default: false)
  disabled: false,

  // called when the storage cannot be written (quota exceeded, private
  // browsing) or a stored value cannot be decoded (default: none, the
  // error is thrown)
  onError(err) {
    /* ... */
  }
})
```

<DocExample title="Item ref" file="Basic" />

<DocExample title="Nested changes" file="Nested" />

<DocExample title="Persist on demand" file="Disabled" />

> [!TIP]
> **Typed keys**
>
> An item ref is typed as any storable value, or as its default when one is given. Declare your own keys once, per storage area, to have every `useItem()` call checked against them, defaults included:
>
> ```ts
> declare module 'quasar' {
>   interface LocalStorageItems {
>     theme: 'light' | 'dark'
>   }
>
>   interface SessionStorageItems {
>     draft: { title: string }
>   }
> }
> ```

> [!NOTE]
> An item with a default always holds a value: while a ref with a default is attached to it, removing the item (`removeItem()`, `clear()`, assigning `null`, another tab) stores the default again. A ref without a default reads `null` for a removed item.

> [!NOTE]
> Nested changes are tracked when made through the ref (`settings.value.notifications = false`), on plain Objects and Arrays only. Mutating the original object you assigned, or a `Date` in place (`since.value.setFullYear(2027)`), persists nothing: assign through the ref instead. With `deep: false` the ref hands out the plain value and only an assignment persists.

> [!TIP]
> **Outside of a component**
>
> `useItem()` can also be called outside of `setup()`: in a boot file, a store or a plain module. A ref created inside a Vue effect scope (a component or a Pinia store) is released together with it; one created outside of any scope stays bound to the storage for the rest of the page: call its `stop()` method when you are done with it.

> [!WARNING]
> **Note about SSR/SSG**
>
> The server has no storage, so it renders every item ref as its default. On the client, the ref reads the same way until the page is hydrated, then catches up on its own: the markup matches on both sides and no hydration error gets triggered. Expect a flash of the default on the first paint, and pick a default that reads well.

## Data Types

The following data types are retrieved with the same data type they were stored with:

- Strings
- Numbers
- Booleans
- Dates
- Regular Expressions (flags included, v2.34+)
- Plain JavaScript Objects and Arrays (anything `JSON.stringify()` handles)

A Function is stored as its source and comes back as a String. Storing `null` or `undefined` removes the item (v2.34+; older versions stored the Strings the browser makes of them), so a `null` read always means a missing item. Any other value is stored the way the browser stringifies it and comes back as that String.
