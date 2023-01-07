---
title: Inner Loading
desc: The QInnerLoading Vue component allows you to add a loading indicator within a component in the form of a local overlay.
keys: QInnerLoading
examples: QInnerLoading
related:
  - /vue-components/linear-progress
  - /vue-components/circular-progress
  - /vue-components/spinners
  - /vue-components/skeleton
  - /quasar-plugins/loading
  - /quasar-plugins/loading-bar
---

The QInnerLoading component allows you to add a progress animation within a component. Much like the [Loading Plugin](/quasar-plugins/loading), its purpose is to offer visual confirmation to the user that some process is happening in the background, which takes an excessive amount of time. QInnerLoading will add an opaque overlay over the delayed element along with a [Spinner](/vue-components/spinners).

<doc-api file="QInnerLoading" />

## Usage

::: warning
In order for the spinner to be properly placed in the center of the element you want the loading display to show over, that element must have CSS position set to `relative` (or the `relative-position` CSS class declared).
:::

::: warning
QInnerLoading must be the last element inside its parent so it can appear on top of the other content.
:::

### Basic

<doc-example title="Basic" file="Basic" />

### Label <q-badge label="v2.2+" />

You can add a label when using the default slot, but you can also use the "label" props instead:

<doc-example title="Label props" file="LabelProp" />
