<template>
  <h4>Simple</h4>
  <quasar-slider class="text-white">
    <div slot="slide" class="bg-primary">
      Slide 1
    </div>
    <div slot="slide" class="bg-secondary">
      Slide 2
    </div>
    <div slot="slide" class="bg-tertiary">
      Slide 3
    </div>
  </quasar-slider>

  <h4>Arrows, dots, fullscreen</h4>
  <quasar-slider arrows dots fullscreen class="text-white">
    <div slot="slide" class="bg-primary">
      <div v-for="n in 20">Slide {{n}}</div>
    </div>
    <div slot="slide" class="bg-secondary">
      Slide 2
    </div>
    <div slot="slide" class="bg-tertiary">
      Slide 3
    </div>
  </quasar-slider>

  <h4>Arrows</h4>
  <quasar-slider arrows class="text-white">
    <div slot="slide" class="bg-primary">
      Slide 1
    </div>
    <div slot="slide" class="bg-secondary">
      Slide 2
    </div>
    <div slot="slide" class="bg-tertiary">
      Slide 3
    </div>
  </quasar-slider>

  <h4>Dots</h4>
  <quasar-slider dots class="text-white">
    <div slot="slide" class="bg-primary">
      Slide 1
    </div>
    <div slot="slide" class="bg-secondary">
      Slide 2
    </div>
    <div slot="slide" class="bg-tertiary">
      Slide 3
    </div>
  </quasar-slider>

  <h4>Centered</h4>
  <quasar-slider arrows dots class="text-white">
    <div slot="slide" class="bg-primary centered">
      Slide 1
    </div>
    <div slot="slide" class="bg-secondary centered">
      Slide 2
    </div>
    <div slot="slide" class="bg-tertiary centered">
      Slide 3
    </div>
  </quasar-slider>

  <h4>On full screen modal</h4>
  <button class="primary glossy" @click="launchModal()">Launch</button>

  <h4>With custom actions</h4>
  <quasar-slider arrows dots actions class="text-white">
    <div slot="slide" class="bg-primary">
      <div v-for="n in 20">Slide {{n}}</div>
    </div>
    <div slot="slide" class="bg-secondary">
      Slide 2
    </div>
    <div slot="slide" class="bg-tertiary">
      Slide 3
    </div>
    <i slot="action">camera_enhance</i>
    <i slot="action">bookmark_border</i>
    <i slot="action">add_shopping_cart</i>
  </quasar-slider>
</template>

<script>
import { Modal } from 'quasar'
import Slider from 'component/slider-modal.vue'

export default {
  methods: {
    launchModal () {
      Modal.create(Slider).set({
        maximized: true
      }).show()
    }
  }
}
</script>
