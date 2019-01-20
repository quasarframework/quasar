import Vue from 'vue'

import QPageSticky from '../layout/QPageSticky.js'
import { getScrollTarget, setScrollPosition } from '../../utils/scroll.js'

export default Vue.extend({
  name: 'QPageScroller',

  mixins: [ QPageSticky ],

  props: {
    scrollOffset: {
      type: Number,
      default: 1000
    },

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
      showing: this.__isVisible(this.layout.scroll.position)
    }
  },

  watch: {
    'layout.scroll.position' (val) {
      const newVal = this.__isVisible(val)
      if (this.showing !== newVal) {
        this.showing = newVal
      }
    }
  },

  methods: {
    __isVisible (val) {
      return val > this.scrollOffset
    },

    __onClick () {
      const target = this.layout.container === true
        ? getScrollTarget(this.$el)
        : getScrollTarget(this.layout.$el)

      setScrollPosition(target, 0, this.duration)
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
          on: { click: this.__onClick }
        }, [
          QPageSticky.options.render.call(this, h)
        ])
      ]
      : null
    )
  }
})
