---
title: Color Utils
desc: A set of Quasar methods for changing app brand colors and manipulating color strings.
---

Quasar provides a set of useful functions to manipulate colors easily in most use cases, without the high additional cost of integrating dedicated libraries.

### Helping Tree-Shake
You will notice all examples import `colors` Object from Quasar. However, if you need only one method from it, then you can use ES6 destructuring to help Tree Shaking embed only that method and not all of `colors`.

Example with `setBrand()`:
```js
// we import all of `colors`
import { colors } from 'quasar'
// destructuring to keep only what is needed
const { setBrand } = colors

setBrand('primary', '#f33')
```

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

### blend (fgColor, bgColor) <q-badge align="top" color="brand-primary" label="v1.7.1+" />

Calculates the [blend](https://www.w3.org/TR/compositing-1/#simplealphacompositing) of two colors.

Accepts a HEX/A String or a RGB/A Object as `fgColor`/`bgColor`.
If the alpha channel of the `fgColor` is completely opaque, then the result will be the `fgColor`.
If the alpha channel of the `bgColor` is completely opaque, then the resulting blended color will also be opaque.
Returns the same type as input for fgColor.

### changeAlpha (color, offset) <q-badge align="top" color="brand-primary" label="v1.7.2+" />

Increments or decrements the alpha of a string color.

Accepts a HEX/A String as `color` and a number between -1 and 1 (including edges) as `offset`.
Use a negative value to decrement and a positive number to increment (ex: `changeAlpha('#ff0000', -0.1)` to decrement alpha by 10%).
Returns HEX/A String.

## Dynamic Change of Brand Colors (Dynamic Theme Colors)

::: warning
This is only supported on [browsers that support CSS Variables](https://caniuse.com/#feat=css-variables) (Custom Properties).

It is not going to work on IE11, but it will fall back to the brand colors from the CSS theme.
:::

You can dynamically customize the brand colors during run-time: `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning`. That means you can have one build of your application with a default color theme but show it with a runtime selected one.

The main color configuration is done using CSS custom properties, stored on the root element (`:root`). Each property has a name of `--q-color-${name}` (example: `--q-color-primary`, `--q-color-secondary`) and should have a valid CSS color as value.

The CSS Custom properties use the same inheritance rules as normal CSS, so you can only redefine your desired colors and the rest will be inherited from the parent elements.

The recommended workflow is to set your customized color properties on the `html` (`document.documentElement`) or `body` (`document.body`) elements. This will allow you to revert to the default color by just deleting your custom one.

More info on CSS custom properties (variables): https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables

### Helper - setBrand
Quasar offers a helper function for setting custom colors in the `colors` utils: `setBrand(colorName, colorValue[, element])`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `colorName` | String | *Yes* | One of `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning` |
| `colorValue` | String | *Yes* | Valid CSS color value |
| `element` | Element | - | (Default: `document.body`) Element where the custom property will be set. |

Example of setting brand colors using the helper:

```js
import { colors } from 'quasar'

colors.setBrand('info', '#DDD')
colors.setBrand('primary', '#33F')
colors.setBrand('primary', '#F33', document.getElementById('rebranded-section-id'))
```

The helper function will also take care of setting dependent custom properties for brand colors, so this is the recommended way of usage instead of the raw Javascript `setProperty()`.

### Helper - getBrand
Quasar offers a helper function for getting custom colors in the `colors` utils: `getBrand(colorName[, element])`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `colorName` | String | *Yes* | One of `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning` |
| `element` | Element | - | (Default: `document.body`) Element where the custom property will be read. |

Example of getting brand colors using the helper:

```js
import { colors } from 'quasar'

colors.getBrand('primary') // '#33F'
colors.getBrand('primary', document.getElementById('rebranded-section-id'))
```

What this helper does is wrap the raw Javascript `getPropertyValue()` and it's available for convenience. Example of equivalent raw Javascript:

```js
// equivalent of colors.getBrand('primary') in raw Javascript:

getComputedStyle(document.documentElement)
  .getPropertyValue('--q-color-primary') // #0273d4
```

### Create Dynamic Custom Colors
You can use `setBrand` and `getBrand` to define custom brand colors to use in your application.
An example of such a new custom color usage:

```stylus
$primary-darkened = darken($primary, 10%)

:root
  --q-color-primary-darkened $primary-darkened

.text-primary-darkened
  color $primary-darkened !important
  color var(--q-color-primary-darkened) !important
.bg-primary-darkened
  background $primary-darkened !important
  background var(--q-color-primary-darkened) !important
```

```js
import { colors } from 'quasar'

const { lighten, setBrand } = colors

const newPrimaryColor = '#933'
setBrand('primary', newPrimaryColor)
setBrand('primary-darkened', lighten(newPrimaryColor, -10))
```

## Helper - getPaletteColor <q-badge align="top" color="brand-primary" label="v1.10+" />

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
