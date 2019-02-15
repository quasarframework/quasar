---
title: Typography
components:
  - typography/TypographyHeadings
  - typography/TypographyWeights
---
We'll handle the typography supplied by Quasar in the sections below.

## Headings
<typography-headings />

## Font Weights
<typography-weights />

## CSS Helper Classes
| Class Name | Description |
| --- | --- |
| `text-right` | Align text to the right |
| `text-left` | Align text to the left |
| `text-center` | Align text to the center |
| `text-justify` | Text will be justified |
| `text-truncate` | Applies all CSS tweaks to truncate text when container is too small |
| `text-bold` | Text will be in bold |
| `text-italic` | Text will be in italic |
| `text-no-wrap` | Non wrapable text (applies `white-space: nowrap`) |
| `text-uppercase` | Transform text to uppercase |
| `text-lowercase` | Transform text to lowercase |
| `text-capitalize` | Capitalize first letter of the text |

## Default Font
The default webfont embedded is [Roboto](https://fonts.google.com/specimen/Roboto). **But it is not required**. You can use whatever font(s) you like.

Roboto comes with 5 different font weights you can use: 100, 300, 400, 500, 700.

This is where Roboto font comes embedded by default, if you are looking to remove it:

```js
// file: /quasar.conf.js
extras: [
  'roboto-font'
]
```

## Add custom fonts
It is also possible to include other fonts to use them in the app.
* Copy your new font `[customfont].ttf` in a directory of your choice, for example: `./src/themes/fonts/[customfont.ttf]`
* Declare your font in `./src/themes/app.variables.styl`:
```stylus
@font-face
  font-family customfont
  src url(../src/themes/fonts/customfont.ttf)
```
* Reference your custom font in the vue-component, where you want it to be used. Example:
```css
.title {
  font-family: 'customfont';
}
```
