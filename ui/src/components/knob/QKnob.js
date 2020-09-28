import { h, defineComponent, withDirectives } from 'vue'

import { position, stopAndPrevent } from '../../utils/event.js'
import { between, normalizeToInterval } from '../../utils/format.js'

import QCircularProgress, { commonProps } from '../circular-progress/QCircularProgress.js'
import FormMixin from '../../mixins/form.js'
import TouchPan from '../../directives/TouchPan.js'

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
const keyCodes = [34, 37, 40, 33, 39, 38]
const commonPropsName = Object.keys(commonProps)

export default defineComponent({
  name: 'QKnob',

  mixins: [
    FormMixin
  ],

  props: {
    modelValue: {
      type: Number,
      required: true
    },

    step: {
      type: Number,
      default: 1,
      validator: v => v >= 0
    },

    tabindex: {
      type: [ Number, String ],
      default: 0
    },

    disable: Boolean,
    readonly: Boolean,

    ...commonProps
  },

  emits: [ 'update:modelValue', 'drag-value' ],

  data () {
    return {
      model: this.modelValue,
      dragging: false
    }
  },

  watch: {
    value (value) {
      if (value < this.min) {
        this.model = this.min
      }
      else if (value > this.max) {
        this.model = this.max
      }
      else {
        if (value !== this.model) {
          this.model = value
        }
        return
      }

      if (this.model !== this.modelValue) {
        this.$emit('update:modelValue', this.model)
        // TODO vue3 - handle lazy update
        // this.$emit('change', this.model)
      }
    }
  },

  computed: {
    classes () {
      return 'q-knob non-selectable' + (
        this.editable === true
          ? ' q-knob--editable'
          : (this.disable === true ? ' disabled' : '')
      )
    },

    editable () {
      return this.disable === false && this.readonly === false
    },

    decimals () {
      return (String(this.step).trim('0').split('.')[1] || '').length
    },

    computedStep () {
      return this.step === 0 ? 1 : this.step
    },

    computedInstantFeedback () {
      return this.instantFeedback === true ||
        this.dragging === true
    },

    onEvents () {
      return this.editable === true
        ? (
          this.$q.platform.is.mobile === true
            ? { onClick: this.__click }
            : {
              onMousedown: this.__activate,
              onClick: this.__click,
              onKeydown: this.__keydown,
              onKeyup: this.__keyup
            }
        )
        : {}
    },

    attrs () {
      const attrs = {}

      if (this.editable === true) {
        attrs.tabindex = this.tabindex
      }
      else {
        attrs[`aria-${this.disable === true ? 'disabled' : 'readonly'}`] = ''
      }

      return attrs
    },

    circularProps () {
      const props = {}
      commonPropsName.forEach(name => {
        props[name] = this.$props[name]
      })
      return props
    }
  },

  methods: {
    __updateCenterPosition () {
      const { top, left, width, height } = this.$el.getBoundingClientRect()
      this.centerPosition = {
        top: top + height / 2,
        left: left + width / 2
      }
    },

    __pan (event) {
      if (event.isFinal) {
        this.__updatePosition(event.evt, true)
        this.dragging = false
      }
      else if (event.isFirst) {
        this.__updateCenterPosition()
        this.dragging = true
        this.__updatePosition(event.evt)
      }
      else {
        this.__updatePosition(event.evt)
      }
    },

    __click (evt) {
      this.__updateCenterPosition()
      this.__updatePosition(evt, true)
    },

    __keydown (evt) {
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        step = ([34, 33].includes(evt.keyCode) ? 10 : 1) * this.computedStep,
        offset = [34, 37, 40].includes(evt.keyCode) ? -step : step

      this.model = between(
        parseFloat((this.model + offset).toFixed(this.decimals)),
        this.min,
        this.max
      )

      this.__updateValue()
    },

    __keyup (evt) {
      if (keyCodes.includes(evt.keyCode)) {
        this.__updateValue(true)
      }
    },

    __activate (evt) {
      this.__updateCenterPosition()
      this.__updatePosition(evt)
    },

    __updatePosition (evt, change) {
      const
        center = this.centerPosition,
        pos = position(evt),
        height = Math.abs(pos.top - center.top),
        distance = Math.sqrt(
          height ** 2 +
          Math.abs(pos.left - center.left) ** 2
        )

      let angle = Math.asin(height / distance) * (180 / Math.PI)

      if (pos.top < center.top) {
        angle = center.left < pos.left ? 90 - angle : 270 + angle
      }
      else {
        angle = center.left < pos.left ? angle + 90 : 270 - angle
      }

      if (this.angle) {
        angle = normalizeToInterval(angle - this.angle, 0, 360)
      }

      if (this.$q.lang.rtl === true) {
        angle = 360 - angle
      }

      let model = this.min + (angle / 360) * (this.max - this.min)

      if (this.step !== 0) {
        const
          step = this.computedStep,
          modulo = model % step

        model = model - modulo +
          (Math.abs(modulo) >= step / 2 ? (modulo < 0 ? -1 : 1) * step : 0)

        model = parseFloat(model.toFixed(this.decimals))
      }

      model = between(model, this.min, this.max)

      this.$emit('drag-value', model)

      if (this.model !== model) {
        this.model = model
      }

      this.__updateValue(change)
    },

    __updateValue (change) {
      this.modelValue !== this.model && this.$emit('update:modelValue', this.model)
      // TODO vue3 - handle lazy update
      // change === true && this.$emit('change', this.model)
    },

    __getNameInput () {
      return h('input', this.formAttrs)
    }
  },

  render () {
    console.log(this.circularProps)
    const data = {
      class: this.classes,
      role: 'slider',
      'aria-valuemin': this.min,
      'aria-valuemax': this.max,
      'aria-valuenow': this.modelValue,
      ...this.attrs,
      ...this.circularProps,
      value: this.model,
      instantFeedback: this.computedInstantFeedback,
      ...this.onEvents
    }

    const child = {
      default: this.$slots.default
    }

    if (this.editable === true) {
      if (this.name !== void 0) {
        child.internal = this.__getNameInput
      }

      return withDirectives(
        h(QCircularProgress, data, child),
        [[
          TouchPan,
          this.__pan,
          void 0,
          {
            prevent: true,
            stop: true,
            mouse: true
          }
        ]]
      )
    }

    return h(QCircularProgress, data, child)
  }
})
