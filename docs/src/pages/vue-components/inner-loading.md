---
title: Inner Loading
---

The QInnerLoading component allows you to add a progress animation within a component. Much like the [Loading Plugin](/vue-components/loading), it's purpose is to offer visual confirmation to the user that some process is happening in the background, which takes an excessive amount of time. QInnerLoading will add an opaque overlay over the delayed element along with a [Spinner](/vue-components/spinners).

## Installation
<doc-installation components="QInnerLoading" />

If using a custom [Spinner](/vue-components/spinners), add it to the list of components. Example: `QSpinnerGears`.

## Usage

::: warning
In order for the spinner to be properly placed in the center of the element you want the loading display to show over, that element must have CSS position set to `relative` (or the `relative-position` CSS class declared).
:::

::: warning
QInnerLoading must be the last element inside it's parent so it can appear on top of the other content.
:::

<doc-example title="Basic" file="QInnerLoading/Basic" />

## QInnerLoading API
<doc-api file="QInnerLoading" />
