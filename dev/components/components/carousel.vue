<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Basic Carousel. No controls. Just swipe between slides or
        use you mouse to drag slides to left or right.
      </p>
      <q-carousel class="text-white">
        <div slot="slide" class="bg-primary">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div slot="slide" class="bg-secondary">
          Slide 2
        </div>
        <div slot="slide" class="bg-tertiary">
          Slide 3
        </div>
      </q-carousel>

      <p class="caption">
        Carousel with Arrows, Dots and Fullscreen controls.
      </p>
      <q-carousel arrows dots fullscreen class="text-white" handle-arrow-keys>
        <div slot="slide" class="bg-primary">
          <div>Slide 1</div>
          <div v-for="n in 12">Line {{(n+2)}}</div>
        </div>
        <div slot="slide" class="bg-secondary">
          Slide 2
        </div>
        <div slot="slide" class="bg-tertiary">
          Slide 3
        </div>
      </q-carousel>

      <p class="caption">
        Carousel with Centered Content and Infinite Scroll
      </p>
      <q-carousel infinite arrows dots class="text-white">
        <div slot="slide" class="bg-primary centered">
          Slide 1
        </div>
        <div slot="slide" class="bg-secondary centered">
          Slide 2
        </div>
        <div slot="slide" class="bg-tertiary centered">
          Slide 3
        </div>
      </q-carousel>

      <p class="caption">
        Carousel with Infinite Scroll and Autoplay
      </p>
      <q-carousel infinite autoplay arrows dots class="text-white">
        <div slot="slide" class="bg-primary centered">
          Slide 1
        </div>
        <div slot="slide" class="bg-secondary centered">
          Slide 2
        </div>
        <div slot="slide" class="bg-tertiary centered">
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
        <div slot="slide" class="bg-primary">
          <div v-for="n in 20">Slide {{n}}</div>
        </div>
        <div slot="slide" class="bg-secondary">
          Slide 2
        </div>
        <div slot="slide" class="bg-tertiary">
          Slide 3
        </div>
        <q-icon slot="action" name="camera_enhance" />
        <q-icon slot="action" name="bookmark_border" />
        <q-icon slot="action" name="add_shopping_cart" />
      </q-carousel>

      <p class="caption">
        Launch Carousel on Fullscreen
      </p>
      <q-btn color="primary" class="glossy" @click="$refs.modal.open()">
        Launch
      </q-btn>
      <q-modal ref="modal" maximized>
        <q-carousel arrows dots class="text-white full-height">
          <div slot="slide" class="bg-primary centered">
            <h1>Slide 1</h1>
            <q-btn color="dark" class="glossy" @click="$refs.modal.close()">Close Me</q-btn>
          </div>
          <div slot="slide" class="bg-secondary centered">
            <h1>Slide 2</h1>
            <q-btn color="dark" class="glossy" @click="$refs.modal.close()">Close Me</q-btn>
          </div>
          <div slot="slide" class="bg-tertiary centered">
            <h1>Slide 3</h1>
            <q-btn color="dark" class="glossy" @click="$refs.modal.close()">Close Me</q-btn>
          </div>
        </q-carousel>
      </q-modal>
    </div>
  </div>
</template>

<script>
import { easing } from 'quasar'

export default {
  data: () => ({
    overshoot: easing.overshoot
  })
}
</script>
