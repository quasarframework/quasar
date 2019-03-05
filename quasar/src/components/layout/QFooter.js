import Vue from 'vue'

import QResizeObserver from '../observer/QResizeObserver.js'
import CanRenderMixin from '../../mixins/can-render.js'
import { onSSR } from '../../plugins/Platform.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QFooter',

  mixins: [ CanRenderMixin ],

  inject: {
    layout: {
      default () {
        console.error('QFooter needs to be child of QLayout')
      }
    }
  },

  props: {
    value: {
      type: Boolean,
      default: true
    },
    reveal: Boolean,
    bordered: Boolean,
    elevated: Boolean
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
      val === false && this.__updateLocal('revealed', this.value)
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
    },

    '$q.screen.height' (val) {
      this.layout.container !== true && this.__updateLocal('windowHeight', val)
    }
  },

  computed: {
    fixed () {
      return this.reveal === true ||
        this.layout.view.indexOf('F') > -1 ||
        this.layout.container === true
    },

    containerHeight () {
      return this.layout.container === true
        ? this.layout.containerHeight
        : this.windowHeight
    },

    offset () {
      if (this.canRender !== true || this.value !== true) {
        return 0
      }
      if (this.fixed === true) {
        return this.revealed === true ? this.size : 0
      }
      const offset = this.layout.scroll.position + this.containerHeight + this.size - this.layout.height
      return offset > 0 ? offset : 0
    },

    classes () {
      return (
        (this.fixed === true ? 'fixed' : 'absolute') + '-bottom') +
        (this.value === true || this.fixed === true ? '' : ' hidden') +
        (this.bordered === true ? ' q-footer--bordered' : '') +
        (
          this.canRender !== true || this.value !== true || (this.fixed === true && this.revealed !== true)
            ? ' q-footer--hidden'
            : ''
        )
    },

    style () {
      const
        view = this.layout.rows.bottom,
        css = {}

      if (view[0] === 'l' && this.layout.left.space === true) {
        css[this.$q.lang.rtl ? 'right' : 'left'] = `${this.layout.left.size}px`
      }
      if (view[2] === 'r' && this.layout.right.space === true) {
        css[this.$q.lang.rtl ? 'left' : 'right'] = `${this.layout.right.size}px`
      }

      return css
    }
  },

  render (h) {
    return h('footer', {
      staticClass: 'q-footer q-layout__section--marginal q-layout__section--animate',
      class: this.classes,
      style: this.style,
      on: this.$listeners
    }, [
      h(QResizeObserver, {
        props: { debounce: 0 },
        on: { resize: this.__onResize }
      }),

      this.elevated === true
        ? h('div', {
          staticClass: 'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
        })
        : null
    ].concat(slot(this, 'default')))
  },

  created () {
    this.layout.instances.footer = this
    this.__update('space', this.value)
    this.__update('offset', this.offset)
  },

  beforeDestroy () {
    if (this.layout.instances.footer === this) {
      this.layout.instances.footer = void 0
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
      if (this.reveal !== true) { return }

      const { direction, position, inflexionPosition } = this.layout.scroll

      this.__updateLocal('revealed', (
        direction === 'up' ||
        position - inflexionPosition < 100 ||
        this.layout.height - this.containerHeight - position - this.size < 300
      ))
    }
  }
})
