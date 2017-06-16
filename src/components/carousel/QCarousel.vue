<template>
  <div class="q-carousel" :class="{fullscreen: inFullscreen}">
    <div class="q-carousel-inner" v-touch-pan.horizontal="__pan">
      <div
        ref="track"
        class="q-carousel-track"
        :style="trackPosition"
        :class="{'with-arrows': arrows, 'with-toolbar': toolbar, 'infinite-left': infiniteLeft, 'infinite-right': infiniteRight}"
      >
        <div v-show="infiniteRight"></div>
        <slot name="slide"></slot>
        <div v-show="infiniteLeft"></div>
      </div>
      <div
        v-show="arrows && canGoToPrevious"
        class="q-carousel-left-button row items-center justify-center"
      >
        <q-icon name="keyboard_arrow_left" @click="previous"></q-icon>
      </div>
      <div
        v-show="arrows && canGoToNext"
        class="q-carousel-right-button row items-center justify-center"
        @click="next"
      >
        <q-icon name="keyboard_arrow_right"></q-icon>
      </div>
      <div v-if="toolbar" class="q-carousel-toolbar row items-center justify-end">
        <div class="q-carousel-dots col row items-center justify-center">
          <q-icon
            v-if="dots"
            v-for="n in slidesNumber"
            :key="n"
            @click="goToSlide(n - 1)"
            :name="(n - 1) !== slide ? 'panorama_fish_eye' : 'lens'"
          ></q-icon>
        </div>
        <div class="row items-center">
          <slot name="action"></slot>
          <q-icon
            v-if="fullscreen"
            @click="toggleFullscreen"
            :name="inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          ></q-icon>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Platform from '../../features/platform'
import TouchPan from '../../directives/touch-pan'
import { cssTransform } from '../../utils/dom'
import { between, normalizeToInterval } from '../../utils/format'
import { start, stop } from '../../utils/animate'
import CarouselMixin from './carousel-mixin'
import { QIcon } from '../icon'

export default {
  name: 'q-carousel',
  components: {
    QIcon
  },
  directives: {
    TouchPan
  },
  mixins: [CarouselMixin],
  data () {
    return {
      position: 0,
      slide: 0,
      positionSlide: 0,
      slidesNumber: 0,
      inFullscreen: false,
      animUid: false
    }
  },
  watch: {
    autoplay () {
      this.__planAutoPlay()
    },
    infinite () {
      this.__planAutoPlay()
    }
  },
  computed: {
    toolbar () {
      return this.dots || this.fullscreen || this.actions
    },
    trackPosition () {
      return cssTransform(`translateX(${this.position}%)`)
    },
    infiniteRight () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide >= this.slidesNumber
    },
    infiniteLeft () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide < 0
    },
    canGoToPrevious () {
      return this.infinite ? this.slidesNumber > 1 : this.slide > 0
    },
    canGoToNext () {
      return this.infinite ? this.slidesNumber > 1 : this.slide < this.slidesNumber - 1
    }
  },
  methods: {
    __pan (event) {
      if (this.infinite && this.animationInProgress) {
        return
      }
      if (!this.hasOwnProperty('initialPosition')) {
        this.initialPosition = this.position
        this.__cleanup()
      }

      let delta = (event.direction === 'left' ? -1 : 1) * event.distance.x

      if (
        (this.infinite && this.slidesNumber < 2) ||
        (
          !this.infinite &&
          (
            (this.slide === 0 && delta > 0) ||
            (this.slide === this.slidesNumber - 1 && delta < 0)
          )
        )
      ) {
        delta = delta / 10
      }

      this.position = this.initialPosition + delta / this.$refs.track.offsetWidth * 100
      this.positionSlide = (event.direction === 'left' ? this.slide + 1 : this.slide - 1)

      if (event.isFinal) {
        this.goToSlide(
          event.distance.x < 100
            ? this.slide
            : this.positionSlide,
          () => {
            delete this.initialPosition
          }
        )
      }
    },
    __getSlidesNumber () {
      return this.$slots.slide ? this.$slots.slide.length : 0
    },
    previous (done) {
      if (this.canGoToPrevious) {
        this.goToSlide(this.slide - 1, done)
      }
    },
    next (done) {
      if (this.canGoToNext) {
        this.goToSlide(this.slide + 1, done)
      }
    },
    goToSlide (slide, done) {
      let direction = ''
      this.__cleanup()

      const finish = () => {
        this.$emit('slide', this.slide, direction)
        this.__planAutoPlay()
        if (typeof done === 'function') {
          done()
        }
      }

      if (this.slidesNumber < 2) {
        this.slide = 0
        this.positionSlide = 0
      }
      else {
        if (!this.hasOwnProperty('initialPosition')) {
          this.position = -this.slide * 100
        }
        direction = slide > this.slide ? 'next' : 'previous'
        if (this.infinite) {
          this.slide = normalizeToInterval(slide, 0, this.slidesNumber - 1)
          this.positionSlide = normalizeToInterval(slide, -1, this.slidesNumber)
        }
        else {
          this.slide = between(slide, 0, this.slidesNumber - 1)
          this.positionSlide = this.slide
        }
      }

      const pos = -this.positionSlide * 100

      if (!this.animation) {
        this.position = pos
        finish()
        return
      }

      this.animationInProgress = true

      this.animUid = start({
        from: this.position,
        to: pos,
        apply: pos => {
          this.position = pos
        },
        done: () => {
          if (this.infinite) {
            this.position = -this.slide * 100
            this.positionSlide = this.slide
          }
          this.animationInProgress = false
          finish()
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
      stop(this.animUid)
      this.animationInProgress = false
    },
    __cleanup () {
      this.stopAnimation()
      clearTimeout(this.timer)
    },
    __planAutoPlay () {
      this.$nextTick(() => {
        if (this.autoplay) {
          clearTimeout(this.timer)
          this.timer = setTimeout(
            this.next,
            typeof this.autoplay === 'number' ? this.autoplay : 5000
          )
        }
      })
    }
  },
  beforeUpdate () {
    const slides = this.__getSlidesNumber()
    if (slides !== this.slidesNumber) {
      this.slidesNumber = slides
      this.goToSlide(this.slide)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fillerNode = document.createElement('span')
      this.container = this.$el.parentNode
      this.slidesNumber = this.__getSlidesNumber()
      this.__planAutoPlay()
    })
  },
  beforeDestroy () {
    this.__cleanup()
  }
}
</script>
