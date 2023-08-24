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


<doc-api file="QColor" />

## Usage

### Basic

<doc-example title="Basic" file="Basic" />

### With QInput

<doc-example title="Input" file="Input" />

There are **helpers** for QInput `rules` prop: [full list](https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns.js). You can use these for convenience or write the string specifying your [custom needs](/vue-components/input#internal-validation).

Examples: "hexColor", "rgbOrRgbaColor", "anyColor".

More info: [QInput](/vue-components/input).

### No header or footer

You can choose if you don't want to render the header and/or footer, like in example below:

<doc-example title="No header/footer" file="NoHeaderFooter" />

### Custom default view

You can also pick the default view, like in example below, where we also specify we don't want to render the header and footer. The end result generates a nice color palette that the user can pick from:

<doc-example title="Custom default view" file="CustomDefaultView" />

### Custom palette

<doc-example title="Custom palette" file="CustomPalette" />

### Force dark mode

<doc-example title="Force dark mode" file="Dark" />

### Default value

<doc-example title="Default value" file="DefaultValue" />

### Lazy update

<doc-example title="Lazy model" file="LazyModel" />

### Disable and readonly

<doc-example title="Disable and readonly" file="DisableReadonly" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QColor, otherwise formData will not contain it (if it should):

<doc-example title="Native form" file="NativeForm" />
