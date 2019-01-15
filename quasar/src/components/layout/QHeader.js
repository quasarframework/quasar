import Vue from 'vue'

import QResizeObserver from '../observer/QResizeObserver.js'
import CanRenderMixin from '../../mixins/can-render.js'

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
      if (!val) {
        this.__updateLocal('revealed', this.value)
      }
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
      return this.reveal || this.layout.view.indexOf('H') > -1 || this.layout.container
    },

    offset () {
      if (!this.canRender || !this.value) {
        return 0
      }
      if (this.fixed) {
        return this.revealed ? this.size : 0
      }
      const offset = this.size - this.layout.scroll.position
      return offset > 0 ? offset : 0
    },

    classes () {
      return (this.fixed ? 'fixed' : 'absolute') + '-top' +
        (this.bordered ? ' q-header--bordered' : '') +
        (!this.canRender || !this.value || (this.fixed && !this.revealed) ? ' q-header--hidden' : '')
    },

    style () {
      const
        view = this.layout.rows.top,
        css = {}

      if (view[0] === 'l' && this.layout.left.space) {
        css[this.$q.lang.rtl ? 'right' : 'left'] = `${this.layout.left.size}px`
      }
      if (view[2] === 'r' && this.layout.right.space) {
        css[this.$q.lang.rtl ? 'left' : 'right'] = `${this.layout.right.size}px`
      }

      return css
    }
  },

  render (h) {
    return h('header', {
      staticClass: 'q-header q-layout__section--marginal q-layout__section--animate',
      class: this.classes,
      style: this.style
    }, [
      h(QResizeObserver, {
        props: { debounce: 0 },
        on: { resize: this.__onResize }
      }),

      this.elevated
        ? h('div', {
          staticClass: 'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
        })
        : null
    ].concat(this.$slots.default))
  },

  created () {
    this.layout.instances.header = this
    this.__update('space', this.value)
    this.__update('offset', this.offset)
  },

  beforeDestroy () {
    if (this.layout.instances.header === this) {
      this.layout.instances.header = null
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
