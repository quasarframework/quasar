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
console.log( is.object(objA) ) // true or false
```

## is.date

```js
import { is } from 'quasar'

const myDate = new Date()
console.log( is.date(myDate) ) // true or false
```

## is.regexp

```js
import { is } from 'quasar'

const myRegexp = new Regexp(/* ... */)
console.log( is.date(myRegexp) ) // true or false
```

## is.number

```js
import { is } from 'quasar'

const myNumber = 80
console.log( is.date(myNumber) ) // true or false
```
