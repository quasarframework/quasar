import QScrollObservable from '../observables/QScrollObservable.js'
import QResizeObservable from '../observables/QResizeObservable.js'
import { onSSR } from '../../plugins/platform.js'
import { getScrollbarWidth } from '../../utils/scroll.js'

export default {
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
      height: onSSR ? 0 : window.innerHeight,
      width: onSSR ? 0 : window.innerWidth,

      // container only prop
      containerHeight: 0,

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

      scrollbarWidth: 0,
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
    const layout = h('div', {
      staticClass: 'q-layout',
      class: this.container ? 'overflow-auto' : void 0,
      style: this.container ? { right: `-${this.scrollbarWidth}px` } : void 0
    }, [
      h(QScrollObservable, {
        on: { scroll: this.__onPageScroll }
      }),
      h(QResizeObservable, {
        on: { resize: this.__onLayoutResize }
      }),
      this.$slots.default
    ])

    return this.container
      ? h('div', {
        staticClass: 'relative-position overflow-hidden q-layout-container'
      }, [
        h(QResizeObservable, {
          on: { resize: this.__onContainerResize }
        }),
        h('div', {
          staticClass: 'absolute-full z-inherit',
          style: { right: `${this.scrollbarWidth}px` }
        }, [
          layout
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
        document.body.classList.add('q-layout-animate')
      }
      this.timer = setTimeout(() => {
        document.body.classList.remove('q-layout-animate')
        this.timer = null
      }, 150)
    },
    __onPageScroll (data) {
      this.scroll = data
      this.$emit('scroll', data)
    },
    __onLayoutResize ({ height, width }) {
      const scrollbarWidth = getScrollbarWidth()

      if (this.scrollbarWidth !== scrollbarWidth) {
        this.scrollbarWidth = scrollbarWidth
      }

      let resized = false

      if (this.height !== height) {
        resized = true
        this.height = height
        this.$emit('scrollHeight', height)
      }
      if (this.width !== width) {
        resized = true
        this.width = width
      }

      resized && this.$emit('resize', { height, width })
    },
    __onContainerResize ({ height }) {
      if (this.containerHeight !== height) {
        this.containerHeight = height
      }
    }
  }
}
