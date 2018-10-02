<template>
  <div class="layout-padding docs-carousel" style="max-width: 700px">
    <p class="caption">
      Basic Carousel. No controls. Just swipe between slides or
      use you mouse to drag slides to left or right.
    </p>
    <q-carousel
      swipeable
      animated
      v-model="slide"
      class="text-white"
    >
      <q-carousel-slide :name="1" class="bg-primary">
        {{ lorem }}
      </q-carousel-slide>
      <q-carousel-slide :name="2" class="bg-secondary">
        Slide 2
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="bg-tertiary">
        Slide 3
      </q-carousel-slide>
    </q-carousel>

    <p class="caption">Carousel with a base color, Arrows, Quick Navigation, and slides with images.</p>
    <q-carousel
      transition="q-transition--fade"
      swipeable
      animated
      color="white"
      v-model="slide"
      arrows
    >
      <q-carousel-slide :name="1" img-src="statics/mountains.jpg" />
      <q-carousel-slide :name="2" img-src="statics/parallax1.jpg" />
      <q-carousel-slide :name="3" img-src="statics/parallax2.jpg" />
    </q-carousel>
  </div>
</template>

<script>
import { easing } from 'quasar'

export default {
  data: () => ({
    slide: 1,
    autoplay: true,
    lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum! Repellendus sed totam earum exercitationem, veritatis rerum? Aliquid.',
    overshoot: easing.overshoot,
    colors: [
      'primary',
      'secondary',
      'yellow',
      'red',
      'orange',
      'grey-2'
    ],
    modal: false
  }),
  methods: {
    onFullscreen (v) {
      console.log('fullscreen-toggle', v)
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.docs-carousel
  p.caption:not(:first-of-type)
    margin-top 38px
  .custom-caption
    text-align center
    padding 12px
    color $grey-4
    background rgba(0, 0, 0, .5)
</style>
