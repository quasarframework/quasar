<template>
  <div class="q-slider" :class="{fullscreen: inFullscreen}">
    <div class="q-slider-inner">
      <div
        ref="track"
        class="q-slider-track"
        :style="trackPosition"
        :class="{'with-arrows': arrows, 'with-toolbar': toolbar}"
        v-touch-pan.horizontal="__pan"
      >
        <slot name="slide"></slot>
      </div>
      <div
        v-if="arrows"
        class="q-slider-left-button row items-center justify-center"
        :class="{hidden: slide === 0}"
      >
        <i @click="goToSlide(slide - 1)">keyboard_arrow_left</i>
      </div>
      <div
        v-if="arrows"
        class="q-slider-right-button row items-center justify-center"
        :class="{hidden: slide === slidesNumber - 1}"
        @click="goToSlide(slide + 1)"
      >
        <i>keyboard_arrow_right</i>
      </div>
      <div v-if="toolbar" class="q-slider-toolbar row items-center justify-end">
        <div class="q-slider-dots auto row items-center justify-center">
          <i
            v-if="dots"
            v-for="n in slidesNumber"
            @click="goToSlide(n - 1)"
            v-text="(n - 1) !== slide ? 'panorama_fish_eye' : 'lens'"
          ></i>
        </div>
        <div class="row items-center">
          <slot name="action"></slot>
          <i v-if="fullscreen" @click="toggleFullscreen">
            <span v-show="!inFullscreen">fullscreen</span>
            <span v-show="inFullscreen">fullscreen_exit</span>
          </i>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Platform from '../../features/platform'
import Utils from '../../utils'

export default {
  props: {
    arrows: Boolean,
    dots: Boolean,
    fullscreen: Boolean,
    actions: Boolean
  },
  data () {
    return {
      position: 0,
      slide: 0,
      slidesNumber: 0,
      inFullscreen: false,
      animUid: Utils.uid()
    }
  },
  watch: {
    slide (value) {
      this.$emit('slide', value)
    }
  },
  computed: {
    toolbar () {
      return this.dots || this.fullscreen || this.actions
    },
    trackPosition () {
      return Utils.dom.cssTransform(`translateX(${this.position}%)`)
    }
  },
  methods: {
    __pan (event) {
      if (!this.hasOwnProperty('initialPosition')) {
        this.initialPosition = this.position
        this.stopAnimation()
      }

      let delta = (event.direction === 'left' ? -1 : 1) * event.distance.x

      if (
        this.slide === 0 && delta > 0 ||
        this.slide === this.slidesNumber - 1 && delta < 0
      ) {
        delta = delta / 10
      }

      this.position = this.initialPosition + delta / this.$refs.track.offsetWidth * 100

      if (event.isFinal) {
        this.goToSlide(
          event.distance.x < 100
          ? this.slide
          : (event.direction === 'left' ? this.slide + 1 : this.slide - 1)
        )
        delete this.initialPosition
      }
    },
    goToSlide (slide, noAnimation) {
      this.slide = Utils.format.between(slide, 0, this.slidesNumber - 1)
      const pos = -this.slide * 100
      if (noAnimation) {
        this.stopAnimation()
        this.position = pos
        return
      }
      Utils.animate({
        name: this.animUid,
        pos: this.position,
        finalPos: pos,
        apply: (pos) => {
          this.position = pos
        }
      })
    },
    toggleFullscreen () {
      if (this.inFullscreen) {
        if (!Platform.has.popstate) {
          this.__setFullscreen(false)
        }
        else {
          window.history.go(-1)
        }
        return
      }

      this.__setFullscreen(true)
      if (Platform.has.popstate) {
        window.history.pushState({}, '')
        window.addEventListener('popstate', this.__popState)
      }
    },
    __setFullscreen (state) {
      if (this.inFullscreen === state) {
        return
      }

      if (state) {
        this.container.replaceChild(this.fillerNode, this.$el)
        document.body.appendChild(this.$el)
        this.inFullscreen = true
        return
      }

      this.inFullscreen = false
      this.container.replaceChild(this.$el, this.fillerNode)
    },
    __popState () {
      if (this.inFullscreen) {
        this.__setFullscreen(false)
      }
      window.removeEventListener('popstate', this.__popState)
    },
    stopAnimation () {
      Utils.animate.stop(this.animUid)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fillerNode = document.createElement('span')
      this.container = this.$el.parentNode
      this.slidesNumber = this.$refs.track.children.length
    })
  },
  beforeDestroy () {
    this.stopAnimation()
  }
}
</script>
