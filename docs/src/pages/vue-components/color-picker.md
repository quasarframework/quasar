---
title: Color Picker
desc: The QColorPicker Vue component provides a way for the user to input colors.
keys: QColorPicker
examples: QColor
related:
  - /quasar-utils/color-utils
---

The QColor component provides a method to input colors.

::: tip
For handling colors, also check out [Quasar Color Utils](/quasar-utils/color-utils).
:::

<DocApi file="QColor" />

## Usage

### Basic

<DocExample title="Basic" file="Basic" />

### With QInput

<DocExample title="Input" file="Input" />

There are **helpers** for QInput `rules` prop: [full list](https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns/patterns.js). You can use these for convenience or write the string specifying your [custom needs](/vue-components/input#internal-validation).

Examples: "hexColor", "rgbOrRgbaColor", "anyColor".

More info: [QInput](/vue-components/input).

### No header or footer

You can choose if you don't want to render the header and/or footer, like in example below:

<DocExample title="No header/footer" file="NoHeaderFooter" />

### Custom default view

You can also pick the default view, like in example below, where we also specify we don't want to render the header and footer. The end result generates a nice color palette that the user can pick from:

<DocExample title="Custom default view" file="CustomDefaultView" />

### Custom palette

<DocExample title="Custom palette" file="CustomPalette" />

### Palette slot <q-badge label="v2.31+" />

The `palette` slot replaces the default swatches of the palette view while keeping the Spectrum and Tune views and the view switcher. Its scope carries the colors (`palette`), a `select(color)` function and an `editable` flag, so you decide the layout and the labels. The default swatches are keyboard and screen reader accessible (see the Accessibility section below); keep yours that way too.

<DocExample title="Palette slot" file="PaletteSlot" />

### Force dark mode

<DocExample title="Force dark mode" file="Dark" />

### Default value

<DocExample title="Default value" file="DefaultValue" />

### Lazy update

<DocExample title="Lazy model" file="LazyModel" />

### Disable and readonly

<DocExample title="Disable and readonly" file="DisableReadonly" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QColor, otherwise formData will not contain it (if it should):

<DocExample title="Native form" file="NativeForm" />

## Accessibility <q-badge label="v2.25+" />

QColor is only partially accessible, and which view is active matters. The Tune view (native text/number inputs plus sliders) and, since v2.31, the Palette view are the keyboard and screen reader paths. The spectrum panel, on the other hand, is pointer-only: it cannot be reached with the keyboard and exposes nothing to assistive technology.

The palette swatches are buttons named by their color value, wrapped in a group carrying the localized `colorPicker.palette` label, and the swatch matching the current model is exposed as pressed. The palette holds a single <kbd>Tab</kbd> stop (the selected swatch, else the first one); the arrow keys move between swatches (<kbd>Up</kbd>/<kbd>Down</kbd> by one visual row), <kbd>Home</kbd>/<kbd>End</kbd> jump to the first/last swatch and <kbd>Enter</kbd>/<kbd>Space</kbd> pick the focused one. Swatches rendered through the `palette` slot are yours to make accessible.

The parts that are exposed carry localized accessible names from the [Quasar Language Pack](/options/quasar-language-packs) (`colorPicker.*`): the view tabs, the header's color value field and the hue/opacity sliders, none of which the consumer can name from the outside.

A `disable`d QColor exposes `aria-disabled="true"` on its root element.

If your app needs accessible color input, start users in the Tune or Palette view (`default-view="tune"` or `default-view="palette"`) or provide an alternative way of entering the color (e.g. a plain [QInput](/vue-components/input) accepting a hex value).
