---
title: QCarousel
---

Quasar Carousel component allows you to display more information with less real estate, using slides. Useful for creating Wizards too.

::: tip
The Carousel height is determined by the slide with biggest height, unless the `height` prop is used.
:::

## Installation
<doc-installation :components="['QCarousel', 'QCarouselControl', 'QCarouselSlide']" />

## Usage
::: tip
Basic Carousel. No controls or transitions. Slide position is controlled programmatically by user input.
:::
<doc-example title="Basic" file="QCarousel/Basic" />

::: tip
No controls or transitions. Just swipe between slides (you can use mouse to swipe too) to navigate left or right.
:::
<doc-example title="Swipeable" file="QCarousel/Swipeable" />

<doc-example title="Animated" file="QCarousel/Animated" />

<doc-example title="Transitions" file="QCarousel/Transitions" />

<doc-example title="Navigation and Control Color" file="QCarousel/Navigation" />

<doc-example title="Arrows" file="QCarousel/Arrows" />

<doc-example title="Prev and Next Icons" file="QCarousel/PrevAndNextIcons" />

<doc-example title="Infinite" file="QCarousel/Infinite" />

<doc-example title="Autoplay" file="QCarousel/Autoplay" />

::: tip
Using the property `thumbnails` only applies to slides that have images.
:::
::: tip
Don't use the property `navigation` with `thumbnails` as it supercedes and thumbnails will not be displayed.
:::
<doc-example title="Thumbnails" file="QCarousel/Thumbnails" />

<doc-example title="Padding" file="QCarousel/Padding" />

<doc-example title="Custom Captions" file="QCarousel/CustomCaptions" />

<doc-example title="Control Slot" file="QCarousel/ControlSlot" />

## API
<doc-api file="QCarousel" />
<doc-api file="QCarouselControl" />
<doc-api file="QCarouselSlide" />
