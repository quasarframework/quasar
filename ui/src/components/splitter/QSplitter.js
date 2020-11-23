import { h, defineComponent } from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import DarkMixin from '../../mixins/dark.js'

import { hSlot, hMergeSlot, hDir } from '../../utils/render.js'

export default defineComponent({
  name: 'QSplitter',

  mixins: [ DarkMixin ],

  props: {
    modelValue: {
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

    beforeClass: [ Array, String, Object ],
    afterClass: [ Array, String, Object ],

    separatorClass: [ Array, String, Object ],
    separatorStyle: [ Array, String, Object ]
  },

  emits: [ 'update:modelValue' ],

  watch: {
    modelValue: {
      immediate: true,
      handler (v) {
        this.__normalize(v, this.computedLimits)
      }
    },

    limits: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          this.__normalize(this.modelValue, this.computedLimits)
        })
      }
    }
  },

  computed: {
    classes () {
      return `q-splitter no-wrap ${this.horizontal === true ? 'column' : 'row'}` +
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
          [this.prop]: this.__getCSSValue(this.modelValue)
        }
      }
    },

    sepDirective () {
      // if this.disable !== true
      return [[
        TouchPan,
        this.__pan,
        void 0,
        {
          [ this.horizontal === true ? 'vertical' : 'horizontal' ]: true,
          prevent: true,
          stop: true,
          mouse: true,
          mouseAllDir: true
        }
      ]]
    }
  },

  methods: {
    __pan (evt) {
      if (evt.isFirst === true) {
        const size = this.$el.getBoundingClientRect()[this.prop]

        this.__dir = this.horizontal === true ? 'up' : 'left'
        this.__maxValue = this.unit === '%' ? 100 : size
        this.__value = Math.min(this.__maxValue, this.computedLimits[1], Math.max(this.computedLimits[0], this.modelValue))
        this.__multiplier = (this.reverse !== true ? 1 : -1) *
          (this.horizontal === true ? 1 : (this.$q.lang.rtl === true ? -1 : 1)) *
          (this.unit === '%' ? (size === 0 ? 0 : 100 / size) : 1)

        this.$el.classList.add('q-splitter--active')
        return
      }

      if (evt.isFinal === true) {
        if (this.__normalized !== this.modelValue) {
          this.$emit('update:modelValue', this.__normalized)
        }

        this.$el.classList.remove('q-splitter--active')
        return
      }

      const val = this.__value +
        this.__multiplier *
        (evt.direction === this.__dir ? -1 : 1) *
        evt.distance[this.horizontal === true ? 'y' : 'x']

      this.__normalized = Math.min(this.__maxValue, this.computedLimits[1], Math.max(this.computedLimits[0], val))

      this.$refs[this.side].style[this.prop] = this.__getCSSValue(this.__normalized)

      if (this.emitImmediately === true && this.modelValue !== this.__normalized) {
        this.$emit('update:modelValue', this.__normalized)
      }
    },

    __normalize (val, limits) {
      if (val < limits[0]) {
        this.$emit('update:modelValue', limits[0])
      }
      else if (val > limits[1]) {
        this.$emit('update:modelValue', limits[1])
      }
    },

    __getCSSValue (value) {
      return (this.unit === '%' ? value : Math.round(value)) + this.unit
    }
  },

  render () {
    const child = [
      h('div', {
        ref: 'before',
        class: [
          'q-splitter__panel q-splitter__before' + (this.reverse === true ? ' col' : ''),
          this.beforeClass
        ],
        style: this.styles.before
      }, hSlot(this, 'before')),

      h('div', {
        class: [
          'q-splitter__separator',
          this.separatorClass
        ],
        style: this.separatorStyle,
        'aria-disabled': this.disable === true ? 'true' : void 0
      }, [
        hDir(
          'div',
          { class: 'q-splitter__separator-area absolute-full' },
          hSlot(this, 'separator'),
          'sep',
          this.disable !== true,
          () => this.sepDirective
        )
      ]),

      h('div', {
        ref: 'after',
        class: [
          'q-splitter__panel q-splitter__after' + (this.reverse === true ? '' : ' col'),
          this.afterClass
        ],
        style: this.styles.after
      }, hSlot(this, 'after'))
    ]

    return h('div', {
      class: this.classes
    }, hMergeSlot(this, 'default', child))
  }
})
