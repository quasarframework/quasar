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
      height: onSSR ? 0 : window.innerHeight,
      width: onSSR || this.container ? 0 : window.innerWidth,

      // container only prop
      containerHeight: 0,
      scrollbarWidth: onSSR ? 0 : getScrollbarWidth(),

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

    // used by container only
    targetStyle () {
      if (this.scrollbarWidth !== 0) {
        return { [this.$q.lang.rtl ? 'left' : 'right']: `${this.scrollbarWidth}px` }
      }
    },

    targetChildStyle () {
      if (this.scrollbarWidth !== 0) {
        return {
          [this.$q.lang.rtl ? 'right' : 'left']: 0,
          [this.$q.lang.rtl ? 'left' : 'right']: `-${this.scrollbarWidth}px`,
          width: `calc(100% + ${this.scrollbarWidth}px)`
        }
      }
    }
  },

  created () {
    this.instances = {
      header: null,
      right: null,
      footer: null,
      left: null
    }
  },

  render (h) {
    const layout = h('div', { staticClass: 'q-layout' }, [
      h(QScrollObserver, {
        on: { scroll: this.__onPageScroll }
      }),
      h(QResizeObserver, {
        on: { resize: this.__onPageResize }
      }),
      slot(this, 'default')
    ])

    return this.container
      ? h('div', {
        staticClass: 'q-layout-container relative-position overflow-hidden'
      }, [
        h(QResizeObserver, {
          on: { resize: this.__onContainerResize }
        }),
        h('div', {
          staticClass: 'absolute-full',
          style: this.targetStyle
        }, [
          h('div', {
            staticClass: 'overflow-auto',
            style: this.targetChildStyle
          }, [ layout ])
        ])
      ])
      : layout
  },

  methods: {
    __animate () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      else {
        document.body.classList.add('q-body--layout-animate')
      }
      this.timer = setTimeout(() => {
        document.body.classList.remove('q-body--layout-animate')
        this.timer = null
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
      if (this.container) {
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
