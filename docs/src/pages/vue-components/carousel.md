---
title: Carousel
desc: The QCarousel Vue component allows you to display a series of slides, useful for wizards or an image gallery.
---

The QCarousel component allows you to display more information with less real estate, using slides. Useful for creating Wizards or an image gallery too.

## Installation
<doc-installation :components="['QCarousel', 'QCarouselControl', 'QCarouselSlide']" />

## Usage

::: danger
Please take notice of the Boolean `keep-alive` prop for QCarousel, if you need this behavior. Do NOT use Vue's native `<keep-alive>` component over QCarouselSlide.
:::

Below is an almost stripped down basic Carousel (it is just animated and only has custom transitions specified) with no navigation embedded. For this reason, we are controlling the current slide through the model.

<doc-example title="Basic" file="QCarousel/Basic" />

::: tip
In the example below there are just a few transitions demoed. For a complete list of transitions, head to the [Transitions](/options/transitions) page.
:::

<doc-example title="Transitions, bottom navigation, arrows and auto padding" file="QCarousel/Transitions" />

::: tip
In the examples above, you can also swipe with your finger (or swiping with the mouse -- clicking and quickly dragging to left/right then releasing).
:::

### Media content
<doc-example title="Image slides" file="QCarousel/ImageSlides" />

<doc-example title="Captions" file="QCarousel/Captions" />

<doc-example title="Video slides" file="QCarousel/VideoSlides" />

In the example below there are thumbnails being generated automatically. Thumbnails only applies to image slides.

<doc-example title="Thumbnails" file="QCarousel/Thumbnails" />

::: tip
Don't use the property `navigation` with `thumbnails` as it supercedes and thumbnails will not be displayed.
:::

### Infinite and autoplay
<doc-example title="Autoplay" file="QCarousel/InfiniteAutoplay" />

### Controls
<doc-example title="Controls" file="QCarousel/Controls" />

### Fullscreen
<doc-example title="Fullscreen" file="QCarousel/Fullscreen" />

## QCarousel API
<doc-api file="QCarousel" />

## QCarouselControl API
<doc-api file="QCarouselControl" />

## QCarouselSlide API
<doc-api file="QCarouselSlide" />
