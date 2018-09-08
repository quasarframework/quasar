import { height, offset } from '../../utils/dom.js'
import debounce from '../../utils/debounce.js'
import frameDebounce from '../../utils/frame-debounce.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'

export default {
  name: 'QParallax',
  props: {
    src: String,
    height: {
      type: Number,
      default: 500
    },
    speed: {
      type: Number,
      default: 1,
      validator: v => v >= 0 && v <= 1
    }
  },
  data () {
    return {
      scrolling: false
    }
  },
  watch: {
    height () {
      this.__updatePos()
    }
  },
  methods: {
    __onResize () {
      if (!this.scrollTarget) {
        return
      }

      this.mediaHeight = this.media.naturalHeight || height(this.media)
      this.__updatePos()
    },
    __updatePos () {
      let containerTop, containerHeight, containerBottom, top, bottom

      if (this.scrollTarget === window) {
        containerTop = 0
        containerHeight = window.innerHeight
        containerBottom = containerHeight
      }
      else {
        containerTop = offset(this.scrollTarget).top
        containerHeight = height(this.scrollTarget)
        containerBottom = containerTop + containerHeight
      }

      top = offset(this.$el).top
      bottom = top + this.height

      if (bottom > containerTop && top < containerBottom) {
        const percentScrolled = (containerBottom - top) / (this.height + containerHeight)
        this.__setPos((this.mediaHeight - this.height) * percentScrolled * this.speed)
      }
    },
    __setPos (offset) {
      this.media.style.transform = `translate3D(-50%,${offset}px, 0)`
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-parallax',
      style: { height: `${this.height}px` }
    }, [
      h('div', {
        staticClass: 'q-parallax-media absolute-full'
      }, [
        this.$slots.media || h('img', {
          ref: 'media',
          attrs: {
            src: this.src
          }
        })
      ]),

      h(
        'div',
        { staticClass: 'q-parallax-text absolute-full column flex-center no-pointer-events' },
        this.$slots.default
      )
    ])
  },
  beforeMount () {
    this.__setPos = frameDebounce(this.__setPos)
  },
  mounted () {
    this.$nextTick(() => {
      this.media = this.$slots.media
        ? this.$slots.media[0].elm
        : this.$refs.media

      this.media.onload = this.media.onloadstart = this.__onResize

      this.scrollTarget = getScrollTarget(this.$el)
      this.resizeHandler = debounce(this.__onResize, 50)

      window.addEventListener('resize', this.resizeHandler, listenOpts.passive)
      this.scrollTarget.addEventListener('scroll', this.__updatePos, listenOpts.passive)

      this.__onResize()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler, listenOpts.passive)
    this.scrollTarget.removeEventListener('scroll', this.__updatePos, listenOpts.passive)
    this.media.onload = this.media.onloadstart = null
  }
}
