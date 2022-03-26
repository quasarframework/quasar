import Vue from 'vue'

import { position, stopAndPrevent } from '../../utils/event.js'
import { between, normalizeToInterval } from '../../utils/format.js'
import { slot } from '../../utils/slot.js'
import cache from '../../utils/cache.js'

import QCircularProgress from '../circular-progress/QCircularProgress.js'
import FormMixin from '../../mixins/form.js'
import TouchPan from '../../directives/TouchPan.js'

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
const keyCodes = [34, 37, 40, 33, 39, 38]

export default Vue.extend({
  name: 'QKnob',

  mixins: [
    { props: QCircularProgress.options.props },
    FormMixin
  ],

  directives: {
    TouchPan
  },

  props: {
    innerMin: Number,
    innerMax: Number,

    step: {
      type: Number,
      default: 1,
      validator: v => v >= 0
    },

    tabindex: {
      type: [Number, String],
      default: 0
    },

    disable: Boolean,
    readonly: Boolean
  },

  data () {
    const innerMin = this.__getInnerMin(this.innerMin)
    const innerMax = this.__getInnerMax(this.innerMax)

    return {
      model: this.value === null ? innerMin : between(this.value, innerMin, innerMax),
      dragging: false
    }
  },

  watch: {
    modelUpdate () {
      this.model = this.value === null
        ? this.computedInnerMin
        : between(this.value, this.computedInnerMin, this.computedInnerMax)

      this.__updateValue(true)
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

    computedInnerMin () {
      return this.__getInnerMin(this.innerMin)
    },

    computedInnerMax () {
      return this.__getInnerMax(this.innerMax)
    },

    modelUpdate () {
      return `${this.value}|${this.computedInnerMin}|${this.computedInnerMax}`
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
      return this.$q.platform.is.mobile === true
        ? { click: this.__click }
        : {
          mousedown: this.__activate,
          click: this.__click,
          keydown: this.__keydown,
          keyup: this.__keyup
        }
    },

    attrs () {
      const attrs = {
        role: 'slider',
        'aria-valuemin': this.computedInnerMin,
        'aria-valuemax': this.computedInnerMax,
        'aria-valuenow': this.value
      }

      if (this.editable === true) {
        attrs.tabindex = this.tabindex
      }
      else {
        attrs[`aria-${this.disable === true ? 'disabled' : 'readonly'}`] = ''
      }

      return attrs
    }
  },

  methods: {
    __getInnerMin (val) {
      return isNaN(val) === true || this.innerMin < this.min
        ? this.min
        : this.innerMin
    },

    __getInnerMax (val) {
      return isNaN(val) === true || val > this.max
        ? this.max
        : this.innerMax
    },

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
        this.computedInnerMin,
        this.computedInnerMax
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

      if (this.$q.lang.rtl === true) {
        angle = normalizeToInterval(-angle - this.angle, 0, 360)
      }
      else if (this.angle) {
        angle = normalizeToInterval(angle - this.angle, 0, 360)
      }

      if (this.reverse === true) {
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

      model = between(model, this.computedInnerMin, this.computedInnerMax)

      this.$emit('drag-value', model)

      if (this.model !== model) {
        this.model = model
      }

      this.__updateValue(change)
    },

    __updateValue (change) {
      this.value !== this.model && this.$emit('input', this.model)
      change === true && this.$emit('change', this.model)
    },

    __getNameInput () {
      return this.$createElement('input', { attrs: this.formAttrs })
    }
  },

  render (h) {
    const data = {
      class: this.classes,
      attrs: this.attrs,
      props: {
        ...this.$props,
        value: this.model,
        instantFeedback: this.computedInstantFeedback
      }
    }

    if (this.editable === true) {
      data.on = this.onEvents
      data.directives = cache(this, 'dir', [{
        name: 'touch-pan',
        value: this.__pan,
        modifiers: {
          prevent: true,
          stop: true,
          mouse: true
        }
      }])

      if (this.name !== void 0) {
        data.scopedSlots = {
          internal: this.__getNameInput
        }
      }
    }

    return h(QCircularProgress, data, slot(this, 'default'))
  }
})
