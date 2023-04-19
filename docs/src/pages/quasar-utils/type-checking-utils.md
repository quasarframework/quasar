---
title: Type Checking Utils (<is>)
desc: A set of Quasar methods for type checking.
keys: is.deepEqual,is.object,is.date,is.regexp,is.number
badge: v2.8+
---

::: tip
For usage with the UMD build see [here](/start/umd#quasar-global-object).
:::

## is.deepEqual

Recursively checks if one Object is equal to another. Also supports Map, Set, ArrayBuffer, Regexp, Date, and many more.

```js
import { is } from 'quasar'

const objA = { /* ... */ }
const objB = { /* ... */ }

console.log( is.deepEqual(objA, objB) ) // true or false
```

## is.object

```js
import { is } from 'quasar'

const obj = { some: 'value' }
console.log( is.object(obj) ) // true
```

## is.date

```js
import { is } from 'quasar'

const date = new Date()
console.log( is.date(date) ) // true

const now = Date.now()
console.log( is.date(now) ) // false
```

## is.regexp

```js
import { is } from 'quasar'

const pattern1 = /\w+/
console.log( is.regexp(pattern1) ) // true

const pattern2 = new RegExp('\\w+')
console.log( is.regexp(pattern2) ) // true
```

## is.number

```js
import { is } from 'quasar'

const myNumber = 80
console.log( is.number(myNumber) ) // true
```
