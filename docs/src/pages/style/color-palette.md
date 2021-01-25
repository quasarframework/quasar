---
title: Color Palette
desc: How to use and customize the Quasar Color Palette.
components:
  - color-palette/BrandColors
  - color-palette/ColorList
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
Use `text-` or `bg-` prefixes as class names to change the color of text or the color of the background.

```html
<!-- changing text color -->
<p class="text-primary">....</p>

<!-- changing background color -->
<p class="bg-positive">...</p>
```

## Using Sass/SCSS Variables

In your app's `*.vue` files you can use the colors as `$primary`, `$red-1`, and so on.

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

You can access a custom color value (hex string) in JS context with the [getPaletteColor](/quasar-utils/color-utils#Helper---getPaletteColor) util.

## Dynamic Change of Brand Colors (Dynamic Theme Colors)

You can dynamically customize the brand colors during run-time: `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning`. That means you can have one build of your application with a default color theme but show it with a runtime selected one.

The main color configuration is done using CSS custom properties, stored on the root element (`:root`). Each property has a name of `--q-${name}` (example: `--q-primary`, `--q-secondary`) and should have a valid CSS color as value.

The CSS Custom properties use the same inheritance rules as normal CSS, so you can only redefine your desired colors and the rest will be inherited from the parent elements.

The recommended workflow is to set your customized color properties on the `html` (`document.documentElement`) or `body` (`document.body`) elements. This will allow you to revert to the default color by just deleting your custom one.

More info on CSS custom properties (variables) on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables).

### Helper - setCssVar

Quasar offers a helper function for setting Quasar CSS variables that can be used for the brand colors too: `setCssVar(colorName, colorValue[, element])`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `colorName` | String | *Yes* | One of `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning` |
| `colorValue` | String | *Yes* | Valid CSS color value |
| `element` | Element | - | (Default: `document.body`) Element where the custom property will be set. |

Example of setting brand colors using the helper:

```js
import { setCssVar } from 'quasar'

setCssVar('light', '#DDD')
setCssVar('primary', '#33F')
setCssVar('primary', '#F33', document.getElementById('rebranded-section-id'))
```

Example of setting brand colors using the helper:

```js
// equivalent of setCssVar('primary') in raw Javascript:
document.body.style.setProperty('--q-primary', '#0273d4')
```

### Helper - getCssVar

Quasar offers a helper function for getting the value of Quasar CSS variables that can be used for brand colors too: `getCssVar(colorName[, element])`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `colorName` | String | *Yes* | One of `primary`, `secondary`, `accent`, `dark`, `positive`, `negative`, `info`, `warning` |
| `element` | Element | - | (Default: `document.body`) Element where the custom property will be read. |

Example of getting brand colors using the helper:

```js
import { colors } from 'quasar'

getCssVar('primary') // '#33F'
getCssVar('primary', document.getElementById('rebranded-section-id'))
```

What this helper does is wrap the raw Javascript `getPropertyValue()` and it's available for convenience. Here is an example of equivalent vanilla Javascript:

```js
// equivalent of getCssVar('primary') in raw Javascript:
getComputedStyle(document.documentElement)
  .getPropertyValue('--q-primary') // #0273d4
```

### Setting Up Defaults

Should you wish to set up some brand colors without tampering with the Sass variables, you can do so in quasar.conf.js:

```js
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

Or with a [boot file](/quasar-cli/boot-files):

```js
// Do NOT run this in SSR mode

import { setCssProperty } from 'quasar'

export default () => {
  setCssProperty('primary', '#ff0000')
}
```

This is especially useful when you use the Quasar UMD version or Vue CLI:

```js
// UMD or Vue CLI
app.use(Quasar, {
  brand: {
    primary: '#ff0000',
    // ...
  }
})
```
