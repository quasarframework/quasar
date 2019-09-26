import Vue from 'vue'

import QScrollObserver from '../observer/QScrollObserver.js'
import QResizeObserver from '../observer/QResizeObserver.js'
import { onSSR } from '../../plugins/Platform.js'
import { getScrollbarWidth } from '../../utils/scroll.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QLayout',

  provide () {
    return {
      layout: this
    }
  },

  props: {
    container: Boolean,
    view: {
      type: String,
      default: 'hhh lpr fff',
      validator: v => /^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(v.toLowerCase())
    }
  },

  data () {
    return {
      // page related
      height: this.$q.screen.height,
      width: this.container === true ? 0 : this.$q.screen.width,

      // container only prop
      containerHeight: 0,
      scrollbarWidth: onSSR === true ? 0 : getScrollbarWidth(),

      header: {
        size: 0,
        offset: 0,
        space: false
      },
      right: {
        size: 300,
        offset: 0,
        space: false
      },
      footer: {
        size: 0,
        offset: 0,
        space: false
      },
      left: {
        size: 300,
        offset: 0,
        space: false
      },

      scroll: {
        position: 0,
        direction: 'down'
      }
    }
  },

  computed: {
    rows () {
      const rows = this.view.toLowerCase().split(' ')
      return {
        top: rows[0].split(''),
        middle: rows[1].split(''),
        bottom: rows[2].split('')
      }
    },

    style () {
      return this.container === true
        ? null
        : { minHeight: this.$q.screen.height + 'px' }
    },

    // used by container only
    targetStyle () {
      if (this.scrollbarWidth !== 0) {
        return { [this.$q.lang.rtl === true ? 'left' : 'right']: `${this.scrollbarWidth}px` }
      }
    },

    targetChildStyle () {
      if (this.scrollbarWidth !== 0) {
        return {
          [this.$q.lang.rtl === true ? 'right' : 'left']: 0,
          [this.$q.lang.rtl === true ? 'left' : 'right']: `-${this.scrollbarWidth}px`,
          width: `calc(100% + ${this.scrollbarWidth}px)`
        }
      }
    }
  },

  created () {
    this.instances = {}
  },

  render (h) {
    const layout = h('div', {
      staticClass: 'q-layout q-layout--' +
        (this.container === true ? 'containerized' : 'standard'),
      style: this.style
    }, [
      h(QScrollObserver, {
        on: { scroll: this.__onPageScroll }
      }),
      h(QResizeObserver, {
        on: { resize: this.__onPageResize }
      })
    ].concat(
      slot(this, 'default')
    ))

    return this.container === true
      ? h('div', {
        staticClass: 'q-layout-container overflow-hidden'
      }, [
        h(QResizeObserver, {
          on: { resize: this.__onContainerResize }
        }),
        h('div', {
          staticClass: 'absolute-full',
          style: this.targetStyle
        }, [
          h('div', {
            staticClass: 'scroll',
            style: this.targetChildStyle
          }, [ layout ])
        ])
      ])
      : layout
  },

  methods: {
    __animate () {
      if (this.timer !== void 0) {
        clearTimeout(this.timer)
      }
      else {
        document.body.classList.add('q-body--layout-animate')
      }
      this.timer = setTimeout(() => {
        document.body.classList.remove('q-body--layout-animate')
        this.timer = void 0
      }, 150)
    },

    __onPageScroll (data) {
      this.scroll = data
      this.$listeners.scroll !== void 0 && this.$emit('scroll', data)
    },

    __onPageResize ({ height, width }) {
      let resized = false

      if (this.height !== height) {
        resized = true
        this.height = height
        if (this.$listeners['scroll-height'] !== void 0) {
          this.$emit('scroll-height', height)
        }
        this.__updateScrollbarWidth()
      }
      if (this.width !== width) {
        resized = true
        this.width = width
      }

      if (resized === true && this.$listeners.resize !== void 0) {
        this.$emit('resize', { height, width })
      }
    },

    __onContainerResize ({ height }) {
      if (this.containerHeight !== height) {
        this.containerHeight = height
        this.__updateScrollbarWidth()
      }
    },

    __updateScrollbarWidth () {
      if (this.container === true) {
        const width = this.height > this.containerHeight
          ? getScrollbarWidth()
          : 0

        if (this.scrollbarWidth !== width) {
          this.scrollbarWidth = width
        }
      }
    }
  }
})
