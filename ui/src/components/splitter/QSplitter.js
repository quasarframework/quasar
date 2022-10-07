import Vue from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import DarkMixin from '../../mixins/dark.js'
import ListenersMixin from '../../mixins/listeners.js'

import { slot, mergeSlot } from '../../utils/private/slot.js'
import { stop, stopAndPrevent } from '../../utils/event.js'
import cache from '../../utils/private/cache.js'
import uid from '../../utils/uid.js'

const keyDirections = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}

export default Vue.extend({
  name: 'QSplitter',

  mixins: [ DarkMixin, ListenersMixin ],

  directives: {
    TouchPan
  },

  props: {
    value: {
      type: Number,
      required: true
    },
    reverse: Boolean,
    unit: {
      type: String,
      default: '%',
      validator: v => [ '%', 'px' ].includes(v)
    },

    limits: {
      type: Array,
      validator: v => {
        if (v.length !== 2) return false
        if (typeof v[0] !== 'number' || typeof v[1] !== 'number') return false
        return v[0] >= 0 && v[0] <= v[1]
      }
    },

    emitImmediately: Boolean,

    horizontal: Boolean,
    disable: Boolean,

    tabindex: [String, Number],

    beforeClass: [Array, String, Object],
    afterClass: [Array, String, Object],

    separatorClass: [Array, String, Object],
    separatorStyle: [Array, String, Object]
  },

  watch: {
    value: {
      immediate: true,
      handler (v) {
        this.__normalize(v, this.computedLimits)
      }
    },

    limits: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          this.__normalize(this.value, this.computedLimits)
        })
      }
    }
  },

  computed: {
    classes () {
      return (this.horizontal === true ? 'column' : 'row') +
        ` q-splitter--${this.horizontal === true ? 'horizontal' : 'vertical'}` +
        ` q-splitter--${this.disable === true ? 'disabled' : 'workable'}` +
        (this.isDark === true ? ' q-splitter--dark' : '')
    },

    prop () {
      return this.horizontal === true ? 'height' : 'width'
    },

    side () {
      return this.reverse !== true ? 'before' : 'after'
    },

    computedLimits () {
      return this.limits !== void 0
        ? this.limits
        : (this.unit === '%' ? [ 10, 90 ] : [ 50, Infinity ])
    },

    styles () {
      return {
        [this.side]: {
          [this.prop]: this.__getCSSValue(this.value)
        }
      }
    },

    separatorDirectives () {
      if (this.disable !== true) {
        return [{
          name: 'touch-pan',
          value: this.__pan,
          modifiers: {
            [ this.horizontal === true ? 'vertical' : 'horizontal' ]: true,
            prevent: true,
            stop: true,
            mouse: true,
            mouseAllDir: true
          }
        }]
      }
    },

    separatorAttrs () {
      const attrs = this.disable === true
        ? { tabindex: -1, 'aria-disabled': 'true' }
        : { tabindex: this.tabindex || 0 }
      const ariaValue = this.__getAriaValue(this.value)

      return {
        role: 'separator',
        'aria-orientation': this.horizontal === true ? 'horizontal' : 'vertical',
        'aria-controls': this.targetUid,
        'aria-valuemin': this.computedLimits[0],
        'aria-valuemax': this.computedLimits[1],
        'aria-valuenow': ariaValue.now,
        'aria-valuetext': ariaValue.text,
        ...attrs
      }
    },

    separatorEvents () {
      return this.disable === true
        ? void 0
        : { keydown: this.__panKeydown }
    }
  },

  methods: {
    __panStart () {
      const size = this.$el.getBoundingClientRect()[this.prop]

      this.__dir = this.horizontal === true ? 'up' : 'left'
      this.__maxValue = this.unit === '%' ? 100 : size
      this.__value = Math.min(this.__maxValue, this.computedLimits[1], Math.max(this.computedLimits[0], this.value))
      this.__multiplier = (this.reverse !== true ? 1 : -1) *
        (this.horizontal === true ? 1 : (this.$q.lang.rtl === true ? -1 : 1)) *
        (this.unit === '%' ? (size === 0 ? 0 : 100 / size) : 1)

      this.$el.classList.add('q-splitter--active')
    },

    __panProgress (val) {
      this.__normalized = Math.min(this.__maxValue, this.computedLimits[1], Math.max(this.computedLimits[0], val))

      this.$refs[this.side].style[this.prop] = this.__getCSSValue(this.__normalized)

      const ariaValue = this.__getAriaValue(this.__normalized)
      this.$refs.separator.setAttribute('aria-valuenow', ariaValue.now)
      this.$refs.separator.setAttribute('aria-valuetext', ariaValue.text)

      if (this.emitImmediately === true && this.value !== this.__normalized) {
        this.$emit('input', this.__normalized)
      }
    },

    __panEnd () {
      this.__panCleanup !== void 0 && this.__panCleanup()

      if (this.__normalized !== this.value) {
        this.$emit('input', this.__normalized)
      }

      this.$el.classList.remove('q-splitter--active')
    },

    __pan (evt) {
      if (evt.isFinal === true) {
        this.__panEnd()
        return
      }

      if (evt.isFirst === true) {
        this.__panStart()
        return
      }

      const val = this.__value +
        this.__multiplier *
        (evt.direction === this.__dir ? -1 : 1) *
        evt.distance[this.horizontal === true ? 'y' : 'x']

      this.__panProgress(val)
    },

    __panKeydown (evt) {
      this.qListeners.keydown !== void 0 && this.$emit('keydown', evt)

      if (
        this.disable === true ||
        evt.defaultPrevented === true ||
        (this.horizontal !== true && [ 37, 39 ].indexOf(evt.keyCode) === -1) ||
        (this.horizontal === true && [ 38, 40 ].indexOf(evt.keyCode) === -1)
      ) {
        return
      }

      stopAndPrevent(evt)

      if (this.__panCleanup === void 0) {
        document.addEventListener('keyup', this.__panEnd)
        document.addEventListener('focusout', this.__panEnd)

        this.__panCleanup = () => {
          this.__panCleanup = void 0
          document.removeEventListener('keyup', this.__panEnd)
          document.removeEventListener('focusout', this.__panEnd)

          this.__panEnd()
        }

        this.__panStart()
        this.__normalized = this.__value
      }

      const direction = keyDirections[evt.keyCode]

      const val = this.__normalized +
        this.__multiplier *
        (direction === this.__dir ? -1 : 1) *
        (evt.shiftKey === true ? 1 : 10)

      this.__panProgress(val)
    },

    __normalize (val, limits) {
      if (val < limits[0]) {
        this.$emit('input', limits[0])
      }
      else if (val > limits[1]) {
        this.$emit('input', limits[1])
      }
    },

    __getAriaValue (value) {
      const now = this.unit === '%' ? value : Math.round(value)

      return {
        now,
        text: (Math.round(now * 100) / 100) + this.unit
      }
    },

    __getCSSValue (value) {
      return (this.unit === '%' ? value : Math.round(value)) + this.unit
    }
  },

  created () {
    this.targetUid = `sp_${uid()}`
  },

  beforeDestroy () {
    this.__panCleanup !== void 0 && this.__panCleanup()
  },

  render (h) {
    const attrs = {
      [this.side]: { id: this.targetUid }
    }

    const child = [
      h('div', {
        key: 'before',
        ref: 'before',
        staticClass: 'q-splitter__panel q-splitter__before' + (this.reverse === true ? ' col' : ''),
        style: this.styles.before,
        class: this.beforeClass,
        attrs: attrs.before,
        on: cache(this, 'stop', { input: stop })
      }, slot(this, 'before')),

      h('div', {
        staticClass: 'q-splitter__separator',
        ref: 'separator',
        style: this.separatorStyle,
        class: this.separatorClass,
        attrs: this.separatorAttrs,
        on: this.separatorEvents
      }, [
        h('div', {
          staticClass: 'absolute-full q-splitter__separator-area',
          directives: this.separatorDirectives
        }, slot(this, 'separator'))
      ]),

      h('div', {
        key: 'after',
        ref: 'after',
        staticClass: 'q-splitter__panel q-splitter__after' + (this.reverse === true ? '' : ' col'),
        style: this.styles.after,
        class: this.afterClass,
        attrs: attrs.after,
        on: cache(this, 'stop', { input: stop })
      }, slot(this, 'after'))
    ]

    return h('div', {
      staticClass: 'q-splitter no-wrap',
      class: this.classes,
      on: { ...this.qListeners }
    }, mergeSlot(child, this, 'default'))
  }
})
