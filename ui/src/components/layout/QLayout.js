import Vue from 'vue'

import { onSSR } from '../../plugins/Platform.js'

import QScrollObserver from '../scroll-observer/QScrollObserver.js'
import QResizeObserver from '../resize-observer/QResizeObserver.js'

import ListenersMixin from '../../mixins/listeners.js'

import { getScrollbarWidth } from '../../utils/scroll.js'
import { mergeSlot } from '../../utils/slot.js'
import cache from '../../utils/cache.js'

export default Vue.extend({
  name: 'QLayout',

  mixins: [ ListenersMixin ],

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
    },

    totalWidth () {
      return this.width + this.scrollbarWidth
    },

    classes () {
      return 'q-layout q-layout--' +
        (this.container === true ? 'containerized' : 'standard')
    },

    scrollbarEvtAction () {
      return this.container !== true && this.scrollbarWidth > 0
        ? 'add' : 'remove'
    }
  },

  watch: {
    scrollbarEvtAction: '__updateScrollEvent'
  },

  created () {
    this.instances = {}
  },

  mounted () {
    this.scrollbarEvtAction === 'add' && this.__updateScrollEvent('add')
  },

  beforeDestroy () {
    this.scrollbarEvtAction === 'add' && this.__updateScrollEvent('remove')
  },

  render (h) {
    const layout = h('div', {
      class: this.classes,
      style: this.style,
      attrs: { tabindex: -1 },
      on: { ...this.qListeners }
    }, mergeSlot([
      h(QScrollObserver, {
        on: cache(this, 'scroll', { scroll: this.__onPageScroll })
      }),

      h(QResizeObserver, {
        on: cache(this, 'resizeOut', { resize: this.__onPageResize })
      })
    ], this, 'default'))

    return this.container === true
      ? h('div', {
        staticClass: 'q-layout-container overflow-hidden'
      }, [
        h(QResizeObserver, {
          on: cache(this, 'resizeIn', { resize: this.__onContainerResize })
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
      if (this.container === true || document.qScrollPrevented !== true) {
        this.scroll = data
      }
      this.qListeners.scroll !== void 0 && this.$emit('scroll', data)
    },

    __onPageResize ({ height, width }) {
      let resized = false

      if (this.height !== height) {
        resized = true
        this.height = height
        if (this.qListeners['scroll-height'] !== void 0) {
          this.$emit('scroll-height', height)
        }
        this.__updateScrollbarWidth()
      }
      if (this.width !== width) {
        resized = true
        this.width = width
      }

      if (resized === true && this.qListeners.resize !== void 0) {
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
    },

    __updateScrollEvent (action) {
      if (this.timerScrollbar !== void 0 && action === 'remove') {
        clearTimeout(this.timerScrollbar)
        this.__restoreScrollbar()
      }

      window[`${action}EventListener`]('resize', this.__hideScrollbar)
    },

    __hideScrollbar () {
      if (this.timerScrollbar === void 0) {
        const el = document.body

        // if it has no scrollbar then there's nothing to do
        if (el.scrollHeight > this.$q.screen.height) {
          return
        }

        el.classList.add('hide-scrollbar')
      }
      else {
        clearTimeout(this.timerScrollbar)
      }

      this.timerScrollbar = setTimeout(this.__restoreScrollbar, 200)
    },

    __restoreScrollbar () {
      this.timerScrollbar = void 0
      document.body.classList.remove('hide-scrollbar')
    }
  }
})
