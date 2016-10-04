<template>
  <quasar-slider ref="slider" arrows fullscreen class="text-white bg-black quasar-gallery-slider">
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
      class="quasar-gallery-slider-overlay"
      :class="{active: quickView}"
      @click="toggleQuickView()"
    ></div>

    <i slot="action" @click="toggleQuickView()">view_carousel</i>

    <div
      class="quasar-gallery-slider-quickview"
      :class="{active: quickView}"
    >
      <div v-for="(img, index) in src" :key="index">
        <img
          :src="img"
          :class="{active: $refs.slider.slide === index}"
          @click="selectImage(index)"
        >
      </div>
    </div>
  </quasar-slider>
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
      quickView: false
    }
  },
  methods: {
    toggleQuickView () {
      this.quickView = !this.quickView
    },
    selectImage (index) {
      this.$refs.slider.goToSlide(index, true)
      this.toggleQuickView()
    }
  }
}
</script>
