import { h, defineComponent } from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/Platform.js'

import EmitListenersMixin from '../../mixins/emit-listeners.js'

import QScrollObserver from '../scroll-observer/QScrollObserver.js'
import QResizeObserver from '../resize-observer/QResizeObserver.js'

import { getScrollbarWidth } from '../../utils/scroll.js'
import { hMergeSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QLayout',

  provide () {
    return {
      layout: this
    }
  },

  mixins: [ EmitListenersMixin ],

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
      scrollbarWidth: isRuntimeSsrPreHydration === true ? 0 : getScrollbarWidth(),

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

  emits: [ 'scroll', 'scroll-height', 'resize' ],

  computed: {
    rows () {
      const rows = this.view.toLowerCase().split(' ')
      return {
        top: rows[0].split(''),
        middle: rows[1].split(''),
        bottom: rows[2].split('')
      }
    },

    classes () {
      return 'q-layout q-layout--' +
        (this.container === true ? 'containerized' : 'standard')
    },

    style () {
      return this.container === false
        ? { minHeight: this.$q.screen.height + 'px' }
        : null
    },

    // used by container only
    targetStyle () {
      return this.scrollbarWidth !== 0
        ? { [this.$q.lang.rtl === true ? 'left' : 'right']: `${this.scrollbarWidth}px` }
        : null
    },

    targetChildStyle () {
      return this.scrollbarWidth !== 0
        ? {
          [this.$q.lang.rtl === true ? 'right' : 'left']: 0,
          [this.$q.lang.rtl === true ? 'left' : 'right']: `-${this.scrollbarWidth}px`,
          width: `calc(100% + ${this.scrollbarWidth}px)`
        }
        : null
    },

    totalWidth () {
      return this.width + this.scrollbarWidth
    }
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
      if (this.container === true || document.qScrollPrevented !== true) {
        this.scroll = data
      }
      this.emitListeners.onScroll === true && this.$emit('scroll', data)
    },

    __onPageResize ({ height, width }) {
      let resized = false

      if (this.height !== height) {
        resized = true
        this.height = height
        this.emitListeners['onScroll-height'] === true && this.$emit('scroll-height', height)
        this.__updateScrollbarWidth()
      }
      if (this.width !== width) {
        resized = true
        this.width = width
      }

      if (resized === true) {
        this.emitListeners.onResize === true && this.$emit('resize', { height, width })
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
  },

  render () {
    const layout = h('div', {
      class: this.classes,
      style: this.style
    }, hMergeSlot([
      h(QScrollObserver, {
        onScroll: this.__onPageScroll
      }),

      h(QResizeObserver, {
        onResize: this.__onPageResize
      })
    ], this, 'default'))

    if (this.container === true) {
      return h('div', {
        class: 'q-layout-container overflow-hidden'
      }, [
        h(QResizeObserver, {
          onResize: this.__onContainerResize
        }),
        h('div', {
          class: 'absolute-full',
          style: this.targetStyle
        }, [
          h('div', {
            class: 'scroll',
            style: this.targetChildStyle
          }, [ layout ])
        ])
      ])
    }

    return layout
  },

  created () {
    this.instances = {}
  }
})
