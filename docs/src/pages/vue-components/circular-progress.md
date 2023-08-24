---
title: Circular Progress
desc: The QCircularProgress Vue component displays a colored circular loading indicator. The bar can either have a determinate progress, or an indeterminate animation.
keys: QCircularProgress
examples: QCircularProgress
related:
  - /vue-components/linear-progress
  - /vue-components/inner-loading
  - /vue-components/spinners
  - /vue-components/skeleton
  - /quasar-plugins/loading
  - /quasar-plugins/loading-bar
---

The QCircularProgress component displays a colored circular progress. The bar can either have a determinate progress, or an indeterminate animation. It should be used to inform the user that an action is occurring in the background.

<doc-api file="QCircularProgress" />

## Usage
By default, QCircularProgress inherits current text color (as arc progress color and inner label color) and current font size (as component size). For customization, you can use the size and color related props.

<doc-example title="Determined state" file="Determined" />

<doc-example title="Determinate and reverse" file="Reverse" />

<doc-example title="Offset angle" file="Angle" />

<doc-example title="Custom min/max (same model)" file="CustomMinMax" />

In the example below, `show-value` property also enables the default slot, so you can fill it with custom content, like even a QAvatar or a QTooltip. The `font-size` prop refers to the inner label font size.

<doc-example title="Show value" file="ShowValue" />

<doc-example title="Indeterminate state" file="Indeterminate" />

<doc-example title="Rounded arc of progress (v2.8.4+)" file="RoundedStyle" />

<doc-example title="Standard sizes" file="StandardSizes" />
