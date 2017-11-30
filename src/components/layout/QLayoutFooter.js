import { QResizeObservable } from '../observables'

export default {
  name: 'q-layout-footer',
  inject: {
    layout: {
      default () {
        console.error('QLayoutFooter needs to be child of QLayout')
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    reveal: Boolean
  },
  data () {
    return {
      size: 0,
      revealed: true
    }
  },
  watch: {
    value (val) {
      this.__update('space', val)
      this.__updateLocal('revealed', true)
      this.layout.__animate()
    },
    offset (val) {
      this.__update('offset', val)
    },
    revealed () {
      this.layout.__animate()
    },
    'layout.scroll' () {
      this.__updateRevealed()
    },
    'layout.scrollHeight' () {
      this.__updateRevealed()
    },
    size () {
      this.__updateRevealed()
    }
  },
  computed: {
    fixed () {
      return this.reveal || this.layout.view.indexOf('F') > -1
    },
    offset () {
      if (!this.value) {
        return 0
      }
      if (this.fixed) {
        return this.revealed ? this.size : 0
      }
      const offset = this.layout.height + this.layout.scroll.position + this.size - this.layout.scrollHeight
      return offset > 0 ? offset : 0
    },
    computedClass () {
      return {
        'fixed-bottom': this.fixed,
        'absolute-bottom': !this.fixed,
        'hidden': !this.value && !this.fixed,
        'q-layout-footer-hidden': !this.value || (this.fixed && !this.revealed)
      }
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
    return h('footer', {
      staticClass: 'q-layout-footer q-layout-transition',
      'class': this.computedClass,
      style: this.computedStyle
    }, [
      h(QResizeObservable, {
        on: { resize: this.__onResize }
      }),
      this.$slots.default
    ])
  },
  created () {
    this.__update('space', this.value)
  },
  destroyed () {
    this.__update('size', 0)
    this.__update('space', false)
  },
  methods: {
    __onResize ({ height }) {
      this.__updateLocal('size', height)
      this.__update('size', height)
    },
    __update (prop, val) {
      if (this.layout.footer[prop] !== val) {
        this.layout.footer[prop] = val
      }
    },
    __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val
      }
    },
    __updateRevealed () {
      if (!this.reveal) {
        return
      }
      const
        scroll = this.layout.scroll,
        scrollHeight = this.layout.scrollHeight,
        height = this.layout.height

      this.__updateLocal('revealed',
        scroll.direction === 'up' ||
        scroll.position - scroll.inflexionPosition < 100 ||
        scrollHeight - height - scroll.position < this.size + 300
      )
    }
  }
}
