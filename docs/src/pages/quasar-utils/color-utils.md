---
title: Color Utils
desc: A set of Quasar methods for changing app brand colors and manipulating color strings.
keys: rgbToHex,rgbToHsv,hexToRgb,textToRgb,hsvToRgb,lighten,luminosity,brightness,blend,changeAlpha,getPaletteColor
related:
  - style/color-palette
---

Quasar provides a set of useful functions to manipulate colors easily in most use cases, without the high additional cost of integrating dedicated libraries.

::: tip
For usage with the UMD build see [here](/start/umd#quasar-global-object).
:::

## Color Conversion
These functions take a color as string or Object and convert it to another format.

| Function | Source format | Destination format | Description |
| --- | --- | --- | --- |
| `rgbToHex` | Object | String | Converts a RGB/A color Object (`{ r: [0-255], g: [0-255], b: [0-255}<,  a: [0-100]>}`) to its HEX/A representation as a String (`#RRGGBB<AA>`). If Alpha channel is present in the original object it will be present also in the output. |
| `rgbToHsv` | Object | Object | Converts a RGB/A color Object (`{ r: [0-255], g: [0-255], b: [0-255}<,  a: [0-100]>}`) to its HSV/A representation as an Object (`{ h: [0-360], s: [0-100], v: [0-100},  a: [0-100]}`). If Alpha channel is present in the original object it will be present also in the output. |
| `hexToRgb` | String | Object | Converts a HEX/A color String (`#RRGGBB<AA>`) to its RGB/A representation as an Object (`{ r: [0-255], g: [0-255], b: [0-255}<,  a: [0-100]>}`) . If Alpha channel is present in the original object it will be present also in the output. |
| `textToRgb` | String | Object | Converts a HEX/A color String (`#RRGGBB<AA>`) or a RGB/A color String(`rgb(R, G, B<, A>)`) to its RGB/A representation as an Object (`{ r: [0-255], g: [0-255], b: [0-255}<,  a: [0-100]>}`). If Alpha channel is present in the original object it will be present also in the output. |
| `hsvToRgb` | String | Object | Converts a HSV/A color Object (`{ h: [0-360], s: [0-100], v: [0-100},  a: [0-100]}`) to its RGB/A representation as an Object (`{ r: [0-255], g: [0-255], b: [0-255}<,  a: [0-100]>}`). If Alpha channel is present in the original object it will be present also in the output. |

## Color Processing
These functions perform changes on the color or extract specific information.

### lighten (color, percent)
Lighten the `color` (if `percent` is positive) or darken it (if `percent` is negative).

Accepts a HEX/A String or a RGB/A String as `color` and a `percent` (0 to 100 or -100 to 0) of lighten/darken to be applied to the `color`.
Returns a HEX String representation of the calculated `color`.

### luminosity (color)
Calculates the [relative luminance](http://www.w3.org/TR/WCAG20/#relativeluminancedef) of the `color`.

Accepts a HEX/A String, a RGB/A String or a RGB/A Object as `color`.
Returns a value between 0 and 1.

### brightness (color)
Calculates the [color contrast](https://www.w3.org/TR/AERT/#color-contrast) of the `color`.

Accepts a HEX/A String, a RGB/A String or a RGB/A Object as `color`.
Returns a value between 0 and 255. A value of < 128 would be considered a dark color.

### blend (fgColor, bgColor)

Calculates the [blend](https://www.w3.org/TR/compositing-1/#simplealphacompositing) of two colors.

Accepts a HEX/A String or a RGB/A Object as `fgColor`/`bgColor`.
If the alpha channel of the `fgColor` is completely opaque, then the result will be the `fgColor`.
If the alpha channel of the `bgColor` is completely opaque, then the resulting blended color will also be opaque.
Returns the same type as input for fgColor.

### changeAlpha (color, offset)

Increments or decrements the alpha of a string color.

Accepts a HEX/A String as `color` and a number between -1 and 1 (including edges) as `offset`.
Use a negative value to decrement and a positive number to increment (ex: `changeAlpha('#ff0000', -0.1)` to decrement alpha by 10%).
Returns HEX/A String.

## Helper - getPaletteColor

You can query any brand color, palette color or custom color in JS context to get its hex string value. Note that the method below is not cheap to run, so use it with care:

```js
import { colors } from 'quasar'

const { getPaletteColor } = colors

console.log(getPaletteColor('primary')) // '#1976d2'
console.log(getPaletteColor('red-2')) // '#ffcdd2'
```

Assuming you've created [a custom color](/style/color-palette#adding-your-own-colors) and named it "my-color", then you can extract its value in JS:

```js
console.log(getPaletteColor('my-color')) // '#...'
```
