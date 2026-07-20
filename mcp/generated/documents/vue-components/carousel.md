---
title: Carousel
description: The QCarousel Vue component allows you to display a series of slides, useful for wizards or an image gallery.
canonical: https://quasar.dev/vue-components/carousel
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QCarousel](../../api/QCarousel.md)
- [QCarouselControl](../../api/QCarouselControl.md)
- [QCarouselSlide](../../api/QCarouselSlide.md)

The QCarousel component allows you to display more information with less real estate, using slides. Useful for creating Wizards or an image gallery too.

**API reference:** [QCarousel](../../api/QCarousel.md)

**API reference:** [QCarouselControl](../../api/QCarouselControl.md)

**API reference:** [QCarouselSlide](../../api/QCarouselSlide.md)

## Usage

::: tip
If the QCarouselSlide content also has images and you want to use swipe actions to navigate, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

::: danger Keep Alive

- Please take notice of the Boolean `keep-alive` prop for QCarousel, if you need this behavior. Do NOT use Vue's native `<keep-alive>` component over QCarouselSlide.
- Should you need the `keep-alive-include` or `keep-alive-exclude` props then the QCarouselSlide `name`s must be valid Vue component names (no spaces allowed, don't start with a number etc).

:::

### Basic

Below is an almost stripped down basic Carousel (it is just animated and only has custom transitions specified) with no navigation embedded. For this reason, we are controlling the current slide through the model.

**Example: Basic**

Source: [Basic.vue](../../examples/QCarousel/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      control-color="primary"
      class="rounded-borders"
    >
      <q-carousel-slide name="style" class="column no-wrap flex-center">
        <q-icon name="style" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #region -->
      <q-carousel-slide name="tv" class="column no-wrap flex-center">
        <q-icon name="live_tv" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="layers" class="column no-wrap flex-center">
        <q-icon name="layers" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="map" class="column no-wrap flex-center">
        <q-icon name="terrain" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #endregion -->
    </q-carousel>

    <div class="row justify-center">
      <q-btn-toggle
        glossy
        v-model="slide"
        :options="[
          { label: 1, value: 'style' },
          { label: 2, value: 'tv' },
          { label: 3, value: 'layers' },
          { label: 4, value: 'map' }
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref('style')
const lorem =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo provident incidunt ducimus iusto perferendis porro earum. Totam, numquam?'
</script>
````

### Transitions

In the example below:

- There are just a few transitions demoed. For a complete list of transitions, head to the [Transitions](/options/transitions) page.
- You can also swipe with your finger (or swiping with the mouse -- clicking and quickly dragging to left/right then releasing).

**Example: Transitions, bottom navigation, arrows and auto padding**

Source: [Transitions.vue](../../examples/QCarousel/Transitions.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-carousel
        v-model="slide"
        transition-prev="scale"
        transition-next="scale"
        swipeable
        animated
        control-color="white"
        navigation
        padding
        arrows
        height="300px"
        class="bg-primary text-white shadow-1 rounded-borders"
      >
        <q-carousel-slide name="style" class="column no-wrap flex-center">
          <q-icon name="style" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <!-- #region -->
        <q-carousel-slide name="tv" class="column no-wrap flex-center">
          <q-icon name="live_tv" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="layers" class="column no-wrap flex-center">
          <q-icon name="layers" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="map" class="column no-wrap flex-center">
          <q-icon name="terrain" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <!-- #endregion -->
      </q-carousel>

      <q-carousel
        v-model="slide"
        transition-prev="jump-right"
        transition-next="jump-left"
        swipeable
        animated
        control-color="white"
        prev-icon="arrow_left"
        next-icon="arrow_right"
        navigation-icon="radio_button_unchecked"
        navigation
        padding
        arrows
        height="300px"
        class="bg-purple text-white shadow-1 rounded-borders"
      >
        <q-carousel-slide name="style" class="column no-wrap flex-center">
          <q-icon name="style" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <!-- #region -->
        <q-carousel-slide name="tv" class="column no-wrap flex-center">
          <q-icon name="live_tv" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="layers" class="column no-wrap flex-center">
          <q-icon name="layers" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="map" class="column no-wrap flex-center">
          <q-icon name="terrain" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <!-- #endregion -->
      </q-carousel>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref('style')
const lorem =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
</script>
````

### Vertical

**Example: Vertical mode**

Source: [Vertical.vue](../../examples/QCarousel/Vertical.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel
      v-model="slide"
      vertical
      transition-prev="slide-down"
      transition-next="slide-up"
      swipeable
      animated
      control-color="white"
      navigation-icon="radio_button_unchecked"
      navigation
      padding
      arrows
      height="300px"
      class="bg-purple text-white shadow-1 rounded-borders"
    >
      <q-carousel-slide name="style" class="column no-wrap flex-center">
        <q-icon name="style" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #region -->
      <q-carousel-slide name="tv" class="column no-wrap flex-center">
        <q-icon name="live_tv" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="layers" class="column no-wrap flex-center">
        <q-icon name="layers" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="map" class="column no-wrap flex-center">
        <q-icon name="terrain" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref('style')
const lorem =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
</script>
````

### Control type

The notion of "control" here refers to the arrows and navigation buttons. Since they are buttons, you can also pick their type to better match your design. You also benefit from the `control-color` and `control-text-color` props.

**Example: Control Type**

Source: [ControlType.vue](../../examples/QCarousel/ControlType.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-option-group
      v-model="controlType"
      :options="controlTypeOptions"
      color="purple"
      inline
      class="q-mb-md"
    />

    <q-carousel
      v-model="slide"
      swipeable
      animated
      :control-type="controlType"
      control-color="purple"
      navigation
      padding
      arrows
      height="300px"
      class="text-purple rounded-borders"
    >
      <q-carousel-slide name="style" class="column no-wrap flex-center">
        <q-icon name="style" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #region -->
      <q-carousel-slide name="tv" class="column no-wrap flex-center">
        <q-icon name="live_tv" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="layers" class="column no-wrap flex-center">
        <q-icon name="layers" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="map" class="column no-wrap flex-center">
        <q-icon name="terrain" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const controlType = ref('flat')
const controlTypeOptions = [
  { value: 'regular', label: 'regular' },
  { value: 'unelevated', label: 'unelevated' },
  { value: 'flat', label: 'flat (default)' },
  { value: 'outline', label: 'outline' },
  { value: 'push', label: 'push' }
]

const slide = ref('style')
const lorem =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
</script>
````

### Navigation position

**Example: Navigation position**

Source: [NavigationPosition.vue](../../examples/QCarousel/NavigationPosition.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-option-group
      v-model="navPos"
      :options="navigationPositions"
      color="purple"
      inline
      class="q-mb-md"
    />

    <q-carousel
      v-model="slide"
      swipeable
      animated
      :navigation-position="navPos"
      navigation
      padding
      height="300px"
      class="bg-purple text-white rounded-borders"
    >
      <q-carousel-slide name="style" class="column no-wrap flex-center">
        <q-icon name="style" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #region -->
      <q-carousel-slide name="tv" class="column no-wrap flex-center">
        <q-icon name="live_tv" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="layers" class="column no-wrap flex-center">
        <q-icon name="layers" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="map" class="column no-wrap flex-center">
        <q-icon name="terrain" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navPos = ref('bottom')
const navigationPositions = [
  { value: 'top', label: 'top' },
  { value: 'right', label: 'right' },
  { value: 'bottom', label: 'bottom (default)' },
  { value: 'left', label: 'left' }
]

const slide = ref('style')
const lorem =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
</script>
````

### Custom navigation

For a full list of properties of the `navigation-icon` slot, please consult the API card.

**Example: Custom navigation**

Source: [CustomNavigation.vue](../../examples/QCarousel/CustomNavigation.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="white"
      navigation
      padding
      arrows
      height="300px"
      class="bg-primary text-white shadow-1 rounded-borders"
    >
      <template v-slot:navigation-icon="{ active, btnProps, onClick }">
        <q-btn
          v-if="active"
          size="lg"
          icon="home"
          color="yellow"
          flat
          round
          dense
          @click="onClick"
        />
        <q-btn
          v-else
          size="sm"
          :icon="btnProps.icon"
          color="white"
          flat
          round
          dense
          @click="onClick"
        />
      </template>

      <q-carousel-slide name="style" class="column no-wrap flex-center">
        <q-icon name="style" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #region -->
      <q-carousel-slide name="tv" class="column no-wrap flex-center">
        <q-icon name="live_tv" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="layers" class="column no-wrap flex-center">
        <q-icon name="layers" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="map" class="column no-wrap flex-center">
        <q-icon name="terrain" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref('style')
const lorem =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
</script>
````

### Auto padding

Below is an example with which you can play with different QCarousel settings so you can see the padding (or lack of) in action:

**Example: Padding**

Source: [AutoPadding.vue](../../examples/QCarousel/AutoPadding.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toggle
      v-model="padding"
      label="Padding"
      color="purple"
      class="text-weight-bold"
    />

    <q-toggle v-model="vertical" label="Vertical" color="purple" />

    <q-toggle v-model="arrows" label="Arrows" color="purple" />

    <q-toggle v-model="navigation" label="Navigation" color="purple" />

    <div class="row items-center q-mb-md">
      <div>Navigation position:</div>
      <q-option-group
        v-model="navPos"
        :options="navigationPositions"
        color="purple"
        inline
      />
    </div>

    <q-carousel
      v-model="slide"
      swipeable
      animated
      :padding="padding"
      :vertical="vertical"
      :arrows="arrows"
      :navigation="navigation"
      :navigation-position="navPos"
      height="300px"
      class="bg-purple text-white rounded-borders"
    >
      <q-carousel-slide name="style" class="column no-wrap flex-center">
        <q-icon name="style" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #region -->
      <q-carousel-slide name="tv" class="column no-wrap flex-center">
        <q-icon name="live_tv" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="layers" class="column no-wrap flex-center">
        <q-icon name="layers" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="map" class="column no-wrap flex-center">
        <q-icon name="terrain" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const navPos = ref('bottom')
const vertical = ref(false)

watch(vertical, val => {
  navPos.value = val ? 'right' : 'bottom'
})

const padding = ref(true)
const arrows = ref(true)
const navigation = ref(true)

const navigationPositions = [
  { value: 'top', label: 'top' },
  { value: 'right', label: 'right' },
  { value: 'bottom', label: 'bottom (default)' },
  { value: 'left', label: 'left' }
]

const slide = ref('style')
const lorem =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
</script>
````

### Media content

**Example: Image slides**

Source: [ImageSlides.vue](../../examples/QCarousel/ImageSlides.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel animated v-model="slide" arrows navigation infinite>
      <q-carousel-slide
        :name="1"
        img-src="https://cdn.quasar.dev/img/mountains.jpg"
      />
      <!-- #region -->
      <q-carousel-slide
        :name="2"
        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
      />
      <q-carousel-slide
        :name="3"
        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
      <q-carousel-slide
        :name="4"
        img-src="https://cdn.quasar.dev/img/quasar.jpg"
      />
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
</script>
````

**Example: Multi-image slides**

Source: [MultiImageSlides.vue](../../examples/QCarousel/MultiImageSlides.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="amber"
      navigation
      padding
      arrows
      height="300px"
      class="bg-grey-9 shadow-2 rounded-borders"
    >
      <q-carousel-slide :name="1" class="column no-wrap">
        <div
          class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
        >
          <q-img
            class="rounded-borders col-6 full-height"
            src="https://cdn.quasar.dev/img/mountains.jpg"
          />
          <q-img
            class="rounded-borders col-6 full-height"
            src="https://cdn.quasar.dev/img/parallax1.jpg"
          />
        </div>
      </q-carousel-slide>
      <!-- #region -->
      <q-carousel-slide :name="2" class="column no-wrap">
        <div
          class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
        >
          <q-img
            class="rounded-borders col-6 full-height"
            src="https://cdn.quasar.dev/img/parallax2.jpg"
          />
          <q-img
            class="rounded-borders col-6 full-height"
            src="https://cdn.quasar.dev/img/quasar.jpg"
          />
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="column no-wrap">
        <div
          class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
        >
          <q-img
            class="rounded-borders col-6 full-height"
            src="https://cdn.quasar.dev/img/cat.jpg"
          />
          <q-img
            class="rounded-borders col-6 full-height"
            src="https://cdn.quasar.dev/img/linux-avatar.png"
          />
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="4" class="column no-wrap">
        <div
          class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
        >
          <q-img
            class="rounded-borders col-6 full-height"
            src="https://cdn.quasar.dev/img/material.png"
          />
          <q-img
            class="rounded-borders col-6 full-height"
            src="https://cdn.quasar.dev/img/donuts.png"
          />
        </div>
      </q-carousel-slide>
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
</script>
````

**Example: Captions**

Source: [Captions.vue](../../examples/QCarousel/Captions.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel arrows animated v-model="slide" height="400px">
      <q-carousel-slide
        name="first"
        img-src="https://cdn.quasar.dev/img/mountains.jpg"
      >
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">First stop</div>
          <div class="text-subtitle1">Mountains</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide
        name="second"
        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
      >
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Second stop</div>
          <div class="text-subtitle1">Famous City</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide
        name="third"
        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
      >
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Third stop</div>
          <div class="text-subtitle1">Famous Bridge</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref('first')
</script>

<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)
</style>
````

**Example: Video slides**

Source: [VideoSlides.vue](../../examples/QCarousel/VideoSlides.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-carousel animated v-model="slide" infinite>
      <q-carousel-slide name="soft-jazz">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/k3_tw44QsZQ"
        />
      </q-carousel-slide>

      <q-carousel-slide name="Rihanna">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/kOkQ4T5WO9E"
        />
      </q-carousel-slide>

      <q-carousel-slide name="ibiza">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/p87miJIYEEk"
        />
      </q-carousel-slide>
    </q-carousel>

    <div class="row justify-center">
      <q-btn-toggle
        glossy
        v-model="slide"
        :options="[
          { label: 'Soft Jazz', value: 'soft-jazz' },
          { label: 'Rihanna', value: 'Rihanna' },
          { label: 'Ibiza Mix', value: 'ibiza' }
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref('Rihanna')
</script>
````

In the example below there are thumbnails being generated automatically. Thumbnails only applies to image slides.

**Example: Thumbnails**

Source: [Thumbnails.vue](../../examples/QCarousel/Thumbnails.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel swipeable animated v-model="slide" thumbnails infinite>
      <q-carousel-slide
        :name="1"
        img-src="https://cdn.quasar.dev/img/mountains.jpg"
      />
      <!-- #region -->
      <q-carousel-slide
        :name="2"
        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
      />
      <q-carousel-slide
        :name="3"
        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
      <q-carousel-slide
        :name="4"
        img-src="https://cdn.quasar.dev/img/quasar.jpg"
      />
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
</script>
````

::: tip
Don't use the property `navigation` along with `thumbnails` as the first supercedes the latter so the thumbnails will not be displayed.
:::

### Infinite and autoplay

You can pause autoplay when the pointer is over the carousel or over a region of interest.

**Example: Autoplay**

Source: [InfiniteAutoplay.vue](../../examples/QCarousel/InfiniteAutoplay.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
    >
      <q-carousel-slide
        :name="1"
        img-src="https://cdn.quasar.dev/img/mountains.jpg"
      />
      <!-- #region -->
      <q-carousel-slide
        :name="2"
        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
      />
      <q-carousel-slide
        :name="3"
        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
      <q-carousel-slide
        :name="4"
        img-src="https://cdn.quasar.dev/img/quasar.jpg"
      />
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
const autoplay = ref(true)
</script>
````

### Controls

**Example: Controls**

Source: [Controls.vue](../../examples/QCarousel/Controls.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel
      swipeable
      animated
      v-model="slide"
      :autoplay="autoplay"
      ref="carouselRef"
      infinite
    >
      <q-carousel-slide
        :name="1"
        img-src="https://cdn.quasar.dev/img/mountains.jpg"
      />
      <!-- #region -->
      <q-carousel-slide
        :name="2"
        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
      />
      <q-carousel-slide
        :name="3"
        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
      <q-carousel-slide
        :name="4"
        img-src="https://cdn.quasar.dev/img/quasar.jpg"
      />
      <!-- #endregion -->

      <template v-slot:control>
        <q-carousel-control
          position="top-right"
          :offset="[18, 18]"
          class="text-white rounded-borders"
          style="background: rgba(0, 0, 0, 0.3); padding: 4px 8px"
        >
          <q-toggle
            dense
            dark
            color="orange"
            v-model="autoplay"
            label="Auto Play"
          />
        </q-carousel-control>

        <q-carousel-control
          position="bottom-right"
          :offset="[18, 18]"
          class="q-gutter-xs"
        >
          <q-btn
            push
            round
            dense
            color="orange"
            text-color="black"
            icon="arrow_left"
            @click="$refs.carouselRef.previous()"
          />
          <q-btn
            push
            round
            dense
            color="orange"
            text-color="black"
            icon="arrow_right"
            @click="$refs.carouselRef.next()"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
const autoplay = ref(false)
</script>
````

### With QScrollArea

Please note how [QScrollArea](/vue-components/scroll-area) is used in the two examples below. Also note the `q-carousel--padding` CSS helper class in the second example.

**Example: With QScrollArea and padding**

Source: [WithScrollareaPadding.vue](../../examples/QCarousel/WithScrollareaPadding.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel
      v-model="slide"
      swipeable
      animated
      padding
      arrows
      navigation
      navigation-icon="radio_button_unchecked"
      height="300px"
      class="bg-purple text-white rounded-borders"
    >
      <q-carousel-slide name="style" class="text-center">
        <q-scroll-area class="fit">
          <q-icon name="style" size="56px" />
          <div class="q-mt-md">
            {{ lorem }}
          </div>
          <!-- #region -->
          <div class="q-mt-md">
            {{ lorem }}
          </div>
          <div class="q-mt-md">
            {{ lorem }}
          </div>
          <div class="q-mt-md">
            {{ lorem }}
          </div>
          <!-- #endregion -->
        </q-scroll-area>
      </q-carousel-slide>

      <!-- #region -->
      <q-carousel-slide name="tv" class="text-center">
        <q-scroll-area class="fit">
          <q-icon name="live_tv" size="56px" />
          <div class="q-mt-md">
            {{ lorem }}
          </div>
        </q-scroll-area>
      </q-carousel-slide>

      <q-carousel-slide name="layers" class="text-center">
        <q-scroll-area class="fit">
          <q-icon name="layers" size="56px" />
          <div class="q-mt-md">
            {{ lorem }}
          </div>
        </q-scroll-area>
      </q-carousel-slide>

      <q-carousel-slide name="map" class="text-center">
        <q-scroll-area class="fit">
          <q-icon name="terrain" size="56px" />
          <div class="q-mt-md">
            {{ lorem }}
          </div>
        </q-scroll-area>
      </q-carousel-slide>
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref('style')
const lorem =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
</script>
````

**Example: With QScrollArea on whole slide**

Source: [WithScrollareaFull.vue](../../examples/QCarousel/WithScrollareaFull.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel
      v-model="slide"
      swipeable
      animated
      arrows
      navigation
      navigation-icon="radio_button_unchecked"
      control-type="regular"
      control-color="orange"
      control-text-color="grey-8"
      height="300px"
      class="bg-purple text-white rounded-borders"
    >
      <q-carousel-slide name="style" class="q-pa-none">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center q-carousel--padding">
            <q-icon name="style" size="56px" />
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <!-- #region -->
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <!-- #endregion -->
          </div>
        </q-scroll-area>
      </q-carousel-slide>

      <!-- #region -->
      <q-carousel-slide name="tv" class="q-pa-none">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center q-carousel--padding">
            <q-icon name="live_tv" size="56px" />
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
          </div>
        </q-scroll-area>
      </q-carousel-slide>

      <q-carousel-slide name="layers" class="q-pa-none">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center q-carousel--padding">
            <q-icon name="layers" size="56px" />
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
          </div>
        </q-scroll-area>
      </q-carousel-slide>

      <q-carousel-slide name="map" class="q-pa-none">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center q-carousel--padding">
            <q-icon name="terrain" size="56px" />
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
            <div class="q-mt-md">
              {{ lorem }}
            </div>
          </div>
        </q-scroll-area>
      </q-carousel-slide>
      <!-- #endregion -->
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref('style')
const lorem =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
</script>
````

### Fullscreen

**Example: Fullscreen**

Source: [Fullscreen.vue](../../examples/QCarousel/Fullscreen.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-carousel
      swipeable
      animated
      arrows
      v-model="slide"
      v-model:fullscreen="fullscreen"
      infinite
    >
      <q-carousel-slide
        :name="1"
        img-src="https://cdn.quasar.dev/img/mountains.jpg"
      />
      <!-- #region -->
      <q-carousel-slide
        :name="2"
        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
      />
      <q-carousel-slide
        :name="3"
        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
      <q-carousel-slide
        :name="4"
        img-src="https://cdn.quasar.dev/img/quasar.jpg"
      />
      <!-- #endregion -->

      <template v-slot:control>
        <q-carousel-control position="bottom-right" :offset="[18, 18]">
          <q-btn
            push
            round
            dense
            color="white"
            text-color="primary"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="fullscreen = !fullscreen"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
const fullscreen = ref(false)
</script>
````
