---
title: Typography
desc: The typography of a Quasar app and its helper CSS classes.
components:
  - ./TypographyHeadings
  - ./TypographyWeights
related:
  - /style/visibility
  - /style/positioning
  - /style/spacing
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
| `text-bold` | Text will be in bold |
| `text-italic` | Text will be in italic |
| `text-no-wrap` | Non wrappable text (applies `white-space: nowrap`) |
| `text-strike` | Applies `text-decoration: line-through` |
| `text-uppercase` | Transform text to uppercase |
| `text-lowercase` | Transform text to lowercase |
| `text-capitalize` | Capitalize first letter of the text |

## Default Font
The default webfont embedded is [Roboto](https://fonts.google.com/specimen/Roboto). **But it is not required**. You can use whatever font(s) you like.

Roboto comes with 5 different font weights you can use: 100, 300, 400, 500, 700.

This is where Roboto font comes embedded by default, if you are looking to remove it:

```js
// file: /quasar.config.js
extras: [
  'roboto-font'
]
```

## Add custom fonts
It is also possible to include other fonts to use them in the app. The following is one way to do it:

1. Copy your new webfont `[customfont].woff` (or whatever extension it has; recommended is `woff` for compatibility across all browsers) in a directory of your choice, for example: `./src/css/fonts/[customfont.woff]`
2. Declare your font in `./src/css/app.{css|sass|scss|styl}` (or in any place you see fit, but correctly update the relative path to the webfont file):

```css
@font-face {
  font-family: customfont;
  src: url(./fonts/customfont.woff);
}

// declare a class which applies it
.my-font {
  font-family: 'customfont';
}
```

3. Then use that class where you need it.
