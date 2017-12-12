import { QBtn } from '../btn'
import TouchPan from '../../directives/touch-pan'
import { cssTransform } from '../../utils/dom'
import { isNumber } from '../../utils/is'
import { between, normalizeToInterval } from '../../utils/format'
import { start, stop } from '../../utils/animate'
import { decelerate, standard } from '../../utils/easing'
import { getEventKey } from '../../utils/event'
import FullscreenMixin from '../../mixins/fullscreen'

export default {
  name: 'q-carousel',
  mixins: [FullscreenMixin],
  directives: {
    TouchPan
  },
  props: {
    value: Number,
    color: {
      type: String,
      default: 'primary'
    },
    height: String,
    arrows: Boolean,
    infinite: Boolean,
    animation: {
      type: [Number, Boolean],
      default: true
    },
    easing: Function,
    swipeEasing: Function,
    noSwipe: Boolean,
    autoplay: [Number, Boolean],
    handleArrowKeys: Boolean,
    quickNav: Boolean,
    quickNavIcon: String
  },
  provide () {
    return {
      'carousel': this
    }
  },
  data () {
    return {
      position: 0,
      slide: 0,
      positionSlide: 0,
      slidesNumber: 0,
      animUid: false
    }
  },
  watch: {
    value (v) {
      if (v !== this.slide) {
        this.goToSlide(v)
      }
    },
    autoplay () {
      this.__planAutoPlay()
    },
    infinite () {
      this.__planAutoPlay()
    },
    handleArrowKeys (v) {
      this.__setArrowKeys(v)
    }
  },
  computed: {
    trackPosition () {
      return cssTransform(`translateX(${this.position}%)`)
    },
    infiniteLeft () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide < 0
    },
    infiniteRight () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide >= this.slidesNumber
    },
    canGoToPrevious () {
      return this.infinite ? this.slidesNumber > 1 : this.slide > 0
    },
    canGoToNext () {
      return this.infinite ? this.slidesNumber > 1 : this.slide < this.slidesNumber - 1
    },
    computedStyle () {
      if (!this.inFullscreen && this.height) {
        return `height: ${this.height}`
      }
    },
    slotScope () {
      return {
        slide: this.slide,
        slidesNumber: this.slidesNumber,
        percentage: this.slidesNumber < 2
          ? 100
          : 100 * this.slide / (this.slidesNumber - 1),
        goToSlide: this.goToSlide,
        previous: this.previous,
        next: this.next,
        color: this.color,
        inFullscreen: this.inFullscreen,
        toggleFullscreen: this.toggleFullscreen,
        canGoToNext: this.canGoToNext,
        canGoToPrevious: this.canGoToPrevious
      }
    }
  },
  methods: {
    previous () {
      return this.canGoToPrevious
        ? this.goToSlide(this.slide - 1)
        : Promise.resolve()
    },
    next () {
      return this.canGoToNext
        ? this.goToSlide(this.slide + 1)
        : Promise.resolve()
    },
    goToSlide (slide, fromSwipe = false) {
      return new Promise((resolve, reject) => {
        let
          direction = '',
          pos

        this.__cleanup()

        const finish = () => {
          this.$emit('input', this.slide)
          this.$emit('slide-direction', direction)
          this.__planAutoPlay()
          resolve()
        }

        if (this.slidesNumber < 2) {
          this.slide = 0
          this.positionSlide = 0
          pos = 0
        }
        else {
          if (!this.hasOwnProperty('initialPosition')) {
            this.position = -this.slide * 100
          }
          direction = slide > this.slide ? 'next' : 'previous'
          if (this.infinite) {
            this.slide = normalizeToInterval(slide, 0, this.slidesNumber - 1)
            pos = normalizeToInterval(slide, -1, this.slidesNumber)
            if (!fromSwipe) {
              this.positionSlide = pos
            }
          }
          else {
            this.slide = between(slide, 0, this.slidesNumber - 1)
            this.positionSlide = this.slide
            pos = this.slide
          }
        }

        pos = pos * -100

        if (!this.animation) {
          this.position = pos
          finish()
          return
        }

        this.animationInProgress = true

        this.animUid = start({
          from: this.position,
          to: pos,
          duration: isNumber(this.animation) ? this.animation : 300,
          easing: fromSwipe
            ? this.swipeEasing || decelerate
            : this.easing || standard,
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
      })
    },
    stopAnimation () {
      stop(this.animUid)
      this.animationInProgress = false
    },
    __pan (event) {
      if (this.infinite && this.animationInProgress) {
        return
      }
      if (event.isFirst) {
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
          true
        ).then(() => {
          delete this.initialPosition
        })
      }
    },
    __planAutoPlay () {
      this.$nextTick(() => {
        if (this.autoplay) {
          clearTimeout(this.timer)
          this.timer = setTimeout(
            this.next,
            isNumber(this.autoplay) ? this.autoplay : 5000
          )
        }
      })
    },
    __cleanup () {
      this.stopAnimation()
      clearTimeout(this.timer)
    },
    __handleArrowKey (e) {
      const key = getEventKey(e)

      if (key === 37) { // left arrow key
        this.previous()
      }
      else if (key === 39) { // right arrow key
        this.next()
      }
    },
    __setArrowKeys (/* boolean */ state) {
      const op = `${state === true ? 'add' : 'remove'}EventListener`
      document[op]('keydown', this.__handleArrowKey)
    },
    __registerSlide () {
      this.slidesNumber++
    },
    __unregisterSlide () {
      this.slidesNumber--
    },
    __getScopedSlots (h) {
      if (this.slidesNumber === 0) {
        return
      }
      let slots = this.$scopedSlots
      if (slots) {
        return Object.keys(slots)
          .filter(key => key.startsWith('control-'))
          .map(key => slots[key](this.slotScope))
      }
    },
    __getQuickNav (h) {
      if (this.slidesNumber === 0 || !this.quickNav) {
        return
      }

      const
        slot = this.$scopedSlots['quick-nav'],
        items = []

      if (slot) {
        for (let i = 0; i < this.slidesNumber; i++) {
          items.push(slot({
            slide: i,
            before: i < this.slide,
            current: i === this.slide,
            after: i > this.slide,
            color: this.color,
            goToSlide: slide => { this.goToSlide(slide || i) }
          }))
        }
      }
      else {
        for (let i = 0; i < this.slidesNumber; i++) {
          items.push(h(QBtn, {
            key: i,
            'class': { inactive: i !== this.slide },
            props: {
              icon: this.quickNavIcon || this.$q.icon.carousel.quickNav,
              round: true,
              size: 'sm',
              flat: true,
              color: this.color
            },
            on: {
              click: () => {
                this.goToSlide(i)
              }
            }
          }))
        }
      }

      return h('div', {
        staticClass: 'q-carousel-quick-nav absolute-bottom scroll text-center',
        'class': `text-${this.color}`
      }, items)
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-carousel',
      style: this.computedStyle,
      'class': { fullscreen: this.inFullscreen }
    }, [
      h('div', {
        staticClass: 'q-carousel-inner',
        directives: this.noSwipe
          ? null
          : [{
            name: 'touch-pan',
            modifiers: { horizontal: true },
            value: this.__pan
          }]
      }, [
        h('div', {
          ref: 'track',
          staticClass: 'q-carousel-track',
          style: this.trackPosition,
          'class': {
            'infinite-left': this.infiniteLeft,
            'infinite-right': this.infiniteRight
          }
        }, [
          h('div', { staticClass: 'q-carousel-slide', style: `flex: 0 0 ${100}%`, directives: [{ name: 'show', value: this.infiniteRight }] }),
          this.$slots.default,
          h('div', { staticClass: 'q-carousel-slide', style: `flex: 0 0 ${100}%`, directives: [{ name: 'show', value: this.infiniteLeft }] })
        ])
      ]),
      this.arrows ? h(QBtn, {
        staticClass: 'q-carousel-left-arrow absolute',
        props: { color: this.color, icon: this.$q.icon.carousel.left, round: true, size: 'sm', flat: true },
        directives: [{ name: 'show', value: this.canGoToPrevious }],
        on: { click: this.previous }
      }) : null,
      this.arrows ? h(QBtn, {
        staticClass: 'q-carousel-right-arrow absolute',
        props: { color: this.color, icon: this.$q.icon.carousel.right, round: true, size: 'sm', flat: true },
        directives: [{ name: 'show', value: this.canGoToNext }],
        on: { click: this.next }
      }) : null,
      this.__getQuickNav(h),
      this.__getScopedSlots(h),
      this.$slots.control
    ])
  },
  mounted () {
    this.__planAutoPlay()
    if (this.handleArrowKeys) {
      this.__setArrowKeys(true)
    }
    this.__stopSlideNumberNotifier = this.$watch('slidesNumber', val => {
      this.$emit('slides-number', val)
      if (this.value >= val) {
        this.$emit('input', val - 1)
      }
    }, { immediate: true })
  },
  beforeDestroy () {
    this.__cleanup()
    this.__stopSlideNumberNotifier()
    if (this.handleArrowKeys) {
      this.__setArrowKeys(false)
    }
  }
}
