import { QResizeObservable } from '../observables'

export default {
  name: 'q-layout-header',
  inject: ['layout'],
  props: {
    value: Boolean,
    reveal: Boolean
  },
  watch: {
    'layout.scroll' (data) {
      if (!this.reveal) {
        return
      }

      this.__update('revealed',
        data.position <= this.layout.header.size ||
        data.direction === 'up' ||
        data.position - data.inflexionPosition < 100
      )
    },
    value: {
      handler (val) {
        this.__update('space', val)
      },
      immediate: true
    },
    reveal: {
      handler (val) {
        this.__update('reveal', val)
      },
      immediate: true
    }
  },
  computed: {
    computedClass () {
      let cls = this.layout.fixed.header
        ? 'fixed-top'
        : 'absolute-top'

      if (!this.layout.header.space || !this.layout.header.revealed) {
        cls += ' q-layout-header-hidden'
      }

      return cls
    },
    computedStyle () {
      const
        view = this.layout.rows.top,
        css = {}

      if (view[0] === 'l' && this.layout.left.space) {
        css.marginLeft = `${this.layout.left.size}px`
      }
      if (view[2] === 'r' && this.layout.right.space) {
        css.marginRight = `${this.layout.right.size}px`
      }

      return css
    }
  },
  render (h) {
    console.log('header render')
    return h('header', {
      staticClass: 'q-layout-header',
      'class': this.computedClass,
      style: this.computedStyle
    }, [
      h(QResizeObservable, {
        on: { resize: this.__onResize }
      }),
      this.$slots.default
    ])
  },
  destroyed () {
    this.layout.header.size = 0
    this.layout.header.space = false
  },
  methods: {
    __onResize ({ height }) {
      this.__update('size', height)
    },
    __update (prop, val) {
      if (this.layout.header[prop] !== val) {
        this.layout.header[prop] = val
      }
    }
  }
}
