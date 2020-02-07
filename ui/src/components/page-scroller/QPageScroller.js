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

    scrollReverse: Boolean,

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

  watch: {
    'layout.scroll.position' () {
      const newVal = this.__isVisible()
      if (this.showing !== newVal) {
        this.showing = newVal
      }
    },

    'layout.height' () {
      const newVal = this.__isVisible()
      if (this.showing !== newVal) {
        this.showing = newVal
      }
    }
  },

  methods: {
    __isVisible () {
      return this.scrollReverse === true
        ? this.layout.height - this.layout.scroll.position > this.scrollOffset
        : this.layout.scroll.position > this.scrollOffset
    },

    __onClick (e) {
      const target = this.layout.container === true
        ? getScrollTarget(this.$el)
        : getScrollTarget(this.layout.$el)

      setScrollPosition(target, this.scrollReverse === true ? this.layout.height : 0, this.duration)
      this.$listeners.click !== void 0 && this.$emit('click', e)
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
          on: {
            ...this.$listeners,
            click: this.__onClick
          }
        }, [
          QPageSticky.options.render.call(this, h)
        ])
      ]
      : null
    )
  }
})
