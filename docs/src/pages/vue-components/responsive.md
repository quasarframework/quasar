---
title: Responsive
badge: "v1.9+"
desc: The QResponsive Vue component forces the content to maintain an aspect ratio based on its width.
---

QResponsive is a component which forces the content to maintain an aspect ratio based on its width.

## QResponsive API
<doc-api file="QResponsive" />

## Usage

::: tip TIPS
* The component can be used with any content, as long you specify **only one direct child**. If you need multiple elements inside of it, wrap them in a `<div>`.
* It is your responsibility to make sure that your content won't overflow the container.
:::

::: warning
Do not use it on Quasar components that already have a `ratio` property, like QImg or QVideo, or on components that have a forced height.
:::

### Basic

<doc-example title="Basic usage" file="QResponsive/Basic" />

### Flex row

Note below that we are using a vertical alignment (`items-start`) other than the default (`stretch`), so that flexbox won't force the height on each QResponsive component.

<doc-example title="Basic usage" file="QResponsive/FlexRow" />

### On some components

Below are just a few examples. QResponsive is not restricted to only QCard and QCarousel.

<doc-example title="On QCard" file="QResponsive/Card" />

<doc-example title="On QCardSection" file="QResponsive/CardSection" />

<doc-example title="On QTable" file="QResponsive/Table" />

Notice that we will not supply a `height` prop to QCarousel when we use QResponsive on it, since it's QResponsive who will take care of that.

<doc-example title="On QCarousel" file="QResponsive/Carousel" />

### Maximum height

Apply the max height (or max width, etc etc) directly on the QResponsive component through a CSS class or inline. Remember that it is still your responsibility to ensure that the content won't overflow the container.

<doc-example title="On QCard" file="QResponsive/MaxHeight" />
