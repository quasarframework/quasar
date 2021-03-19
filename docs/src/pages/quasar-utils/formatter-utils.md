---
title: Formatter Utils
desc: A set of Quasar methods for formatting values. Capitalizing, padding, normalizing and more.
---

### Helping Tree-Shake
You will notice all examples import `format` Object from Quasar. However, if you need only one formatter method from it, then you can use ES6 destructuring to help Tree Shaking embed only that method and not all of `format`.

Example:
```js
// we import all of `format`
import { format } from 'quasar'
// destructuring to keep only what is needed
const { capitalize, humanStorageSize } = format

console.log( capitalize('some text') )
// Some text
console.log( humanStorageSize(13087) )
// 12.78 kB
```

You can also import all formatters and use whatever you need like this (but note that your bundle will probably contain unused methods too):
```js
import { format } from 'quasar'

console.log( format.capitalize('some text') )
console.log( format.humanStorageSize(13087) )
```

::: tip
For usage with the UMD build see [here](/start/umd#quasar-global-object).
:::

## Capitalize
``` js
import { format } from 'quasar'
const { capitalize } = format

console.log( capitalize('some text') )
// Some text
```

## Format to Human Readable Size
``` js
import { format } from 'quasar'
const { humanStorageSize } = format

console.log( humanStorageSize(13087) )
// 12.78 kB
```

## Normalize Number to Interval

``` js
import { format } from 'quasar'
const { between } = format

// (Number) between(Number, Number min, Number max)
console.log( between(50, 10, 20) )
// 20
```

``` js
import { format } from 'quasar'
const { normalizeToInterval } = format

// (Number) normalizeToInterval(Number, Number lower_margin, Number upper_margin)

console.log( normalizeToInterval(21, 10, 20) ) // 10
console.log( normalizeToInterval(33, 10, 20) ) // 11
console.log( normalizeToInterval(52, 10, 20) ) // 19
console.log( normalizeToInterval(5, 10, 16) ) // 12
```

## Pad String
``` js
import { format } from 'quasar'
const { pad } = format

// (String) pad(String toPad, Number length, String paddingCharacter)
// length is default 2
// paddingCharacter is default '0'
console.log( pad('2', 4) )
// '0002'
```
