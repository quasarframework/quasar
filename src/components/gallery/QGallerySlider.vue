<template>
  <q-slider
    ref="slider"
    @slide="__updateCurrentSlide"
    :dots="dots"
    :arrows="arrows"
    :fullscreen="fullscreen"
    :infinite="infinite"
    actions
    :animation="animation"
    :autoplay="autoplay"
    class="text-white bg-black q-gallery-slider"
  >
    <div
      v-for="(img, index) in src"
      :key="index"
      slot="slide"
      class="no-padding row items-center justify-center"
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

    <q-icon name="view_carousel" slot="action" @click="toggleQuickView()"></q-icon>

    <div
      class="q-gallery-slider-quickview"
      :class="{active: quickView, row: horizontalQuickView, horizontal: horizontalQuickView}"
      @touchstart.capture.stop
      @touchmove.capture.stop
      @touchend.capture.stop
      @mousedown.capture.stop
      @mousemove.capture.stop
      @mouseend.capture.stop
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
import sliderMixin from '../slider/slider-mixin'
import { QSlider } from '../slider'
import { QIcon } from '../icon'

export default {
  name: 'q-gallery-slider',
  components: {
    QSlider,
    QIcon
  },
  mixins: [sliderMixin],
  props: {
    src: {
      type: Array,
      required: true
    },
    arrows: {
      type: Boolean,
      default: true
    },
    actions: {
      type: Boolean,
      default: true
    },
    horizontalQuickView: Boolean
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
