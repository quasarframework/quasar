import Vue from 'vue'

import { height, offset } from '../../utils/dom.js'
import frameDebounce from '../../utils/frame-debounce.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
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
      scrolling: false,
      percentScrolled: 0
    }
  },

  watch: {
    height () {
      this.__updatePos()
    }
  },

  methods: {
    __update (percentage) {
      this.percentScrolled = percentage
      this.$listeners.scroll !== void 0 && this.$emit('scroll', percentage)
    },

    __onResize () {
      if (this.scrollTarget) {
        this.mediaHeight = this.media.naturalHeight || this.media.videoHeight || height(this.media)
        this.__updatePos()
      }
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
        const percent = (containerBottom - top) / (this.height + containerHeight)
        this.__setPos((this.mediaHeight - this.height) * percent * this.speed)
        this.__update(percent)
      }
    },

    __setPos (offset) {
      // apply it immediately without any delay
      this.media.style.transform = `translate3D(-50%,${Math.round(offset)}px, 0)`
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-parallax',
      style: { height: `${this.height}px` },
      on: this.$listeners
    }, [
      h('div', {
        ref: 'mediaParent',
        staticClass: 'q-parallax__media absolute-full'
      }, this.$scopedSlots.media !== void 0 ? this.$scopedSlots.media() : [
        h('img', {
          ref: 'media',
          attrs: {
            src: this.src
          }
        })
      ]),

      h(
        'div',
        { staticClass: 'q-parallax__content absolute-full column flex-center' },
        this.$scopedSlots.content !== void 0
          ? this.$scopedSlots.content({ percentScrolled: this.percentScrolled })
          : slot(this, 'default')
      )
    ])
  },

  beforeMount () {
    this.__setPos = frameDebounce(this.__setPos)
  },

  mounted () {
    this.__update = frameDebounce(this.__update)
    this.resizeHandler = frameDebounce(this.__onResize)

    this.media = this.$scopedSlots.media !== void 0
      ? this.$refs.mediaParent.children[0]
      : this.$refs.media

    this.media.onload = this.media.onloadstart = this.media.loadedmetadata = this.__onResize

    this.scrollTarget = getScrollTarget(this.$el)

    window.addEventListener('resize', this.resizeHandler, listenOpts.passive)
    this.scrollTarget.addEventListener('scroll', this.__updatePos, listenOpts.passive)

    this.__onResize()
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler, listenOpts.passive)
    this.scrollTarget.removeEventListener('scroll', this.__updatePos, listenOpts.passive)
    this.media.onload = this.media.onloadstart = this.media.loadedmetadata = null
  }
})
