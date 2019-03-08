import Vue from 'vue'

import QResizeObserver from '../observer/QResizeObserver.js'
import CanRenderMixin from '../../mixins/can-render.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QHeader',

  mixins: [ CanRenderMixin ],

  inject: {
    layout: {
      default () {
        console.error('QHeader needs to be child of QLayout')
      }
    }
  },

  props: {
    value: {
      type: Boolean,
      default: true
    },
    reveal: Boolean,
    revealOffset: {
      type: Number,
      default: 250
    },
    bordered: Boolean,
    elevated: Boolean
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
      val === false && this.__updateLocal('revealed', this.value)
    },

    revealed (val) {
      this.layout.__animate()
      this.$emit('reveal', val)
    },

    'layout.scroll' (scroll) {
      this.reveal === true && this.__updateLocal('revealed',
        scroll.direction === 'up' ||
        scroll.position <= this.revealOffset ||
        scroll.position - scroll.inflexionPosition < 100
      )
    }
  },

  computed: {
    fixed () {
      return this.reveal === true ||
        this.layout.view.indexOf('H') > -1 ||
        this.layout.container === true
    },

    offset () {
      if (this.canRender !== true || this.value !== true) {
        return 0
      }
      if (this.fixed === true) {
        return this.revealed === true ? this.size : 0
      }
      const offset = this.size - this.layout.scroll.position
      return offset > 0 ? offset : 0
    },

    classes () {
      return (
        this.fixed === true ? 'fixed' : 'absolute') + '-top' +
        (this.bordered === true ? ' q-header--bordered' : '') +
        (
          this.canRender !== true || this.value !== true || (this.fixed === true && this.revealed !== true)
            ? ' q-header--hidden'
            : ''
        )
    },

    style () {
      const
        view = this.layout.rows.top,
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
    return h('header', {
      staticClass: 'q-header q-layout__section--marginal q-layout__section--animate',
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
    this.layout.instances.header = this
    this.__update('space', this.value)
    this.__update('offset', this.offset)
  },

  beforeDestroy () {
    if (this.layout.instances.header === this) {
      this.layout.instances.header = void 0
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
      if (this.layout.header[prop] !== val) {
        this.layout.header[prop] = val
      }
    },

    __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val
      }
    }
  }
})
