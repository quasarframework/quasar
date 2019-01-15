---
title: Color Palette
---
Quasar Framework offers a wide selection of colors out of the box. You can use them both as Stylus variables in your CSS code or directly as CSS classes in your HTML templates.

## Brand Colors
There can be three main colors used throughout your App, called `primary`, `secondary` and `tertiary`.

Most of the colors that Quasar Components use are strongly linked with these three colors that you can change. Choosing these colors is the first step one should take when differentiating the design of an App. You'll notice immediately upon changing their default values that Quasar Components follow these colors as a guideline.

## Color List

Here's the list of colors provided out of the box. Use them as CSS classes (in HTML templates) or as Stylus variables (in `<style lang="stylus">` tags) within your app's `*.vue` files.

`primary`, `secondary`, `tertiary`  
`positive`, `negative`, `info`, `warning`, `white`, `black`, `light`, `dark`, `faded`  

 Colors come in the following preset hues:  
`red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`, `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`, `yellow`, `amber`, `orange`, `deep-orange`, `brown`, `grey`, `blue-grey`

Example of color variation: `red`, `red-1`, `red-2`, ..., `red-14`. Variation 11 to 14 are color accents.

<doc-example title="Color Palette" file="ColorPalette/Standard" />


## Using as CSS Classes
Use `text-` or `bg-` prefixes as class names to change the color of text or the color of the background.

``` html
<!-- changing text color -->
<p class="text-primary">....</p>

<!-- changing background color -->
<p class="bg-positive">...</p>
```

## Using Stylus Variables
In your app's `*.vue` files you can use the colors as `$primary`, `$red-1`, and so on.

```html
<!-- Notice lang="stylus" -->
<style lang="stylus">
// "variables" is a Webpack alias injected by Quasar CLI
@import '~variables'

div
  color $red-1
  background-color $grey-5
</style>
```

## Adding Your Own Colors
If you want to use your own colors for your components (let's say we are adding a color named "brand") all you need to do is add the following CSS into your app:

```css
.text-brand {
  color: #a2aa33;
}
.bg-brand {
  background: #a2aa33;
}
```

Now we can use this color for Quasar components:
```html
<q-input color="brand" ... />
```


## Dynamic Change of Brand Colors (Dynamic Theme Colors)

::: warning
This is only supported on [browsers that support CSS Variables](https://caniuse.com/#feat=css-variables) (Custom Properties).
It is not going to work on IE11, but it will fall back to the brand colors from the CSS theme.

This feature requires Quasar v0.15.7+
:::

You can dynamically customize the brand colors during run-time: `primary`, `secondary`, `tertiary`, `positive`, `negative`, `info`, `warning`, `light`, `dark`, `faded`. That means you can have one build of your application with a default color theme but show it with a runtime selected one.

The main color configuration is done using CSS custom properties, stored on the root element (`:root`). Each property has a name of `--q-color-${name}` (example: `--q-color-primary`, `--q-color-secondary`) and should have a valid CSS color as value.

The CSS Custom properties use the same inheritance rules as normal CSS, so you can only redefine your desired colors and the rest will be inherited from the parent elements.

The recommended workflow is to set your customized color properties on the `html` (`document.documentElement`) or `body` (`document.body`) elements. This will allow you to revert to the default color by just deleting your custom one.

More info on CSS custom properties (variables): https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables

### Helper - setBrand
Quasar offers a helper function for setting custom colors in the `colors` utils: `setBrand(colorName, colorValue[, element])`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `colorName` | String | *Yes* | One of `primary`, `secondary`, `tertiary`, `positive`, `negative`, `info`, `warning`, `light`, `dark`, `faded` |
| `colorValue` | String | *Yes* | Valid CSS color value |
| `element` | Element | - | (Default: `document.body`) Element where the custom property will be set. |

Example of setting brand colors using the helper:

```js
import { colors } from 'quasar'

colors.setBrand('light', '#DDD')
colors.setBrand('primary', '#33F')
colors.setBrand('primary', '#F33', document.getElementById('rebranded-section-id'))
```

> The helper function will also take care of setting dependent custom properties for some colors (`positive`, `negative`, `light`), so this is the recommended way of usage instead of the raw Javascript `setProperty()`.

### Helper - getBrand
Quasar offers a helper function for setting custom colors in the `colors` utils: `getBrand(colorName[, element])`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `colorName` | String | *Yes* | One of `primary`, `secondary`, `tertiary`, `positive`, `negative`, `info`, `warning`, `light`, `dark`, `faded` |
| `element` | Element | - | (Default: `document.body`) Element where the custom property will be read. |

Example of getting brand colors using the helper:

```js
import { colors } from 'quasar'

colors.getBrand('primary') // '#33F'
colors.getBrand('primary', document.getElementById('rebranded-section-id'))
```

What this helper does is wrap the raw Javascript `getPropertyValue()` and it's available for convenience. Here is an example of equivalent vanilla Javascript:

```js
// equivalent of colors.getBrand('primary') in raw Javascript:

getComputedStyle(document.documentElement)
  .getPropertyValue('--q-color-primary') // #0273d4
```

### Setting Up Defaults
*Quasar v0.17+;* **Not supported by IE11**

Should you wish to set up some brand colors without tampering with the Stylus variables, you can do so in quasar.conf.js:

```
// quasar.conf.js
return {
  framework: {
    config: {
      brand: {
        primary: '#ff0000',
        // ...
      }
    }
  }
}
```

This is especially useful when you use the Quasar UMD version, where you would place the global `quasarConfig` Object before your Quasar script tag.

```html
<script>
  // optional
  window.quasarConfig = {
    brand: {
      primary: '#ff0000',
      // ...
    }
  }
</script>
```
