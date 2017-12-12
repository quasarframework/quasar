<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Basic Carousel. No controls. Just swipe between slides or
        use you mouse to drag slides to left or right.
      </p>

      <q-carousel
        @slides-number="val => slidesNumber = val"
        height="500px"
        v-model="slide"
        :infinite="infinite"
        color="white"
        arrows
        class="bg-grey-2 shadow-4"
        style="border-radius: 5px"
        quick-nav
      >
        <q-carousel-slide img-src="/statics/mountains.jpg" />
        <q-carousel-slide>
          <q-video
            class="absolute-full"
            src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
          />
        </q-carousel-slide>
        <q-carousel-slide img-src="/statics/parallax1.jpg" />
        <q-carousel-slide img-src="/statics/parallax2.jpg" />

        <q-carousel-slide>
          <div v-for="n in 50">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </q-carousel-slide>
        <q-carousel-slide v-for="n in 7" :key="n" class="flex flex-center" :class="`bg-${colors[n % 5]}`">
          Slide 3-{{n}}
        </q-carousel-slide>

        <q-carousel-control slot="control" position="top-right" :offset="[18, 18]" class="text-white" style="background: rgba(0, 0, 0, .3); padding: 4px; border-radius: 4px">
          <q-toggle color="tertiary" v-model="infinite" label="Infinite" />
        </q-carousel-control>

        <q-carousel-control slot="control-left" slot-scope="carousel" position="top-left" :offset="[18, 18]">
          <q-btn size="sm" round color="tertiary" :icon="carousel.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="carousel.toggleFullscreen()" />
        </q-carousel-control>

        <q-carousel-control slot="control-nav" slot-scope="carousel" :offset="[18, 52]">
          <q-btn :disable="!carousel.canGoToPrevious" color="primary" icon="keyboard_arrow_left" round size="sm" @click="carousel.previous" class="q-mr-small" />
          <q-btn :disable="!carousel.canGoToNext" color="primary" icon="keyboard_arrow_right" round size="sm" @click="carousel.next" />
        </q-carousel-control>

        <q-carousel-control slot="progress" slot-scope="carousel" position="top">
          <q-progress :percentage="carousel.percentage" color="white" />
        </q-carousel-control>
      </q-carousel>

      <br><br>

      <q-carousel
        @slides-number="val => slidesNumber = val"
        height="300px"
        :infinite="infinite"
        color="white"
        arrows
        quick-nav
      >
        <q-carousel-slide img-src="/statics/mountains.jpg" class="text-white">
          <div v-for="n in 50">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </q-carousel-slide>
        <q-carousel-slide v-for="n in 7" :key="n" class="flex flex-center" :class="`bg-${colors[n % 5]}`">
          Slide 3-{{n}}
        </q-carousel-slide>

        <q-btn
          slot="quick-nav"
          slot-scope="props"
          color="white"
          flat
          size="sm"
          :label="`${props.slide + 1}`"
          @click="props.goToSlide()"
          :class="{inactive: !props.current}"
        />
      </q-carousel>

<!--
      <p class="caption">
        Carousel with Arrows, Dots and Fullscreen controls.
      </p>
      <q-carousel arrows dots fullscreen class="text-white" handle-arrow-keys>
        <q-carousel-slide class="bg-primary">
          <div>Slide 1</div>
          <div v-for="n in 12">Line {{(n+2)}}</div>
        </q-carousel-slide>
        <q-carousel-slide class="bg-secondary">
          Slide 2
        </q-carousel-slide>
        <q-carousel-slide class="bg-tertiary">
          Slide 3
        </q-carousel-slide>
      </q-carousel>
-->
<!--
      <p class="caption">
        Carousel with Centered Content and Infinite Scroll
      </p>
      <q-carousel infinite arrows dots class="text-white">
        <q-carousel-slide class="bg-primary centered">
          Slide 1
        </div>
        <q-carousel-slide class="bg-secondary centered">
          Slide 2
        </div>
        <q-carousel-slide class="bg-tertiary centered">
          Slide 3
        </div>
      </q-carousel>

      <p class="caption">
        Carousel with Infinite Scroll and Autoplay
      </p>
      <q-carousel infinite autoplay arrows dots class="text-white">
        <q-carousel-slide class="bg-primary centered">
          Slide 1
        </div>
        <q-carousel-slide class="bg-secondary centered">
          Slide 2
        </div>
        <q-carousel-slide class="bg-tertiary centered">
          Slide 3
        </div>
      </q-carousel>

      <p class="caption">
        Carousel with Custom Actions as Controls and Overshoot Easing
      </p>
      <q-carousel
        arrows
        dots
        actions
        :swipe-easing="overshoot"
        :easing="overshoot"
        class="text-white"
      >
        <q-carousel-slide class="bg-primary">
          <div v-for="n in 20">Slide {{n}}</div>
        </div>
        <q-carousel-slide class="bg-secondary">
          Slide 2
        </div>
        <q-carousel-slide class="bg-tertiary">
          Slide 3
        </div>
        <q-icon slot="action" name="camera_enhance" />
        <q-icon slot="action" name="bookmark_border" />
        <q-icon slot="action" name="add_shopping_cart" />
      </q-carousel>

      <p class="caption">
        Launch Carousel on Fullscreen
      </p>
      <q-btn color="primary" class="glossy" @click="$refs.modal.show()">
        Launch
      </q-btn>
      <q-modal ref="modal" maximized>
        <q-carousel arrows dots class="text-white full-height">
          <q-carousel-slide class="bg-primary centered">
            <h1>Slide 1</h1>
            <q-btn color="dark" class="glossy" @click="$refs.modal.hide()">Close Me</q-btn>
          </div>
          <q-carousel-slide class="bg-secondary centered">
            <h1>Slide 2</h1>
            <q-btn color="dark" class="glossy" @click="$refs.modal.hide()">Close Me</q-btn>
          </div>
          <q-carousel-slide class="bg-tertiary centered">
            <h1>Slide 3</h1>
            <q-btn color="dark" class="glossy" @click="$refs.modal.hide()">Close Me</q-btn>
          </div>
        </q-carousel>
      </q-modal>
    -->
    </div>
  </div>
</template>

<script>
import { easing } from 'quasar'

export default {
  data: () => ({
    slide: 0,
    infinite: true,
    slidesNumber: 0,
    overshoot: easing.overshoot,

    colors: [
      'primary',
      'secondary',
      'amber',
      'red',
      'orange',
      'grey-2'
    ]
  })
}
</script>
