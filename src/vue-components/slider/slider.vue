<template>
  <div class="quasar-slider" :class="{fullscreen: inFullscreen}">
    <div class="quasar-slider-inner">
      <div
        v-el:track
        class="quasar-slider-track"
        :class="{'with-arrows': arrows, 'with-toolbar': toolbar}"
        v-touch:pan="pan"
        v-touch-options:pan="{ direction: 'horizontal' }"
      >
        <slot name="slide"></slot>
      </div>
      <div
        v-if="arrows"
        class="quasar-slider-left-button row items-center justify-center"
        :class="{hidden: slide === 0}"
      >
        <i @click="goToSlide(slide - 1)">keyboard_arrow_left</i>
      </div>
      <div
        v-if="arrows"
        class="quasar-slider-right-button row items-center justify-center"
        :class="{hidden: slide === slidesNumber - 1}"
        @click="goToSlide(slide + 1)"
      >
        <i>keyboard_arrow_right</i>
      </div>
      <div v-if="toolbar" class="quasar-slider-toolbar row items-center justify-end">
        <div class="quasar-slider-dots auto row items-center justify-center">
          <i v-if="dots" v-for="n in slidesNumber" @click="goToSlide(n)">
            <span v-show="n !== slide">panorama_fish_eye</span>
            <span v-else>lens</span>
          </i>
        </div>
        <div class="row items-center">
          <slot name="action"></slot>
          <i v-if="fullscreen" @click="toggleFullscreen()">
            <span v-show="!inFullscreen">fullscreen</span>
            <span v-else>fullscreen_exit</span>
          </i>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrows: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    dots: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    fullscreen: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    actions: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  data () {
    return {
      position: 0,
      slide: 0,
      slidesNumber: 0,
      inFullscreen: false
    }
  },
  computed: {
    toolbar () {
      return this.dots || this.fullscreen || this.actions
    }
  },
  methods: {
    pan (event) {
      if (!this.hasOwnProperty('initialPosition')) {
        this.initialPosition = this.position
        Velocity(this.$els.track, 'stop')
      }

      let delta = event.deltaX

      if (
        this.slide === 0 && event.deltaX > 0 ||
        this.slide === this.slidesNumber - 1 && event.deltaX < 0
      ) {
        delta = delta / 10
      }

      this.position = this.initialPosition + delta / this.$els.track.offsetWidth * 100
      this.$els.track.style.transform = 'translateX(' + this.position + '%)'

      if (event.isFinal) {
        if (event.distance < 100) {
          this.goToSlide(this.slide)
        }
        else {
          this.goToSlide(event.deltaX < 0 ? this.slide + 1 : this.slide - 1)
        }
        delete this.initialPosition
      }
    },
    goToSlide (slide, noAnimation) {
      this.slide = Math.min(this.slidesNumber - 1, Math.max(0, slide))

      Velocity(this.$els.track, 'stop')
      Velocity(this.$els.track, {
        translateX: [-this.slide * 100 + '%', this.position + '%']
      }, noAnimation ? {duration: 0} : undefined)

      this.position = -this.slide * 100
    },
    toggleFullscreen () {
      if (this.inFullscreen) {
        window.history.go(-1)
        return
      }

      this.inFullscreen = true
      window.history.pushState({}, '')
      window.addEventListener('popstate', this.popState)
    },
    popState () {
      if (this.inFullscreen) {
        this.inFullscreen = false
      }
      window.removeEventListener('popstate', this.popState)
    }
  },
  ready () {
    this.slidesNumber = this.$els.track.children.length
  }
}
</script>
