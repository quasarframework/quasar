---
title: Linear Progress
desc: The QLinearProgress Vue component displays a colored loading bar. The bar can either have a determinate progress or an indeterminate animation.
related:
  - /vue-components/circular-progress
  - /vue-components/inner-loading
  - /vue-components/spinners
  - /quasar-plugins/loading
  - /quasar-plugins/loading-bar
---

The QLinearProgress component displays a colored loading bar. The bar can either have a determinate progress or an indeterminate animation. It should be used to inform the user that an action is occurring in the background.


## Installation
<doc-installation components="QLinearProgress" />

## Usage
<doc-example title="Determined state" file="QLinearProgress/Determinate" />

<doc-example title="Indeterminate state" file="QLinearProgress/Indeterminate" />

::: tip
For indeterminate state (above) or query state (below) you don't need to specify the `value` property.
:::

<doc-example title="Query state" file="QLinearProgress/Query" />

<doc-example title="Reverse progress direction" file="QLinearProgress/Reverse" />

<doc-example title="Custom height" file="QLinearProgress/CustomHeight" />

<doc-example title="Standard sizes" file="QLinearProgress/StandardSizes" />

<doc-example title="Stripe" file="QLinearProgress/Stripe" />

<doc-example title="Buffer" file="QLinearProgress/Buffering" />

<doc-example title="On a dark background" file="QLinearProgress/OnDarkBackground" dark />

::: tip
To add a label to the progress bar you can use the default slot.
Take care to:
  - use a `size` big enough to allow showing the label
  - set a text color for the label so that it is visible both on the filled and unfilled areas
:::

<doc-example title="Progress label" file="QLinearProgress/Label" />

## QLinearProgress API
<doc-api file="QLinearProgress" />
