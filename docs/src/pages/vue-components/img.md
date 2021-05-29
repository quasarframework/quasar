---
title: QImg
desc: The QImg Vue component makes working with responsive images easy and also adds a nice loading effect to them along with many other features like custom aspect ratio and captions.
related:
  - /vue-components/spinners
  - /options/transitions
---
The QImg component makes working with images (any picture format) easy and also adds a nice loading effect to it along with many other features (example: the ability to set an aspect ratio).

## QImg API
<doc-api file="QImg" />

## Usage

### Basic

<doc-example title="Basic" file="QImg/Basic" />

### Aspect ratio

<doc-example title="Custom aspect ratio" file="QImg/Ratio" />

### Captions

<doc-example title="Captions" file="QImg/Caption" />

### Image style <q-badge align="top" color="brand-primary" label="v1.4+" />

In the example below, we add a blur and sepia effect. Furthermore, we make use of the `rounded-borders` CSS helper class.

<doc-example title="Custom image style" file="QImg/CustomImageStyle" />

### Contain mode

Contain mode (example below) will force-show the whole image, which usually leads to empty space (horizontally or vertically) besides the image. The second image doesn't uses the contain mode and it's there for comparison purposes.

<doc-example title="Contain mode" file="QImg/Contain" />

### Transitions

Use the `basic` property which disables transitions (and it also renders the component faster):

<doc-example title="Transitions" file="QImg/Transitions" />

### Loading states

<doc-example title="Loading state" file="QImg/LoadingState" />

When you have big-sized images, you can use a placeholder image (recommended to be specified in base64 encoding) like in the example below. The placeholder will be displayed until the target image gets loaded. We're toggling the QImg tag so you can see the placeholder image in action.

<doc-example title="Placeholder source" file="QImg/PlaceholderSrc" />

<doc-example title="Error state" file="QImg/ErrorState" />

### Responsive

::: warning
To grasp the `sizes` and `srcset` properties, please read about native support on [responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Why_responsive_images) because **QImg relies on that entirely**.
:::

<doc-example title="Responsive" file="QImg/Responsive" />

::: tip
For `sizes` property, please read about Resolution Switching: [Different Sizes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Resolution_switching_Different_sizes).
:::

::: tip
For `srcset` property, please read about Resolution Switching: [Same size, different resolutions](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Resolution_switching_Same_size_different_resolutions).
:::

### Native context menu <q-badge align="top" color="brand-primary" label="v1.8.4+" />

In the example below we enable native context menu on the images.

::: warning
When you are using this option always take care to have the content of the `default` or `error` slots wrapped in a `div` element, or add a `all-pointer-events` class on the element.
:::

<doc-example title="Native context menu" file="QImg/ContextMenu" />
