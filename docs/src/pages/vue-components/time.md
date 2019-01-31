---
title: QTime
---

The QTime component provides a method to input time.

## Installation
<doc-installation components="QTime" />

## Usage
<doc-example title="Basic" file="QTime/Basic" />

<doc-example title="Landscape" file="QTime/Landscape" />

::: tip
For landscape mode, you can use it along with `$q.screen` to make QTime responsive. Example: `:landscape="$q.screen.gt.sm"`.
:::

### Functionality
The 24 hour format is applied depending on the [Quasar Language Pack](/options/quasar-language-packs) that you've set, but you can also force it, like in the example below:

<doc-example title="24h Format" file="QTime/Format24h" />

Clicking on the "Now" button sets time to current user one:

<doc-example title="Now Button" file="QTime/NowBtn" />

<doc-example title="Disable and readonly" file="QTime/DisableReadonly" />

### Coloring

<doc-example title="Coloring" file="QTime/Color" />

<doc-example title="Dark" file="QTime/Dark" dark />

### Limiting options
::: tip
* You can use the `hour-options`, `minute-options` and `second-options` props to limit user selection to certain times.
* Alternatively, for a more in-depth way of limiting options, you can also supply a function (second example below) to `options-fn` prop.
:::

<doc-example title="Options" file="QTime/Options" />

### Using with QInput
<doc-example title="Input" file="QTime/Input" />

## QTime API
<doc-api file="QTime" />
