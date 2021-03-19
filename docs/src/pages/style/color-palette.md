---
title: Color Palette
desc: How to use and customize the Quasar Color Palette.
components:
  - color-palette/BrandColors
  - color-palette/ColorList
---
Quasar Framework offers a wide selection of colors out of the box. You can use them both as Sass/SCSS/Stylus variables in your CSS code or directly as CSS classes in your HTML templates.

## Brand Colors
Most of the colors that Quasar Components use are strongly linked with these three colors that you can change. Choosing these colors is the first step one should take when differentiating the design of an App. You'll notice immediately upon changing their default values that Quasar Components follow these colors as a guideline.

<brand-colors />

::: tip TIPS
* Also check [Theme Builder](/style/theme-builder) for a tool on customizing the brand colors of your website/app.
* `dark` was added in Quasar v1.3.
:::

## Color List

Here's the list of colors provided out of the box. Within your app's `*.vue` files you can use them as CSS classes (in HTML templates) or as [Sass/SCSS variables](/style/sass-scss-variables) or as [Stylus variables](/style/stylus-variables) in `<style lang="...">` tags.

<color-list />

## Using as CSS Classes
Use `text-` or `bg-` prefixes as class names to change the color of text or the color of the background.

``` html
<!-- changing text color -->
<p class="text-primary">....</p>

<!-- changing background color -->
<p class="bg-positive">...</p>
```

## Using Sass/SCSS/Stylus Variables
In your app's `*.vue` files you can use the colors as `$primary`, `$red-1`, and so on. Note that for Sass/SCSS you will need "@quasar/app" v1.1+ AND Quasar v1.1.1+.

```html
<!-- Notice lang="sass" -->
<style lang="sass">
div
  color: $red-1
  background-color: $grey-5
</style>
```

```html
<!-- Notice lang="scss" -->
<style lang="scss">
div {
  color: $red-1;
  background-color: $grey-5;
}
</style>
```

```html
<!-- Notice lang="stylus" -->
<style lang="stylus">
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
<q-btn color="brand" ... />
```

Starting with v1.10+, you can access a custom color value (hex string) in JS context with the [getPaletteColor](/quasar-utils/color-utils#helper-getpalettecolor) util.

## Dynamic Change of Brand Colors (Dynamic Theme Colors)

::: warning
This is only supported on [browsers that support CSS Variables](https://caniuse.com/#feat=css-variables) (Custom Properties).
It is not going to work on IE11, but it will fall back to the brand colors from the CSS theme.
:::

You can dynamically customize the brand colors during run-time: `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning`. That means you can have one build of your application with a default color theme but show it with a runtime selected one.

The main color configuration is done using CSS custom properties, stored on the root element (`:root`). Each property has a name of `--q-color-${name}` (example: `--q-color-primary`, `--q-color-secondary`) and should have a valid CSS color as value.

The CSS Custom properties use the same inheritance rules as normal CSS, so you can only redefine your desired colors and the rest will be inherited from the parent elements.

The recommended workflow is to set your customized color properties on the `html` (`document.documentElement`) or `body` (`document.body`) elements. This will allow you to revert to the default color by just deleting your custom one.

More info on CSS custom properties (variables) on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables).

### Helper - setBrand

::: danger
Not supported by IE11
:::

Quasar offers a helper function for setting custom colors in the `colors` utils: `setBrand(colorName, colorValue[, element])`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `colorName` | String | *Yes* | One of `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning` |
| `colorValue` | String | *Yes* | Valid CSS color value |
| `element` | Element | - | (Default: `document.body`) Element where the custom property will be set. |

Example of setting brand colors using the helper:

```js
import { colors } from 'quasar'

colors.setBrand('light', '#DDD')
colors.setBrand('primary', '#33F')
colors.setBrand('primary', '#F33', document.getElementById('rebranded-section-id'))
```

Example of setting brand colors using the helper:

```js
// equivalent of colors.setBrand('primary') in raw Javascript:
document.body.style.setProperty('--q-color-primary', '#0273d4')
```

### Helper - getBrand

::: danger
Not supported by IE11
:::

Quasar offers a helper function for setting custom colors in the `colors` utils: `getBrand(colorName[, element])`

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

What this helper does is wrap the raw Javascript `getPropertyValue()` and it's available for convenience. Here is an example of equivalent vanilla Javascript:

```js
// equivalent of colors.getBrand('primary') in raw Javascript:
getComputedStyle(document.documentElement)
  .getPropertyValue('--q-color-primary') // #0273d4
```

### Setting Up Defaults

::: danger
Not supported by IE11
:::

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
// for Quasar UMD
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
