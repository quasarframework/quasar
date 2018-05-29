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
  name: 'QCarousel',
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
    quickNavPosition: {
      type: String,
      default: 'bottom',
      validator: v => ['top', 'bottom'].includes(v)
    },
    quickNavIcon: String,
    thumbnails: {
      type: Array,
      default: () => ([])
    },
    thumbnailsIcon: String,
    thumbnailsHorizontal: Boolean
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
      animUid: false,
      viewThumbnails: false
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
    rtlDir () {
      return this.$q.i18n.rtl ? -1 : 1
    },
    arrowIcon () {
      const ico = [ this.$q.icon.carousel.left, this.$q.icon.carousel.right ]
      return this.$q.i18n.rtl
        ? ico.reverse()
        : ico
    },
    trackPosition () {
      return cssTransform(`translateX(${this.rtlDir * this.position}%)`)
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
    computedQuickNavIcon () {
      return this.quickNavIcon || this.$q.icon.carousel.quickNav
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
    },
    computedThumbnailIcon () {
      return this.thumbnailsIcon || this.$q.icon.carousel.thumbnails
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
      return new Promise(resolve => {
        let
          direction = '',
          curSlide = this.slide,
          pos

        this.__cleanup()

        const finish = () => {
          this.$emit('input', this.slide)
          this.$emit('slide', this.slide, direction)
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

        this.$emit('slide-trigger', curSlide, this.slide, direction)
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

      let delta = this.rtlDir * (event.direction === 'left' ? -1 : 1) * event.distance.x

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
        delta = 0
      }

      const
        pos = this.initialPosition + delta / this.$refs.track.offsetWidth * 100,
        slidePos = this.slide + this.rtlDir * (event.direction === 'left' ? 1 : -1)

      if (this.position !== pos) {
        this.position = pos
      }
      if (this.positionSlide !== slidePos) {
        this.positionSlide = slidePos
      }

      if (event.isFinal) {
        this.goToSlide(
          event.distance.x < 40
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
              icon: this.computedQuickNavIcon,
              round: true,
              flat: true,
              dense: true,
              color: this.color
            },
            on: {
              click: () => { this.goToSlide(i) }
            }
          }))
        }
      }

      return h('div', {
        staticClass: 'q-carousel-quick-nav scroll text-center',
        'class': [`text-${this.color}`, `absolute-${this.quickNavPosition}`]
      }, items)
    },
    __getThumbnails (h) {
      const slides = this.thumbnails.map((img, index) => {
        if (!img) {
          return
        }

        return h('div', {
          on: {
            click: () => { this.goToSlide(index) }
          }
        }, [
          h('img', {
            attrs: { src: img },
            'class': { active: this.slide === index }
          })
        ])
      })

      const nodes = [
        h(QBtn, {
          staticClass: 'q-carousel-thumbnail-btn absolute',
          props: {
            icon: this.computedThumbnailIcon,
            fabMini: true,
            flat: true,
            color: this.color
          },
          on: {
            click: () => {
              this.viewThumbnails = !this.viewThumbnails
            }
          }
        }),
        h('div', {
          staticClass: 'q-carousel-thumbnails scroll absolute-bottom',
          'class': { active: this.viewThumbnails }
        }, [h('div', {
          staticClass: 'row gutter-xs',
          'class': this.thumbnailsHorizontal ? 'no-wrap' : 'justify-center'
        }, slides)])
      ]

      if (this.viewThumbnails) {
        nodes.unshift(
          h('div', {
            staticClass: 'absolute-full',
            on: {
              click: () => { this.viewThumbnails = false }
            }
          })
        )
      }

      return nodes
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
            modifiers: {
              horizontal: true,
              prevent: true,
              stop: true
            },
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
          this.infiniteRight ? h('div', { staticClass: 'q-carousel-slide', style: `flex: 0 0 ${100}%` }) : null,
          this.$slots.default,
          this.infiniteLeft ? h('div', { staticClass: 'q-carousel-slide', style: `flex: 0 0 ${100}%` }) : null
        ])
      ]),
      this.arrows ? h(QBtn, {
        staticClass: 'q-carousel-left-arrow absolute',
        props: { color: this.color, icon: this.arrowIcon[0], fabMini: true, flat: true },
        directives: [{ name: 'show', value: this.canGoToPrevious }],
        on: { click: this.previous }
      }) : null,
      this.arrows ? h(QBtn, {
        staticClass: 'q-carousel-right-arrow absolute',
        props: { color: this.color, icon: this.arrowIcon[1], fabMini: true, flat: true },
        directives: [{ name: 'show', value: this.canGoToNext }],
        on: { click: this.next }
      }) : null,
      this.__getQuickNav(h),
      this.__getScopedSlots(h),
      this.thumbnails.length
        ? this.__getThumbnails(h)
        : null,
      this.$slots.control
    ])
  },
  mounted () {
    this.__planAutoPlay()
    if (this.handleArrowKeys) {
      this.__setArrowKeys(true)
    }
    this.__stopSlideNumberNotifier = this.$watch('slidesNumber', val => {
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
