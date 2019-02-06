import Vue from 'vue'

const
  radius = 50,
  diameter = 2 * radius,
  circumference = diameter * Math.PI,
  strokeDashArray = Math.round(circumference * 1000) / 1000

export default Vue.extend({
  name: 'QCircularProgress',

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

    size: String,
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

    instantFeedback: Boolean // used by QKnob, private
  },

  computed: {
    style () {
      if (this.size !== void 0) {
        return {
          fontSize: this.size
        }
      }
    },

    svgStyle () {
      return { transform: `rotate3d(0, 0, 1, ${this.angle - 90}deg)` }
    },

    circleStyle () {
      if (this.instantFeedback !== true && this.indeterminate !== true) {
        return { transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease' }
      }
    },

    dir () {
      return (this.$q.lang.rtl ? -1 : 1) * (this.reverse ? -1 : 1)
    },

    viewBox () {
      return diameter / (1 - this.thickness / 2)
    },

    viewBoxAttr () {
      return `${this.viewBox / 2} ${this.viewBox / 2} ${this.viewBox} ${this.viewBox}`
    },

    strokeDashOffset () {
      const progress = 1 - (this.value - this.min) / (this.max - this.min)
      return (this.dir * progress) * circumference
    },

    strokeWidth () {
      return this.thickness / 2 * this.viewBox
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
    return h('div', {
      staticClass: 'q-circular-progress relative-position',
      'class': `q-circular-progress--${this.indeterminate === true ? 'in' : ''}determinate`,
      style: this.style,
      on: this.$listeners,
      attrs: {
        'role': 'progressbar',
        'aria-valuemin': this.min,
        'aria-valuemax': this.max,
        'aria-valuenow': this.indeterminate !== true ? this.value : null
      }
    }, [
      h('svg', {
        staticClass: 'q-circular-progress__svg',
        style: this.svgStyle,
        attrs: {
          viewBox: this.viewBoxAttr
        }
      }, [
        this.centerColor !== void 0 && this.centerColor !== 'transparent' ? h('circle', {
          staticClass: 'q-circular-progress__center',
          class: `text-${this.centerColor}`,
          attrs: {
            fill: 'currentColor',
            r: radius - this.strokeWidth / 2,
            cx: this.viewBox,
            cy: this.viewBox
          }
        }) : null,

        this.trackColor !== void 0 && this.trackColor !== 'transparent' ? this.__getCircle(h, {
          cls: 'track',
          thickness: this.strokeWidth,
          offset: 0,
          color: this.trackColor
        }) : null,

        this.__getCircle(h, {
          cls: 'circle',
          thickness: this.strokeWidth,
          offset: this.strokeDashOffset,
          color: this.color
        })
      ]),

      this.showValue === true
        ? h('div', {
          staticClass: 'q-circular-progress__text absolute-full row flex-center content-center',
          style: { fontSize: this.fontSize }
        }, this.$scopedSlots.default !== void 0 ? this.$scopedSlots.default() : [ h('div', [ this.value ]) ])
        : null
    ])
  }
})
