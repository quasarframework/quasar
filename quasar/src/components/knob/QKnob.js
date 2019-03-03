import Vue from 'vue'

import { position, stopAndPrevent } from '../../utils/event.js'
import { between, normalizeToInterval } from '../../utils/format.js'
import slot from '../../utils/slot.js'

import QCircularProgress from '../circular-progress/QCircularProgress.js'
import TouchPan from '../../directives/TouchPan.js'

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
const keyCodes = [34, 37, 40, 33, 39, 38]

export default Vue.extend({
  name: 'QKnob',

  mixins: [{
    props: QCircularProgress.options.props
  }],

  directives: {
    TouchPan
  },

  props: {
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
    return {
      model: this.value,
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

      if (this.model !== this.value) {
        this.$emit('input', this.model)
        this.$emit('change', this.model)
      }
    }
  },

  computed: {
    classes () {
      return {
        disabled: this.disable,
        'q-knob--editable': this.editable
      }
    },

    editable () {
      return !this.disable && !this.readonly
    },

    decimals () {
      return (String(this.step).trim('0').split('.')[1] || '').length
    },

    computedStep () {
      return this.step === 0 ? 1 : this.step
    }
  },

  methods: {
    __pan (event) {
      if (event.isFinal) {
        this.__updatePosition(event.evt, true)
        this.dragging = false
      }
      else if (event.isFirst) {
        const { top, left, width, height } = this.$el.getBoundingClientRect()
        this.centerPosition = {
          top: top + height / 2,
          left: left + width / 2
        }
        this.dragging = true
        this.__updatePosition(event.evt)
      }
      else {
        this.__updatePosition(event.evt)
      }
    },

    __click (evt) {
      const { top, left, width, height } = this.$el.getBoundingClientRect()
      this.centerPosition = {
        top: top + height / 2,
        left: left + width / 2
      }
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

      if (this.$q.lang.rtl) {
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
      this.value !== this.model && this.$emit('input', this.model)
      change === true && this.$emit('change', this.model)
    }
  },

  render (h) {
    const data = {
      staticClass: 'q-knob non-selectable',
      class: this.classes,

      props: {
        ...this.$props,
        value: this.model,
        instantFeedback: this.dragging
      }
    }

    if (this.editable === true) {
      data.attrs = { tabindex: this.tabindex }
      data.on = {
        click: this.__click,
        keydown: this.__keydown,
        keyup: this.__keyup
      }
      data.directives = [{
        name: 'touch-pan',
        value: this.__pan,
        modifiers: {
          prevent: true,
          stop: true,
          mouse: true,
          mousePrevent: true,
          mouseStop: true
        }
      }]
    }

    return h(QCircularProgress, data, slot(this, 'default'))
  }
})
