<template>
  <div class="q-layout-padding docs-carousel" style="max-width: 600px; padding-top: 135px">
    <div class="fixed-top full-width z-top row items-center bg-grey-6 q-gutter-md">
      <q-btn label="fullscreen" color="purple" @click="$refs.carousel.toggleFullscreen()" />
      <q-select dense filled v-model="navigationPosition" :options="navigationPositions" label="Navigation position" style="min-width: 10em" />
      <q-select dense filled :options="[ 'regular', 'flat', 'outline', 'push', 'unelevated' ]" v-model="controlType" label="Control Type" style="min-width: 10em" />
      <q-toggle dense v-model="vertical" label="Vertical" />
      <q-toggle dense v-model="fullscreen" label="Fullscreen" />
      <q-toggle dense v-model="arrows" label="Arrows" />
      <q-toggle dense v-model="padding" label="Padding" />
    </div>

    <q-responsive :ratio="16/9">
      <q-carousel
        v-bind="props"
        ref="carousel"
        swipeable
        animated
        v-model:fullscreen="fullscreen"
        v-model="slide"
        control-color="orange"
        navigation
        navigation-icon="radio_button_unchecked"
        class="shadow-1 rounded-borders"
      >
        <q-carousel-slide :name="0" img-src="https://cdn.quasar.dev/img/parallax2.jpg" class="text-white">
          <q-scroll-area class="fit">
            <div class="column no-wrap flex-center test-scroll-container">
              <q-icon name="style" size="56px" />
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
            </div>
          </q-scroll-area>
        </q-carousel-slide>
        <q-carousel-slide name="x" img-src="https://cdn.quasar.dev/img/parallax2.jpg" class="text-white scroll text-center">
          <div class="test-scroll-container">
            <q-icon name="style" size="56px" />
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
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="1" class="column no-wrap flex-center">
          <q-icon name="live_tv" color="orange" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="2" class="column no-wrap flex-center">
          <q-icon name="layers" color="orange" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="3" class="column no-wrap flex-center">
          <q-icon name="terrain" color="orange" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-responsive>

    <div class="q-my-md">Using .q-carousel--padding:</div>
    <q-carousel
      v-bind="props"
      ref="carousel"
      swipeable
      animated
      :padding="false"
      v-model="slide"
      control-color="orange"
      navigation
      navigation-icon="radio_button_unchecked"
      class="shadow-1 rounded-borders q-mt-lg"
    >
      <q-carousel-slide :name="0" img-src="https://cdn.quasar.dev/img/parallax2.jpg" class="text-white q-pa-none">
        <q-scroll-area class="fit">
          <div class="column no-wrap flex-center test-scroll-container q-carousel--padding">
            <q-icon name="style" size="56px" />
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
          </div>
        </q-scroll-area>
      </q-carousel-slide>
      <q-carousel-slide name="x" img-src="https://cdn.quasar.dev/img/parallax2.jpg" class="text-white scroll text-center">
        <div class="test-scroll-container">
          <q-icon name="style" size="56px" />
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
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="1" class="column no-wrap flex-center q-pa-xl">
        <q-icon name="live_tv" color="orange" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="2" class="column no-wrap flex-center q-pa-xl">
        <q-icon name="layers" color="orange" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="column no-wrap flex-center q-pa-xl">
        <q-icon name="terrain" color="orange" size="56px" />
        <div class="q-mt-md text-center">
          {{ lorem }}
        </div>
      </q-carousel-slide>
    </q-carousel>

    <div class="caption">
      Scroll. Padding. Video on second slide.
    </div>
    <q-carousel
      v-bind="props"
      transition-prev="rotate"
      transition-next="rotate"
      swipeable
      :vertical="vertical"
      animated
      v-model="slide"
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
      v-bind="props"
      :vertical="vertical"
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
      v-bind="props"
      swipeable
      animated
      v-model="slide3"
      :autoplay="autoplay"
      navigation
      infinite
    >
      <q-carousel-slide :name="0" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

      <template v-slot:control>
        <q-carousel-control
          position="top-right"
          :offset="[18, 18]"
          class="text-white"
          style="background: rgba(0, 0, 0, .3); padding: 4px; border-radius: 4px"
        >
          <q-toggle dark color="amber" v-model="autoplay" label="Auto Play" />
        </q-carousel-control>
      </template>
    </q-carousel>

    <div class="caption">
      Carousel with Arrows, Navigation, and Slides with images.
    </div>
    <q-carousel
      v-bind="props"
      swipeable
      animated
      v-model="slide"
      thumbnails
      control-color="yellow"
      infinite
      v-model:fullscreen="full"
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
      v-bind="props"
      swipeable
      animated
      navigation
      navigation-icon="favorite"
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

      <template v-slot:control>
        <q-carousel-control position="bottom" :offset="[0, 0]">
          <q-linear-progress :value="(slide2 - 1) / 11" height="6px" stripe color="amber" />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script>
export default {
  data: () => ({
    controlType: 'flat',
    fullscreen: false,
    full: false,
    slide: 0,
    slide2: 1,
    slide3: 1,
    slide4: 'first',
    autoplay: true,
    arrows: true,
    padding: true,
    vertical: false,
    navigationPosition: void 0,
    navigationPositions: [ void 0, 'top', 'bottom', 'left', 'right' ],
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

  computed: {
    props () {
      return {
        controlType: this.controlType,
        vertical: this.vertical,
        arrows: this.arrows,
        padding: this.padding,
        navigationPosition: this.navigationPosition
      }
    }
  },

  methods: {
    onFullscreen (v) {
      console.log('fullscreen-toggle', v)
    }
  }
}
</script>

<style lang="sass">
.docs-carousel
  p.caption:not(:first-of-type)
    margin-top: 38px
  .custom-caption
    text-align: center
    padding: 12px
    color: white
.test-scroll-container
  background: rgba(255,255,255,.3)
  border-radius: $generic-border-radius
</style>
