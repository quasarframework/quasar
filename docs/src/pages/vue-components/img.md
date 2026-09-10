---
title: Image
desc: The QImg Vue component makes working with responsive images easy and also adds a nice loading effect to them along with many other features like custom aspect ratio and captions.
keys: QImg
examples: QImg
related:
  - /vue-components/spinners
  - /options/transitions
---

The QImg component makes working with images (any picture format) easy and also adds a nice loading effect to it along with many other features (example: the ability to set an aspect ratio).

<DocApi file="QImg" />

## Usage

### Basic

<DocExample title="Basic" file="Basic" />

### Aspect ratio

<DocExample title="Custom aspect ratio" file="Ratio" />

### Captions

<DocExample title="Captions" file="Caption" />

### Image style

In the example below, we add a blur and sepia effect. Furthermore, we make use of the `rounded-borders` CSS helper class.

<DocExample title="Custom image style" file="CustomImageStyle" />

### Fit mode

There are multiple ways in which the image can be displayed through the `fit` property: 'cover', 'fill' (default), 'contain', 'none', 'scale-down'. It is basically the same thing as the CSS prop called [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).

Some modes lead to empty space (horizontally or vertically) besides the image.

You can also configure the position through `position` property, which is equivalent to the CSS [object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) one. Its default value is "50% 50%".

<DocExample title="Fit modes" file="FitModes" />

### Loading states

<DocExample title="Loading state" file="LoadingState" />

When you have big-sized images, you can use a placeholder image (recommended to be specified in base64 encoding) like in the example below. The placeholder will be displayed until the target image gets loaded. We're toggling the QImg tag so you can see the placeholder image in action.

<DocExample title="Placeholder source" file="PlaceholderSrc" />

<DocExample title="Error state" file="ErrorState" />

### Responsive

::: warning
To grasp the `sizes` and `srcset` properties, please read about native support on [responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Why_responsive_images) because **QImg relies on that entirely**.
:::

<DocExample title="Responsive" file="Responsive" />

::: tip
For `sizes` property, please read about Resolution Switching: [Different Sizes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Resolution_switching_Different_sizes).
:::

::: tip
For `srcset` property, please read about Resolution Switching: [Same size, different resolutions](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Resolution_switching_Same_size_different_resolutions).
:::

### No native context menu

In the example below we disable the native context menu on the images.

::: warning
When you are using this option always take care to have the content of the `default` or `error` slots wrapped in a `div` element, or add a `all-pointer-events` class on the element.
:::

<DocExample title="Native context menu" file="ContextMenu" />

## Server-side rendering <q-badge label="v2.32+" />

On SSR/SSG, QImg puts the `<img>` into the server HTML whenever you have declared the shape of its box, meaning when any of `ratio`, `initial-ratio` or `height` is set. The browser then discovers and fetches the image while parsing the HTML, long before hydration, and paints it as it arrives, like a native `<img>`. The loading state (spinner or `loading` slot) only shows up if the image is still loading once the page gets hydrated, and the `load`/`error` events are emitted at hydration for an image that has already settled.

Without any of them, the box uses a default 16:9 ratio until the natural ratio of the image is known, so a server-rendered image would visibly change shape at hydration. QImg therefore defers such an image until hydration, unless you set `ssr-prerender` and accept that box change.

::: tip
For an above-the-fold image, also set `loading="eager"` and `fetchpriority="high"` so that the browser does not delay its fetch.
:::

## Accessibility <q-badge label="v2.25+" />

The QImg wrapper carries `role="img"` with its accessible name taken from the `alt` prop — provide `alt` for any image that carries meaning. For a purely decorative image set `alt=""`, exactly as you would on a native `<img>`: the wrapper then claims no role at all (the img role requires a name) and screen readers skip it. Omitting `alt` entirely does the same thing. Note that the loading and error state changes are not announced to assistive technology.
