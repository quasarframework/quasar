import { position, stopAndPrevent } from '../../utils/event'
import { between } from '../../utils/format'
import { offset, height, width } from '../../utils/dom'
import TouchPan from '../../directives/touch-pan'

export default {
  name: 'q-knob',
  directives: {
    TouchPan
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    color: String,
    trackColor: {
      type: String,
      default: 'grey-3'
    },
    lineWidth: {
      type: String,
      default: '6px'
    },
    size: {
      type: String,
      default: '100px'
    },
    step: {
      type: Number,
      default: 1
    },
    decimals: Number,
    disable: Boolean,
    readonly: Boolean
  },
  computed: {
    classes () {
      const cls = []
      if (this.disable) {
        cls.push('disabled')
      }
      if (!this.readonly) {
        cls.push('cursor-pointer')
      }
      if (this.color) {
        cls.push(`text-${this.color}`)
      }
      return cls
    },
    svgStyle () {
      return {
        'stroke-dasharray': '295.31px, 295.31px',
        'stroke-dashoffset': (295.31 * (1.0 - (this.model - this.min) / (this.max - this.min))) + 'px',
        'transition': this.dragging ? '' : 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      }
    },
    editable () {
      return !this.disable && !this.readonly
    },
    computedDecimals () {
      return this.decimals !== void 0 ? this.decimals || 0 : (String(this.step).trim('0').split('.')[1] || '').length
    }
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
        this.$emit('input', this.min)
        this.model = this.min
        this.$nextTick(() => {
          if (this.model !== this.value) {
            this.$emit('change', this.model)
          }
        })
      }
      else if (value > this.max) {
        this.$emit('input', this.max)
        this.model = this.max
        this.$nextTick(() => {
          if (this.model !== this.value) {
            this.$emit('change', this.model)
          }
        })
      }
      else {
        this.model = this.computedDecimals
          ? parseFloat(value.toFixed(this.computedDecimals))
          : value
      }
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
      setTimeout(() => {
        this.dragging = false
      }, 100)
      this.__onInput(ev, this.centerPosition, true, true)
    },
    __onInput (ev, center = this.__getCenter(), emitChange, dragStop) {
      if (!this.editable) {
        return
      }
      let
        pos = position(ev),
        height = Math.abs(pos.top - center.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - center.top), 2) +
          Math.pow(Math.abs(pos.left - center.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI)

      if (pos.top < center.top) {
        angle = center.left < pos.left ? 90 - angle : 270 + angle
      }
      else {
        angle = center.left < pos.left ? angle + 90 : 270 - angle
      }

      let
        model = this.min + (angle / 360) * (this.max - this.min),
        modulo = model % this.step

      let value = between(
        model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0),
        this.min,
        this.max
      )

      if (this.computedDecimals) {
        value = parseFloat(value.toFixed(this.computedDecimals))
      }

      this.model = value
      this.$emit('input', value)
      this.$nextTick(() => {
        if (emitChange && JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('change', value)
        }
        if (dragStop) {
          this.$emit('dragend', value)
        }
      })
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
    return h('div', {
      staticClass: 'q-knob non-selectable',
      'class': this.classes,
      style: {
        width: this.size,
        height: this.size
      }
    }, [
      h('div', {
        on: {
          click: e => this.__onInput(e, undefined, true)
        },
        directives: [{
          name: 'touch-pan',
          modifiers: {
            prevent: true,
            stop: true
          },
          value: this.__pan
        }]
      }, [
        h('svg', { attrs: { viewBox: '0 0 100 100' } }, [
          h('path', {
            attrs: {
              d: 'M 50,50 m 0,-47 a 47,47 0 1 1 0,94 a 47,47 0 1 1 0,-94',
              'fill-opacity': '0',
              stroke: 'currentColor',
              'stroke-width': this.lineWidth
            },
            'class': `text-${this.trackColor}`
          }),
          h('path', {
            attrs: {
              d: 'M 50,50 m 0,-47 a 47,47 0 1 1 0,94 a 47,47 0 1 1 0,-94',
              'fill-opacity': '0',
              stroke: 'currentColor',
              'stroke-linecap': 'round',
              'stroke-width': this.lineWidth
            },
            style: this.svgStyle
          })
        ]),

        h('div', {
          staticClass: 'q-knob-label row flex-center content-center'
        }, [
          this.$slots.default
            ? this.$slots.default
            : h('span', [ this.model ])
        ])
      ])
    ])
  }
}
