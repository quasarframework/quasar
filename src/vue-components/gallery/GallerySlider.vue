<template>
  <q-slider
    ref="slider" arrows fullscreen
    @slide="__updateCurrentSlide"
    class="text-white bg-black q-gallery-slider"
  >
    <div
      v-for="(img, index) in src"
      :key="index"
      slot="slide"
      class="no-padding flex items-center justify-center"
    >
      <div class="full-width">
        <img :src="img">
      </div>
    </div>

    <div
      class="q-gallery-slider-overlay"
      :class="{active: quickView}"
      @click="toggleQuickView()"
    ></div>

    <i slot="action" @click="toggleQuickView()">view_carousel</i>

    <div
      class="q-gallery-slider-quickview"
      :class="{active: quickView}"
    >
      <div v-for="(img, index) in src" :key="index">
        <img
          :src="img"
          :class="{active: currentSlide === index}"
          @click="__selectImage(index)"
        >
      </div>
    </div>
  </q-slider>
</template>

<script>
export default {
  props: {
    src: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      quickView: false,
      currentSlide: 0
    }
  },
  methods: {
    toggleQuickView () {
      this.quickView = !this.quickView
    },
    goToSlide (index, noAnimation) {
      this.$refs.slider.goToSlide(index, noAnimation)
    },
    __selectImage (index) {
      this.goToSlide(index, true)
      this.toggleQuickView()
    },
    __updateCurrentSlide (value) {
      this.currentSlide = value
      this.$emit('slide', value)
    }
  }
}
</script>
