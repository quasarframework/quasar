import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'
import SizeMixin from '../../mixins/size.js'
import { mergeSlotSafely } from '../../utils/slot.js'
import { between } from '../../utils/format.js'

const
  radius = 50,
  diameter = 2 * radius,
  circumference = diameter * Math.PI,
  strokeDashArray = Math.round(circumference * 1000) / 1000

export default Vue.extend({
  name: 'QCircularProgress',

  mixins: [ ListenersMixin, SizeMixin ],

  props: {
    value: {
      type: Number,
      default: 0
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
    centerColor: String,
    trackColor: String,

    fontSize: String,

    // ratio
    thickness: {
      type: Number,
      default: 0.2,
      validator: v => v >= 0 && v <= 1
    },

    angle: {
      type: Number,
      default: 0
    },

    indeterminate: Boolean,
    showValue: Boolean,
    reverse: Boolean,

    instantFeedback: Boolean
  },

  computed: {
    normalizedValue () {
      return between(this.value, this.min, this.max)
    },

    svgStyle () {
      const angle = this.$q.lang.rtl === true ? -this.angle : this.angle

      return {
        transform: this.reverse !== (this.$q.lang.rtl === true)
          ? `scale3d(-1, 1, 1) rotate3d(0, 0, 1, ${-90 - angle}deg)`
          : `rotate3d(0, 0, 1, ${angle - 90}deg)`
      }
    },

    circleStyle () {
      if (this.instantFeedback !== true && this.indeterminate !== true) {
        return { transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease' }
      }
    },

    viewBox () {
      return diameter / (1 - this.thickness / 2)
    },

    viewBoxAttr () {
      return `${this.viewBox / 2} ${this.viewBox / 2} ${this.viewBox} ${this.viewBox}`
    },

    strokeDashOffset () {
      const progress = 1 - (this.normalizedValue - this.min) / (this.max - this.min)
      return progress * circumference
    },

    strokeWidth () {
      return this.thickness / 2 * this.viewBox
    },

    attrs () {
      return {
        role: 'progressbar',
        'aria-valuemin': this.min,
        'aria-valuemax': this.max,
        'aria-valuenow': this.indeterminate === true ? void 0 : this.normalizedValue
      }
    }
  },

  methods: {
    __getCircle (h, { thickness, offset, color, cls }) {
      return h('circle', {
        staticClass: 'q-circular-progress__' + cls,
        class: color !== void 0 ? `text-${color}` : null,
        style: this.circleStyle,
        attrs: {
          fill: 'transparent',
          stroke: 'currentColor',
          'stroke-width': thickness,
          'stroke-dasharray': strokeDashArray,
          'stroke-dashoffset': offset,
          cx: this.viewBox,
          cy: this.viewBox,
          r: radius
        }
      })
    }
  },

  render (h) {
    const svgChild = []

    this.centerColor !== void 0 && this.centerColor !== 'transparent' && svgChild.push(
      h('circle', {
        staticClass: 'q-circular-progress__center',
        class: `text-${this.centerColor}`,
        attrs: {
          fill: 'currentColor',
          r: radius - this.strokeWidth / 2,
          cx: this.viewBox,
          cy: this.viewBox
        }
      })
    )

    this.trackColor !== void 0 && this.trackColor !== 'transparent' && svgChild.push(
      this.__getCircle(h, {
        cls: 'track',
        thickness: this.strokeWidth,
        offset: 0,
        color: this.trackColor
      })
    )

    svgChild.push(
      this.__getCircle(h, {
        cls: 'circle',
        thickness: this.strokeWidth,
        offset: this.strokeDashOffset,
        color: this.color
      })
    )

    const child = [
      h('svg', {
        staticClass: 'q-circular-progress__svg',
        style: this.svgStyle,
        attrs: {
          focusable: 'false' /* needed for IE11 */,
          viewBox: this.viewBoxAttr,
          'aria-hidden': 'true'
        }
      }, svgChild)
    ]

    this.showValue === true && child.push(
      h('div', {
        staticClass: 'q-circular-progress__text absolute-full row flex-center content-center',
        style: { fontSize: this.fontSize }
      }, this.$scopedSlots.default !== void 0 ? this.$scopedSlots.default() : [ h('div', [ this.normalizedValue ]) ])
    )

    return h('div', {
      staticClass: 'q-circular-progress',
      class: `q-circular-progress--${this.indeterminate === true ? 'in' : ''}determinate`,
      style: this.sizeStyle,
      on: { ...this.qListeners },
      attrs: this.attrs
    }, mergeSlotSafely(child, this, 'internal'))
  }
})
