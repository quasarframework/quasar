---
title: QTime
related:
  - /vue-components/date
  - /quasar-utils/date-utils
  - /vue-components/field
---

The QTime component provides a method to input time.

::: tip
For handling date and/or time, also check out [Quasar Date Utils](/quasar-utils/date-utils).
:::

## Installation
<doc-installation components="QTime" />

## Usage

Notice that the model is a String only.

### Basic

<doc-example title="Basic" file="QTime/Basic" />

<doc-example title="Landscape" file="QTime/Landscape" />

::: tip
For landscape mode, you can use it along with `$q.screen` to make QTime responsive. Example: `:landscape="$q.screen.gt.xs"`. More info: [Quasar Screen Plugin](/options/screen-plugin).
:::

### Functionality

The 24 hour format is applied depending on the [Quasar Language Pack](/options/quasar-language-packs) that you've set, but you can also force it, like in the example below.

<doc-example title="24h format" file="QTime/Format24h" />

Clicking on the "Now" button sets time to current user time:

<doc-example title="Now button" file="QTime/NowBtn" />

<doc-example title="Disable and readonly" file="QTime/DisableReadonly" />

### Model mask

The default model mask is `HH:mm` (or `HH:mm:ss` when using `with-seconds` prop), however you can use custom masks too.

The `mask` prop tokens can be found at [Quasar Utils > Date utils](/quasar-utils/date-utils#Format-for-display).

<doc-example title="Simple mask" file="QTime/MaskSimple" />

If you want to insert strings into your mask, make sure you escape them by surrounding them with `[` and `]`, otherwise the characters might be interpreted as format tokens.

<doc-example title="Mask with escaped characters" file="QTime/MaskEscape" />

Using the mask to connect a [QDate](/vue-components/date) and QTime to the same model:

<doc-example title="QDate and QTime on same model" file="QTime/MaskDateTime" />

### Custom ad-hoc locale

If, for some reason, you need to use a custom ad-hoc locale rather than the current Quasar Language Pack that has been set, you can use the `locale` prop:

<doc-example title="Custom ad-hoc locale" file="QTime/CustomLocale" />

### Coloring

<doc-example title="Coloring" file="QTime/Color" />

<doc-example title="Dark" file="QTime/Dark" dark />

### Limiting options
* You can use the `hour-options`, `minute-options` and `second-options` props to limit user selection to certain times.
* Alternatively, for a more in-depth way of limiting options, you can also supply a function (second example below) to `options-fn` prop.

<doc-example title="Options" file="QTime/Options" />

### Using with QInput

<doc-example title="Input" file="QTime/Input" />

Connecting a QDate and QTime with same model on a QInput:

<doc-example title="QDate and QTime with QInput" file="QTime/InputFull" />

More info: [QInput](/vue-components/input).

## QTime API
<doc-api file="QTime" />
