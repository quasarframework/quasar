<template>
  <div class="q-layout-padding docs-carousel" style="max-width: 700px">
    <p class="caption">
      Basic Carousel. No controls. Just swipe between slides (you can use
      mouse to swipe too) to navigate left or right.
    </p>
    <p>
      <q-toggle v-model="arrows" label="Show arrows" class="q-ml-sm" />
    </p>
    <q-btn label="fullscreen" class="fixed-top-left z-top" color="purple" @click="$refs.carousel.toggleFullscreen()" />
    <q-toggle v-model="fullscreen" label="Fullscreen" class="fixed-top-right z-top" />
    <q-carousel
      ref="carousel"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      :fullscreen.sync="fullscreen"
      v-model="slide"
      control-color="primary"
      navigation-icon="radio_button_unchecked"
      navigation
      padding
      :arrows="arrows"
      height="200px"
      class="bg-white shadow-1 rounded-borders"
    >
      <q-carousel-slide :name="0" class="column no-wrap flex-center">
        <q-icon name="style" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="1" class="column no-wrap flex-center">
        <q-icon name="live_tv" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="2" class="column no-wrap flex-center">
        <q-icon name="layers" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="column no-wrap flex-center">
        <q-icon name="terrain" color="primary" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
    </q-carousel>

    <p class="caption">
      Scroll. Padding. Video on second slide.
    </p>
    <q-carousel
      transition-prev="rotate"
      transition-next="rotate"
      swipeable
      animated
      v-model="slide"
      arrows
      padding
      height="200px"
      class="bg-grey-9 text-white shadow-1 rounded-borders"
    >
      <q-carousel-slide :name="0">
        {{ lorem }} {{ lorem }} {{ lorem }} {{ lorem }} {{ lorem }} {{ lorem }}
      </q-carousel-slide>
      <q-carousel-slide :name="1">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/k3_tw44QsZQ"
        />
      </q-carousel-slide>
      <q-carousel-slide :name="2">
        {{ lorem }} {{ lorem }} {{ lorem }} {{ lorem }} {{ lorem }} {{ lorem }}
      </q-carousel-slide>
      <q-carousel-slide :name="3">
        {{ lorem }} {{ lorem }} {{ lorem }} {{ lorem }} {{ lorem }} {{ lorem }}
      </q-carousel-slide>
    </q-carousel>

    <p class="caption">
      Example creating custom captions for each slide.
    </p>
    <q-carousel
      arrows
      animated
      v-model="slide4"
      height="400px"
    >
      <q-carousel-slide name="first" img-src="https://cdn.quasar.dev/img/mountains.jpg">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">
            First stop
          </div>
          <div class="text-subtitle1">
            Mountains
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="second" img-src="https://cdn.quasar.dev/img/parallax1.jpg">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">
            Second stop
          </div>
          <div class="text-subtitle1">
            Famous City
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="third" img-src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">
            Third stop
          </div>
          <div class="text-subtitle1">
            Famous Bridge
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <p class="caption">
      Carousel with Arrows, Navigation, and Slides with images.
    </p>
    <q-carousel
      swipeable
      animated
      v-model="slide3"
      arrows
      :autoplay="autoplay"
      navigation
      infinite
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide :name="0" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

      <q-carousel-control
        slot="control"
        position="top-right"
        :offset="[18, 18]"
        class="text-white"
        style="background: rgba(0, 0, 0, .3); padding: 4px; border-radius: 4px"
      >
        <q-toggle dark color="amber" v-model="autoplay" label="Auto Play" />
      </q-carousel-control>
    </q-carousel>

    <p class="caption">
      Carousel with Arrows, Navigation, and Slides with images.
    </p>
    <q-carousel
      swipeable
      animated
      v-model="slide"
      arrows
      thumbnails
      infinite
      :fullscreen.sync="full"
    >
      <q-carousel-slide :name="0" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

      <template v-slot:control>
        <q-carousel-control
          position="top-right"
          :offset="[38, 38]"
        >
          <q-btn
            push round dense color="white" text-color="primary"
            :icon="full ? 'fullscreen_exit' : 'fullscreen'"
            @click="full = !full"
          />
        </q-carousel-control>
      </template>
    </q-carousel>

    <p class="caption">
      Carousel with control slots.
    </p>
    <q-carousel
      swipeable
      animated
      navigation
      control-color="amber"
      navigation-icon="favorite"
      v-model="slide2"
    >
      <q-carousel-slide :name="0" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/quasar.jpg" />
      <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="5" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="6" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="7" img-src="https://cdn.quasar.dev/img/quasar.jpg" />
      <q-carousel-slide :name="8" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="9" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="10" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="11" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

      <q-carousel-control slot="control" position="bottom" :offset="[0, 0]">
        <q-linear-progress :value="(slide2 - 1) / 11" height="6px" stripe color="amber" />
      </q-carousel-control>
    </q-carousel>
  </div>
</template>

<script>
export default {
  data: () => ({
    fullscreen: false,
    full: false,
    slide: 0,
    slide2: 1,
    slide3: 1,
    slide4: 'first',
    autoplay: true,
    arrows: false,
    lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!',
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
.docs-carousel
  p.caption:not(:first-of-type)
    margin-top 38px
  .custom-caption
    text-align center
    padding 12px
    color white
</style>
