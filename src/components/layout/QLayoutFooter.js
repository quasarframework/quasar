import QResizeObservable from '../observables/QResizeObservable.js'
import QWindowResizeObservable from '../observables/QWindowResizeObservable.js'
import CanRenderMixin from '../../mixins/can-render.js'
import { onSSR } from '../../plugins/platform.js'

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
      revealed: true,
      windowHeight: onSSR || this.layout.container ? 0 : window.innerHeight
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
    'layout.height' () {
      this.__updateRevealed()
    },
    size () {
      this.__updateRevealed()
    }
  },
  computed: {
    fixed () {
      return this.reveal || this.layout.view.indexOf('F') > -1 || this.layout.container
    },
    containerHeight () {
      return this.layout.container
        ? this.layout.containerHeight
        : this.windowHeight
    },
    offset () {
      if (!this.canRender || !this.value) {
        return 0
      }
      if (this.fixed) {
        return this.revealed ? this.size : 0
      }
      const offset = this.layout.scroll.position + this.containerHeight + this.size - this.layout.height
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
      staticClass: 'q-layout-footer q-layout-marginal q-layout-transition',
      'class': this.computedClass,
      style: this.computedStyle
    }, [
      h(QResizeObservable, {
        props: { debounce: 0 },
        on: { resize: this.__onResize }
      }),
      (!this.layout.container && h(QWindowResizeObservable, {
        props: { debounce: 0 },
        on: { resize: this.__onWindowResize }
      })) || void 0,
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
    __onWindowResize ({ height }) {
      this.__updateLocal('windowHeight', height)
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
      if (!this.reveal) { return }

      const { direction, position, inflexionPosition } = this.layout.scroll

      this.__updateLocal('revealed', (
        direction === 'up' ||
        position - inflexionPosition < 100 ||
        this.layout.height - this.containerHeight - position - this.size < 300
      ))
    }
  }
}
