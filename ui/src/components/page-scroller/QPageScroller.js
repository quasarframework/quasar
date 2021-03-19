import Vue from 'vue'

import QPageSticky from '../page-sticky/QPageSticky.js'
import { getScrollTarget, setScrollPosition } from '../../utils/scroll.js'

export default Vue.extend({
  name: 'QPageScroller',

  mixins: [ QPageSticky ],

  props: {
    scrollOffset: {
      type: Number,
      default: 1000
    },

    reverse: Boolean,

    duration: {
      type: Number,
      default: 300
    },

    offset: {
      default: () => [18, 18]
    }
  },

  inject: {
    layout: {
      default () {
        console.error('QPageScroller needs to be used within a QLayout')
      }
    }
  },

  data () {
    return {
      showing: this.__isVisible()
    }
  },

  computed: {
    scrollHeight () {
      return this.layout.height - (
        this.layout.container === true
          ? this.layout.containerHeight
          : this.$q.screen.height
      )
    },

    onEvents () {
      return {
        ...this.qListeners,
        click: this.__onClick
      }
    }
  },

  watch: {
    'layout.scroll.position' () {
      this.__updateVisibility()
    },

    reverse: {
      handler (val) {
        if (val === true) {
          if (this.heightWatcher === void 0) {
            this.heightWatcher = this.$watch('scrollHeight', this.__updateVisibility)
          }
        }
        else if (this.heightWatcher !== void 0) {
          this.__cleanup()
        }
      },
      immediate: true
    }
  },

  methods: {
    __isVisible () {
      return this.reverse === true
        ? this.scrollHeight - this.layout.scroll.position > this.scrollOffset
        : this.layout.scroll.position > this.scrollOffset
    },

    __onClick (e) {
      const target = getScrollTarget(this.layout.container === true ? this.$el : this.layout.$el)
      setScrollPosition(target, this.reverse === true ? this.layout.height : 0, this.duration)
      this.$emit('click', e)
    },

    __updateVisibility () {
      const newVal = this.__isVisible()
      if (this.showing !== newVal) {
        this.showing = newVal
      }
    },

    __cleanup () {
      this.heightWatcher()
      this.heightWatcher = void 0
    }
  },

  render (h) {
    return h('transition', {
      props: { name: 'q-transition--fade' }
    },
    this.showing === true
      ? [
        h('div', {
          staticClass: 'q-page-scroller',
          on: this.onEvents
        }, [
          QPageSticky.options.render.call(this, h)
        ])
      ]
      : null
    )
  },

  beforeDestroy () {
    this.heightWatcher !== void 0 && this.__cleanup()
  }
})
