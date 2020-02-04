<template>
  <div class="q-layout-padding docs-carousel" style="max-width: 700px">
    <div class="caption">
      Basic Carousel. No controls. Just swipe between slides (you can use
      mouse to swipe too) to navigate left or right.
    </div>
    <div class="fixed-top full-width z-top row items-center justify-between bg-grey-6">
      <q-btn label="fullscreen" color="purple" @click="$refs.carousel.toggleFullscreen()" />
      <q-toggle v-model="vertical" label="Vertical swipe" class="q-ml-sm" />
      <q-select v-model="navigationPosition" :options="navigationPositions" label="Navigation position" dense borderless style="min-width: 15em" />
      <q-toggle v-model="fullscreen" label="Fullscreen" />
    </div>

    <q-toggle v-model="arrows" label="Show arrows" class="q-ml-sm" />
    <q-responsive :ratio="16/9">
      <q-carousel
        ref="carousel"
        swipeable
        animated
        :swipeable-vertical="vertical"
        transition-prev=""
        transition-next=""
        :fullscreen.sync="fullscreen"
        v-model="slide"
        control-color="primary"
        navigation
        navigation-icon="radio_button_unchecked"
        :navigation-position="navigationPosition"
        padding
        :arrows="arrows"
        :arrows-vertical="vertical"
        class="shadow-1 rounded-borders"
      >
        <q-carousel-slide :name="0" class="column no-wrap flex-center">
          <q-icon name="style" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
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
    </q-responsive>

    <div class="caption">
      Scroll. Padding. Video on second slide.
    </div>
    <q-carousel
      transition-prev="rotate"
      transition-next="rotate"
      swipeable
      :swipeable-vertical="vertical"
      animated
      v-model="slide"
      arrows
      :arrows-vertical="vertical"
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

    <div class="caption">
      Example creating custom captions for each slide.
    </div>
    <q-carousel
      arrows
      :arrows-vertical="vertical"
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

    <div class="caption">
      Carousel with Arrows, Navigation, and Slides with images.
    </div>
    <q-carousel
      swipeable
      :swipeable-vertical="vertical"
      transition-prev=""
      transition-next=""
      animated
      v-model="slide3"
      arrows
      :arrows-vertical="vertical"
      :autoplay="autoplay"
      navigation
      :navigation-position="navigationPosition"
      infinite
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

    <div class="caption">
      Carousel with Arrows, Navigation, and Slides with images.
    </div>
    <q-carousel
      swipeable
      :swipeable-vertical="vertical"
      animated
      v-model="slide"
      arrows
      :arrows-vertical="vertical"
      thumbnails
      :navigation-position="navigationPosition"
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

    <div class="caption">
      Carousel with control slots.
    </div>
    <q-carousel
      swipeable
      :swipeable-vertical="vertical"
      animated
      navigation
      navigation-icon="favorite"
      :navigation-position="navigationPosition"
      control-color="amber"
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
    vertical: false,
    navigationPosition: 'bottom',
    navigationPositions: ['top', 'bottom', 'left', 'right'],
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
