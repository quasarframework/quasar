import { QResizeObservable } from '../observables'

export default {
  name: 'q-layout-footer',
  inject: ['layout'],
  props: {
    value: Boolean,
    reveal: Boolean
  },
  data () {
    return {
      revealed: true
    }
  },
  watch: {
    'layout.scroll' (data) {
      if (!this.reveal) {
        return
      }

      this.__update('revealed',
        data.direction === 'up' ||
        data.position - data.inflexionPosition < 100 ||
        this.layout.scrollHeight - this.layout.height - data.position < this.layout.footer.size + 300
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
      let cls = this.layout.fixed.footer
        ? 'fixed-bottom'
        : 'absolute-bottom'

      if (!this.layout.footer.space || !this.layout.footer.revealed) {
        cls += ' q-layout-footer-hidden'
      }

      return cls
    },
    computedStyle () {
      const
        view = this.layout.rows.bottom,
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
    console.log('footer render')
    return h('footer', {
      staticClass: 'q-layout-footer',
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
    this.layout.footer.size = 0
    this.layout.footer.space = false
  },
  methods: {
    __onResize ({ height }) {
      this.__update('size', height)
    },
    __update (prop, val) {
      if (this.layout.footer[prop] !== val) {
        this.layout.footer[prop] = val
      }
    }
  }
}
