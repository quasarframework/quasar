---
title: QDate
related:
  - /vue-components/time
  - /quasar-utils/date-utils
  - /vue-components/field
---

The QDate component provides a method to input date. Currently it supports Gregorian (default) and Persian calendars.

::: tip
For handling date and/or time, also check out [Quasar Date Utils](/quasar-utils/date-utils).
:::

## Installation
<doc-installation components="QDate" />

## Usage

::: warning
Notice that the model is a String only.
:::

<doc-example title="Basic" file="QDate/Basic" />

::: tip
For landscape mode, you can use it along with `$q.screen` to make QDate responsive. Example: `:landscape="$q.screen.gt.xs"`. More info: [Quasar Screen Plugin](/options/screen-plugin).
:::

<doc-example title="Landscape" file="QDate/Landscape" />

### Functionality

QDate requires a default year + month when model is unfilled (like `null`, `void 0`/`undefined`).

<doc-example title="Default year month" file="QDate/DefaultYearMonth" />

The default view can be changed.

<doc-example title="Default view" file="QDate/DefaultView" />

The first day of the week is applied depending on the [Quasar Language Pack](/options/quasar-language-packs) that you've set, but you can also force it, like in the example below.

<doc-example title="First day of week" file="QDate/FirstDayOfWeek" />

Clicking on the "Today" button sets date to current user date. Requires the header, so you can't use it along with "minimal" mode:

<doc-example title="Today button" file="QDate/TodayBtn" />

<doc-example title="Disable and readonly" file="QDate/DisableReadonly" />

### Model mask

The default model mask is `YYYY/MM/DD`, however you can use custom ones too.

The `mask` prop tokens can be found at [Quasar Utils > Date utils](/quasar-utils/date-utils#Format-for-display).

<doc-example title="Simple mask" file="QDate/MaskSimple" />

If you want to insert strings into your mask, make sure you escape them by surrounding them with `[` and `]`, otherwise the characters might be interpreted as format tokens.

<doc-example title="Mask with escaped characters" file="QDate/MaskEscape" />

Using the mask to connect a QDate and [QTime](/vue-components/time) to the same model:

<doc-example title="QDate and QTime on same model" file="QDate/MaskDateTime" />

### Custom ad-hoc locale

If, for some reason, you need to use a custom ad-hoc locale rather than the current Quasar Language Pack that has been set, you can use the `locale` prop:

<doc-example title="Custom ad-hoc locale" file="QDate/CustomLocale" />

### Coloring

<doc-example title="Coloring" file="QDate/Color" />

<doc-example title="Dark" file="QDate/Dark" dark />

### Highlighting events

The first example is using an array and the second example is using a function.

<doc-example title="Events" file="QDate/Events" />

<doc-example title="Event color" file="QDate/EventColor" />

### Limiting options

* You can use the `options` prop to limit user selection to certain times.
* Alternatively, for a more in-depth way of limiting options, you can also supply a function (second and third example below) to `options-fn` prop.

<doc-example title="Options" file="QDate/Options" />

### With QSplitter and QTabPanels
<doc-example title="With QSplitter and QTabPanels" file="QDate/Splitter" />

More info: [QSplitter](/vue-components/splitter), [QTabPanels](/vue-components/tab-panels).

### With QInput

<doc-example title="With QInput" file="QDate/Input" />

Connecting a QDate and QTime with same model on a QInput:

<doc-example title="QDate and QTime with QInput" file="QDate/InputFull" />

More info: [QInput](/vue-components/input).

### Persian Calendar
::: tip
You can couple this with a Quasar [language pack](/options/quasar-language-packs) such as Persian (Farsi, `fa-ir`) to have the QDate strings translated too, for the full experience.
:::

<q-btn type="a" href="https://codepen.io/rstoenescu/pen/wOGpZg" target="_blank" label="See example" icon-right="launch" color="primary" />

## QDate API
<doc-api file="QDate" />
