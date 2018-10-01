import { stopAndPrevent } from '../../utils/event.js'
import { between, normalizeToInterval } from '../../utils/format.js'
import { offset, height, width } from '../../utils/dom.js'
import QCircularProgress from '../circular-progress/QCircularProgress.js'
import TouchPan from '../../directives/touch-pan.js'

import Vue from 'vue'
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
      default: 1
    },
    decimals: Number,
    tabindex: String,
    disable: Boolean,
    readonly: Boolean
  },

  computed: {
    classes () {
      return {
        disabled: this.disable,
        'cursor-pointer': !this.readonly
      }
    },

    editable () {
      return !this.disable && !this.readonly
    },

    computedDecimals () {
      return this.decimals !== void 0 ? this.decimals || 0 : (String(this.step).trim('0').split('.')[1] || '').length
    },

    computedStep () {
      return this.decimals !== void 0 ? 1 / Math.pow(10, this.decimals || 0) : this.step
    },

    computedTabindex () {
      return this.editable ? this.tabindex || '0' : ''
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
        const newVal = this.computedDecimals && typeof value === 'number'
          ? parseFloat(value.toFixed(this.computedDecimals))
          : value
        if (newVal !== this.model) {
          this.model = newVal
        }
        return
      }

      this.$emit('input', this.model)
      this.model !== this.value && this.$emit('change', this.model)
    }
  },

  data () {
    return {
      model: this.value,
      dragging: false
    }
  },

  methods: {
    __pan (event) {
      if (!this.editable) {
        return
      }
      if (event.isFinal) {
        this.__dragStop(event.evt)
      }
      else if (event.isFirst) {
        this.__dragStart(event.evt)
      }
      else {
        this.__dragMove(event.evt)
      }
    },

    __dragStart (ev) {
      if (!this.editable) {
        return
      }
      stopAndPrevent(ev)
      this.centerPosition = this.__getCenter()
      clearTimeout(this.timer)
      this.dragging = true
      this.__onInput(ev)
    },

    __dragMove (ev) {
      if (!this.dragging || !this.editable) {
        return
      }
      stopAndPrevent(ev)
      this.__onInput(ev, this.centerPosition)
    },

    __dragStop (ev) {
      if (!this.editable) {
        return
      }
      stopAndPrevent(ev)
      this.timer = setTimeout(() => {
        this.dragging = false
      }, 100)
      this.__onInput(ev, this.centerPosition, true)
    },

    __onClick (evt) {
      !this.dragging && this.__onInput(evt, void 0, true)
    },

    __onKeydown (evt) {
      const keyCode = evt.keyCode
      if (!this.editable || ![37, 40, 39, 38].includes(keyCode)) {
        return
      }
      stopAndPrevent(evt)
      const step = evt.ctrlKey ? 10 * this.computedStep : this.computedStep
      const offset = [37, 40].includes(keyCode) ? -step : step
      this.__onInputValue(between(this.model + offset, this.min, this.max))
    },

    __onKeyup (ev) {
      const keyCode = ev.keyCode
      if (!this.editable || ![37, 40, 39, 38].includes(keyCode)) {
        return
      }
      this.__emitChange()
    },

    __onInput (evt, center = this.__getCenter(), emitChange) {
      if (!this.editable) { return }

      this.$el.focus()

      const
        height = Math.abs(evt.clientY - center.top),
        distance = Math.sqrt(
          height ** 2 +
          Math.abs(evt.clientX - center.left) ** 2
        )

      let angle = Math.asin(height / distance) * (180 / Math.PI)

      if (evt.clientY < center.top) {
        angle = center.left < evt.clientX ? 90 - angle : 270 + angle
      }
      else {
        angle = center.left < evt.clientX ? angle + 90 : 270 - angle
      }

      if (this.angle) {
        angle = normalizeToInterval(angle - this.angle, 0, 360)
      }

      if (this.$q.i18n.rtl) {
        angle = 360 - angle
      }

      const
        model = this.min + (angle / 360) * (this.max - this.min),
        modulo = model % this.step

      const value = between(
        model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0),
        this.min,
        this.max
      )
      this.__onInputValue(value, emitChange)
    },

    __onInputValue (value, emitChange) {
      if (this.computedDecimals) {
        value = parseFloat(value.toFixed(this.computedDecimals))
      }

      if (this.model !== value) {
        this.model = value
      }

      this.$emit('drag-value', value)

      if (this.value === value) {
        return
      }

      this.$emit('input', value)
      emitChange && this.__emitChange(value)
    },

    __emitChange (value = this.model) {
      JSON.stringify(value) !== JSON.stringify(this.value) && this.$emit('change', value)
    },

    __getCenter () {
      let knobOffset = offset(this.$el)
      return {
        top: knobOffset.top + height(this.$el) / 2,
        left: knobOffset.left + width(this.$el) / 2
      }
    }
  },

  render (h) {
    return h(QCircularProgress, {
      staticClass: 'q-knob non-selectable',
      'class': this.classes,
      props: Object.assign({}, this.$props, {
        value: this.model,
        noMotion: this.dragging,
        tabindex: this.computedTabindex
      }),
      nativeOn: {
        click: this.__onClick,
        keydown: this.__onKeydown,
        keyup: this.__onKeyup
      },
      directives: this.editable
        ? [{
          name: 'touch-pan',
          modifiers: {
            prevent: true,
            stop: true
          },
          value: this.__pan
        }]
        : null
    }, this.$slots.default)
  }
})
