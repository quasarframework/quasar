import { between } from '../../utils/format.js'

export default {
  name: 'QCircularProgress',
  props: {
    value: {
      type: Number,
      requires: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: 'primary'
    },
    centerColor: String,
    trackColor: {
      type: String,
      default: 'grey-3'
    },
    size: {
      type: Number,
      default: 100
    },
    thickness: {
      type: Number,
      default: 20
    },
    angle: {
      type: Number,
      default: 0
    },
    reverse: Boolean,
    noMotion: Boolean
  },
  computed: {
    progress () {
      return between(
        (this.value - this.min) / (this.max - this.min),
        this.min,
        this.max
      )
    },
    style () {
      return {
        width: this.size + 'px',
        height: this.size + 'px'
      }
    },
    svgStyle () {
      return { transform: `rotate(${this.angle - 90}deg)` }
    },
    circleStyle () {
      if (!this.noMotion) {
        return { transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease' }
      }
    },

    dir () {
      return (this.$q.i18n.rtl ? -1 : 1) * (this.reverse ? -1 : 1)
    },

    radius () {
      return this.size / 2
    },
    viewBox () {
      return 2 * this.radius / (1 - this.thickness / this.size)
    },
    viewBoxAttr () {
      return `${this.viewBox / 2} ${this.viewBox / 2} ${this.viewBox} ${this.viewBox}`
    },
    circumference () {
      return this.radius * 2 * Math.PI
    },
    strokeDashArray () {
      return Math.round(this.circumference * 1000) / 1000
    },
    strokeDashOffset () {
      return (this.dir * (1 - this.progress)) * this.circumference + 'px'
    },
    strokeWidth () {
      return this.thickness / this.size * this.viewBox
    }
  },
  methods: {
    __getCircle (h, { thickness, offset, color }) {
      return h('circle', {
        'class': color ? `text-${color}` : null,
        style: this.circleStyle,
        attrs: {
          fill: 'transparent',
          stroke: 'currentColor',
          'stroke-width': thickness,
          'stroke-dasharray': this.strokeDashArray,
          'stroke-dashoffset': offset,
          cx: this.viewBox,
          cy: this.viewBox,
          r: this.radius
        }
      })
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-circular-progress relative-position',
      style: this.style
    }, [
      h('svg', {
        style: this.svgStyle,
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: this.viewBoxAttr
        }
      }, [
        (this.centerColor && this.centerColor !== 'transparent' && h('circle', {
          'class': `text-${this.centerColor}`,
          attrs: {
            fill: 'currentColor',
            r: this.radius - this.strokeWidth / 2,
            cx: this.viewBox,
            cy: this.viewBox
          }
        })) || void 0,

        (this.trackColor && this.trackColor !== 'transparent' && this.__getCircle(h, {
          thickness: this.strokeWidth, offset: 0, color: this.trackColor
        })) || void 0,

        this.__getCircle(h, {
          thickness: this.strokeWidth, offset: this.strokeDashOffset, color: this.color
        })
      ]),

      h('div', {
        staticClass: 'q-circular-progress__text absolute-full row flex-center content-center'
      },
      this.$slots.default
        ? this.$slots.default
        : [ h('div', [ this.value ]) ]
      )
    ])
  }
}
