---
title: Color Palette
desc: How to use and customize the Quasar Color Palette.
components:
  - color-palette/BrandColors
  - color-palette/ColorList
related:
  - quasar-utils/color-utils
---
Quasar Framework offers a wide selection of colors out of the box. You can use them both as Sass/SCSS variables in your CSS code or directly as CSS classes in your HTML templates.

## Brand Colors
Most of the colors that Quasar Components use are strongly linked with these three colors that you can change. Choosing these colors is the first step one should take when differentiating the design of an App. You'll notice immediately upon changing their default values that Quasar Components follow these colors as a guideline.

<brand-colors />

::: tip TIPS
Also check [Theme Builder](/style/theme-builder) for a tool on customizing the brand colors of your website/app.
:::

## Color List

Here's the list of colors provided out of the box. Within your app's `*.vue` files you can use them as CSS classes (in HTML templates) or as [Sass/SCSS variables](/style/sass-scss-variables) in `<style lang="...">` tags.

<color-list />

## Using as CSS Classes
Use `text-` or `bg-` prefixes as class names to change the color of text or the color of the background. Additionally, use the `text-on-` prefix to select a text color that should be used when the specified color is the background color.

```html
<!-- changing text color -->
<p class="text-primary">....</p>

<!-- changing background color -->
<p class="bg-positive">...</p>

<!-- changing text color to one that should be used when secondary is the background color -->
<p class="text-on-secondary">...</p>
```

## Using Sass/SCSS Variables

In your app's `*.vue` files you can use the colors as `$primary`, `$red-1`, `$on-primary` and so on.

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
  color: $on-grey-5;
  background-color: $grey-5;
}
</style>
```

## Adding Your Own Colors
If you want to use your own colors for your components (let's say we are adding a color named "brand") all you need to do is add the following CSS into your app:

```css
.text-brand {
  color: #a2aa33 !important;
}
.bg-brand {
  background: #a2aa33 !important;
}
.text-on-brand {
  color: #ffffff !important;
}
```

Now we can use this color for Quasar components:
```html
<q-btn color="brand" ... />
```

You can access a custom color value (hex string) in JS context with the [getPaletteColor](/quasar-utils/color-utils#helper-getpalettecolor) util.

## Dynamic Change of Brand Colors (Dynamic Theme Colors)

### How it works

You can dynamically customize the brand colors during run-time: `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning`. That means you can have one build of your application with a default color theme but show it with a runtime selected one.

The main color configuration is done using CSS custom properties, stored on the root element (`:root`). Each property has a name of `--q-${name}` (example: `--q-primary`, `--q-secondary`, `--q-on-primary`) and should have a valid CSS color as value.

The CSS Custom properties use the same inheritance rules as normal CSS, so you can only redefine your desired colors and the rest will be inherited from the parent elements.

The recommended workflow is to set your customized color properties on the `html` (`document.documentElement`) or `body` (`document.body`) elements. This will allow you to revert to the default color by just deleting your custom one.

More info on CSS custom properties (variables) on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables).

### Util: setCssVar

Quasar offers a helper function for setting Quasar CSS variables that can be used for the brand colors too: `setCssVar(colorName, colorValue[, element])`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `colorName` | String | *Yes* | One of `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning` `on-primary`, `on-secondary`, `on-accent`, `on-positive`, `on-negative`, `on-info`, `on-warning` |
| `colorValue` | String | *Yes* | Valid CSS color value |
| `element` | Element | - | (Default: `document.body`) Element where the custom property will be set. |

Example of setting brand colors using the helper:

```js
import { setCssVar } from 'quasar'

setCssVar('light', '#DDD')
setCssVar('primary', '#33F')
setCssVar('primary', '#F33', document.getElementById('rebranded-section-id'))
```

Example of setting brand colors using vanilla JavaScript:

```js
// equivalent of setCssVar('primary') in raw JavaScript:
document.body.style.setProperty('--q-primary', '#0273d4')
```

### Util: getCssVar

Quasar offers a helper function for getting the value of Quasar CSS variables that can be used for brand colors too: `getCssVar(colorName[, element])`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `colorName` | String | *Yes* | One of `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning`, `on-primary`, `on-secondary`, `on-accent`, `on-positive`, `on-negative`, `on-info`, `on-warning` |
| `element` | Element | - | (Default: `document.body`) Element where the custom property will be read. |

Example of getting brand colors using the helper:

```js
import { getCssVar } from 'quasar'

getCssVar('primary') // '#33F'
getCssVar('primary', document.getElementById('rebranded-section-id'))
```

What this helper does is wrap the raw JavaScript `getPropertyValue()` and it's available for convenience. Here is an example of equivalent vanilla JavaScript:

```js
// equivalent of getCssVar('primary') in raw JavaScript:
getComputedStyle(document.documentElement)
  .getPropertyValue('--q-primary') // #0273d4
```

### More color utils

Besides the utils above, we also have a dedicated section in docs for handling colors that you might be interested in: [Color utils](/quasar-utils/color-utils).

```js
import { colors, setCssVar } from 'quasar'

const { lighten } = colors

const newPrimaryColor = '#933'
setCssVar('primary', newPrimaryColor)
setCssVar('primary-darkened', lighten(newPrimaryColor, -10))
```

## Setting Up Defaults

This is how you can set up some brand colors without tampering with the Sass variables:

```js
// Quasar CLI - quasar.config.js
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

Or with a [@quasar/app-vite Boot File](/quasar-cli-vite/boot-files) or a [@quasar/app-webpack Boot File](/quasar-cli-webpack/boot-files):

```js
// For Quasar CLI
// Do NOT run this boot file for SSR mode

import { setCssVar } from 'quasar'

export default () => {
  setCssVar('primary', '#ff0000')
}
```

If you are using the Quasar UMD version or the Quasar Vite plugin or Vue CLI:

```js
// UMD or Quasar Vite plugin or Vue CLI
app.use(Quasar, {
  config: {
    brand: {
      primary: '#ff0000',
      // ...
    }
  }
})
```
