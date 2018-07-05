import QResizeObservable from '../observables/QResizeObservable.js'
import CanRenderMixin from '../../mixins/can-render.js'

export default {
  name: 'QLayoutFooter',
  mixins: [ CanRenderMixin ],
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
    reveal (val) {
      if (!val) {
        this.__updateLocal('revealed', this.value)
      }
    },
    revealed (val) {
      this.layout.__animate()
      this.$emit('reveal', val)
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
      if (!this.canRender || !this.value) {
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
        'q-layout-footer-hidden': !this.canRender || !this.value || (this.fixed && !this.revealed)
      }
    },
    computedStyle () {
      const
        view = this.layout.rows.bottom,
        css = {}

      if (view[0] === 'l' && this.layout.left.space) {
        css[this.$q.i18n.rtl ? 'right' : 'left'] = `${this.layout.left.size}px`
      }
      if (view[2] === 'r' && this.layout.right.space) {
        css[this.$q.i18n.rtl ? 'left' : 'right'] = `${this.layout.right.size}px`
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
        props: { debounce: 0 },
        on: { resize: this.__onResize }
      }),
      this.$slots.default
    ])
  },
  created () {
    this.layout.instances.footer = this
    this.__update('space', this.value)
    this.__update('offset', this.offset)
  },
  beforeDestroy () {
    if (this.layout.instances.footer === this) {
      this.layout.instances.footer = null
      this.__update('size', 0)
      this.__update('offset', 0)
      this.__update('space', false)
    }
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
