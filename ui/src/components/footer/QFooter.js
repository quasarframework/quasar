import Vue from 'vue'

import { onSSR } from '../../plugins/Platform.js'

import QResizeObserver from '../resize-observer/QResizeObserver.js'

import ListenersMixin from '../../mixins/listeners.js'

import { mergeSlot } from '../../utils/slot.js'
import { stop } from '../../utils/event.js'
import cache from '../../utils/cache.js'

export default Vue.extend({
  name: 'QFooter',

  mixins: [ ListenersMixin ],

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
    elevated: Boolean,

    heightHint: {
      type: [String, Number],
      default: 50
    }
  },

  data () {
    return {
      size: parseInt(this.heightHint, 10),
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
      if (this.value !== true) {
        return 0
      }
      if (this.fixed === true) {
        return this.revealed === true ? this.size : 0
      }
      const offset = this.layout.scroll.position + this.containerHeight + this.size - this.layout.height
      return offset > 0 ? offset : 0
    },

    hidden () {
      return this.value !== true || (this.fixed === true && this.revealed !== true)
    },

    revealOnFocus () {
      return this.value === true && this.hidden === true && this.reveal === true
    },

    classes () {
      return (this.fixed === true ? 'fixed' : 'absolute') + '-bottom' +
        (this.bordered === true ? ' q-footer--bordered' : '') +
        (this.hidden === true ? ' q-footer--hidden' : '') +
        (this.value !== true ? ' q-layout--prevent-focus' : '') +
        (this.value !== true && this.fixed !== true ? ' hidden' : '')
    },

    style () {
      const
        view = this.layout.rows.bottom,
        css = {}

      if (view[0] === 'l' && this.layout.left.space === true) {
        css[this.$q.lang.rtl === true ? 'right' : 'left'] = `${this.layout.left.size}px`
      }
      if (view[2] === 'r' && this.layout.right.space === true) {
        css[this.$q.lang.rtl === true ? 'left' : 'right'] = `${this.layout.right.size}px`
      }

      return css
    },

    onEvents () {
      return {
        ...this.qListeners,
        focusin: this.__onFocusin,
        input: stop
      }
    }
  },

  render (h) {
    const child = mergeSlot([
      h(QResizeObserver, {
        props: { debounce: 0 },
        on: cache(this, 'resize', { resize: this.__onResize })
      })
    ], this, 'default')

    this.elevated === true && child.push(
      h('div', {
        staticClass: 'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
      })
    )

    return h('footer', {
      staticClass: 'q-footer q-layout__section--marginal',
      class: this.classes,
      style: this.style,
      on: this.onEvents
    }, child)
  },

  created () {
    this.layout.instances.footer = this
    this.value === true && this.__update('size', this.size)
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
    },

    __onFocusin (evt) {
      if (this.revealOnFocus === true) {
        this.__updateLocal('revealed', true)
      }

      this.$emit('focusin', evt)
    }
  }
})
