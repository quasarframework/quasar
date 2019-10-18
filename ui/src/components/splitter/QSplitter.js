import Vue from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import slot from '../../utils/slot.js'
import { stop } from '../../utils/event.js'

export default Vue.extend({
  name: 'QSplitter',

  directives: {
    TouchPan
  },

  props: {
    value: {
      type: Number,
      required: true
    },
    modelReverse: Boolean,
    modelPixels: Boolean,
    horizontal: Boolean,

    limits: {
      type: Array,
      default: () => [10, 90],
      validator: v => {
        if (v.length !== 2) return false
        if (typeof v[0] !== 'number' || typeof v[1] !== 'number') return false
        return v[0] >= 0 && v[0] <= v[1]
      }
    },

    disable: Boolean,

    dark: Boolean,

    beforeClass: [Array, String, Object],
    afterClass: [Array, String, Object],

    separatorClass: [Array, String, Object],
    separatorStyle: [Array, String, Object]
  },

  watch: {
    value: {
      immediate: true,
      handler (v) {
        this.__normalize(v, this.limits)
      }
    },

    limits: {
      deep: true,
      handler (v) {
        this.__normalize(this.value, v)
      }
    }
  },

  computed: {
    classes () {
      return (this.horizontal === true ? 'column' : 'row') +
        ` q-splitter--${this.horizontal === true ? 'horizontal' : 'vertical'}` +
        ` q-splitter--${this.disable === true ? 'disabled' : 'workable'}` +
        (this.dark === true ? ' q-splitter--dark' : '')
    },

    prop () {
      return this.horizontal === true ? 'height' : 'width'
    },

    styles () {
      const styles = this.__cssValues(this.value)

      return {
        before: { [this.prop]: styles.before },
        after: { [this.prop]: styles.after }
      }
    }
  },

  methods: {
    __pan (evt) {
      if (evt.isFirst) {
        const size = this.$el.getBoundingClientRect()[this.prop]

        this.__dir = this.horizontal === true ? 'up' : 'left'
        this.__maxValue = this.modelPixels !== true ? 100 : size
        this.__value = Math.min(this.__maxValue, this.limits[1], Math.max(this.limits[0], this.value))
        this.__multiplier = (this.modelReverse !== true ? 1 : -1) *
          (this.horizontal === true ? 1 : (this.$q.lang.rtl === true ? -1 : 1)) *
          (this.modelPixels !== true ? (size === 0 ? 0 : 100 / size) : 1)

        this.$el.classList.add('q-splitter--active')
        return
      }

      if (evt.isFinal) {
        if (this.__normalized !== this.value) {
          this.$emit('input', this.__normalized)
        }

        this.$el.classList.remove('q-splitter--active')
        return
      }

      const val = this.__value +
        this.__multiplier *
        (evt.direction === this.__dir ? -1 : 1) *
        evt.distance[this.horizontal === true ? 'y' : 'x']

      this.__normalized = Math.min(this.__maxValue, this.limits[1], Math.max(this.limits[0], val))

      const { before, after } = this.__cssValues(this.__normalized)

      this.$refs.before.style[this.prop] = before
      this.$refs.after.style[this.prop] = after
    },

    __normalize (val, limits) {
      if (val < limits[0]) {
        this.$emit('input', limits[0])
      }
      else if (val > limits[1]) {
        this.$emit('input', limits[1])
      }
    },

    __cssValues (val) {
      const
        main = this.modelPixels === true
          ? Math.round(val) + 'px'
          : val + '%',
        rest = 'calc(100% - ' + main + ')'

      return this.modelReverse !== true
        ? {
          before: main,
          after: rest
        }
        : {
          before: rest,
          after: main
        }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-splitter no-wrap',
      class: this.classes,
      on: this.$listeners
    }, [
      h('div', {
        ref: 'before',
        staticClass: 'q-splitter__panel q-splitter__before',
        style: this.styles.before,
        class: this.beforeClass,
        on: { input: stop }
      }, slot(this, 'before')),

      h('div', {
        staticClass: 'q-splitter__separator',
        style: this.separatorStyle,
        class: this.separatorClass
      }, [
        h('div', {
          staticClass: 'absolute-full q-splitter__separator-area',
          directives: this.disable === true ? void 0 : [{
            name: 'touch-pan',
            value: this.__pan,
            modifiers: {
              horizontal: this.horizontal !== true,
              vertical: this.horizontal,
              prevent: true,
              stop: true,
              mouse: true,
              mouseAllDir: true
            }
          }]
        }, slot(this, 'separator'))
      ]),

      h('div', {
        ref: 'after',
        staticClass: 'q-splitter__panel q-splitter__after',
        style: this.styles.after,
        class: this.afterClass,
        on: { input: stop }
      }, slot(this, 'after'))
    ].concat(slot(this, 'default')))
  }
})
