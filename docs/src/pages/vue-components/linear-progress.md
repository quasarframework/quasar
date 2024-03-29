---
title: Linear Progress
desc: The QLinearProgress Vue component displays a colored loading bar. The bar can either have a determinate progress or an indeterminate animation.
keys: QLinearProgress
examples: QLinearProgress
related:
  - /vue-components/circular-progress
  - /vue-components/inner-loading
  - /vue-components/spinners
  - /quasar-plugins/loading
  - /quasar-plugins/loading-bar
---

The QLinearProgress component displays a colored loading bar. The bar can either have a determinate progress or an indeterminate animation. It should be used to inform the user that an action is occurring in the background.

<DocApi file="QLinearProgress" />

## Usage

### Determined state
<DocExample title="Determined state" file="Determinate" />

### Indeterminate state
<DocExample title="Indeterminate state" file="Indeterminate" />

::: tip
For indeterminate state (above) or query state (below) you don't need to specify the `value` property.
:::

<DocExample title="Query state" file="Query" />

### Reversed

<DocExample title="Reverse progress direction" file="Reverse" />

### Style

<DocExample title="Custom height" file="CustomHeight" />

<DocExample title="Standard sizes" file="StandardSizes" />

<DocExample title="Stripe" file="Stripe" />

<DocExample title="Force dark mode" file="OnDarkBackground" />

### Buffer

<DocExample title="Buffer" file="Buffering" />

### With a label

To add a label to the progress bar you can use the default slot. Take care to:
  - use a `size` big enough to allow showing the label
  - set a text color for the label so that it is visible both on the filled and unfilled areas, or use text-shadow CSS, or use a QBadge as in the example below

<DocExample title="With a label" file="Label" />
