---
title: QDate
---

The QDate component provides a method to input date.

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

QDate requires a default year + month when model is unfilled (like `null`, `void 0`/`undefined`):

<doc-example title="Default Year Month" file="QDate/DefaultYearMonth" />

The first day of the week is applied depending on the [Quasar Language Pack](/options/quasar-language-packs) that you've set, but you can also force it, like in the example below:

<doc-example title="First Day Of Week" file="QDate/FirstDayOfWeek" />

Clicking on the "Today" button sets date to current user one. Requires the header, so you can't use it along with "minimal" mode:

<doc-example title="Today Button" file="QDate/TodayBtn" />

<doc-example title="Disable and readonly" file="QDate/DisableReadonly" />

### Coloring

<doc-example title="Coloring" file="QDate/Color" />

<doc-example title="Dark" file="QDate/Dark" dark />

### Highlighting events

::: tip
The first example is using an array and the second example is using a function.
:::

<doc-example title="Events" file="QDate/Events" />

<doc-example title="Event Color" file="QDate/EventColor" />

### Limiting options
::: tip
* You can use the `options` prop to limit user selection to certain times.
* Alternatively, for a more in-depth way of limiting options, you can also supply a function (second and third example below) to `options-fn` prop.
:::

<doc-example title="Options" file="QDate/Options" />

### With QSplitter
<doc-example title="With QSplitter and QTabPanels" file="QDate/Splitter" />

More info: [QSplitter](/vue-components/splitter), [QTabPanels](/vue-components/tab-panels).

### With QInput
<doc-example title="With QInput" file="QDate/Input" />

More info: [QInput](/vue-components/input), [QInput](/vue-components/input).

## API
<doc-api file="QDate" />
