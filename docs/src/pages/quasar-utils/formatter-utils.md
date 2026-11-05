---
title: Formatter Utils
desc: A set of Quasar methods for formatting values. Capitalizing, padding, normalizing and more.
keys: capitalize,humanStorageSize,between,normalizeToInterval,pad,getDecimalsCount
---

### Helping Tree-Shake

You will notice all examples import `format` Object from Quasar. However, if you need only one formatter method from it, then you can use destructuring to help Tree Shaking embed only that method and not all of `format`.

```js
// we import all of `format`
import { format } from 'quasar'
// destructuring to keep only what is needed
const { capitalize, humanStorageSize } = format

console.log(capitalize('some text'))
// Some text
console.log(humanStorageSize(13087))
// 12.8kB
```

You can also import all formatters and use whatever you need like this (but note that your bundle will probably contain unused methods too):

```js
import { format } from 'quasar'

console.log(format.capitalize('some text'))
console.log(format.humanStorageSize(13087))
```

> [!NOTE]
> For usage with the UMD build see [here](/start/umd#quasar-global-object).

## Capitalize

```js
import { format } from 'quasar'
const { capitalize } = format

console.log(capitalize('some text'))
// Some text
```

## Format to Human Readable Size

```js
import { format } from 'quasar'
const { humanStorageSize } = format

// humanStorageSize(value, decimals = 1)
// "decimals" param requires Quasar v2.15.3+

console.log(humanStorageSize(13087))
// 12.8KB

console.log(humanStorageSize(1024 * 1024 * 2.25, 3))
// 2.250MB
```

## Normalize Number to Interval

```js
import { format } from 'quasar'
const { between } = format

// (Number) between(Number, Number min, Number max)
console.log(between(50, 10, 20))
// 20
```

```js
import { format } from 'quasar'
const { normalizeToInterval } = format

// (Number) normalizeToInterval(Number, Number lower_margin, Number upper_margin)

console.log(normalizeToInterval(21, 10, 20)) // 10
console.log(normalizeToInterval(33, 10, 20)) // 11
console.log(normalizeToInterval(52, 10, 20)) // 19
console.log(normalizeToInterval(5, 10, 16)) // 12
```

## Pad String

```js
import { format } from 'quasar'
const { pad } = format

// (String) pad(String toPad, Number length, String paddingCharacter)
// length is default 2
// paddingCharacter is default '0'
console.log(pad('2', 4))
// '0002'
```

## Count Decimals <q-badge label="v2.35.3+" />

Tells how many decimals a number (or a numeric string) needs when written in fixed notation, which is what `toFixed()` asks for. Unlike splitting `String(value)` on the dot, it also handles the numbers that JS prints in exponent notation.

```js
import { format } from 'quasar'
const { getDecimalsCount } = format

// (Number) getDecimalsCount(Number | String)
console.log(getDecimalsCount(12)) // 0
console.log(getDecimalsCount(0.25)) // 2
console.log(getDecimalsCount(1e-7)) // 7 (String(1e-7) is '1e-7')
console.log(getDecimalsCount('1.50')) // 2 (a string keeps its trailing zeros)

// rounding a sum back to the precision of its operands
const step = 0.1
console.log(0.2 + step) // 0.30000000000000004
console.log(Number.parseFloat((0.2 + step).toFixed(getDecimalsCount(step)))) // 0.3
```

The result never goes above 100, the most that `toFixed()` accepts.
