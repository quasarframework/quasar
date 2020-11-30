import { h, defineComponent, computed } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useSize, { useSizeProps } from '../../composables/use-size.js'

import { hMergeSlotSafely } from '../../utils/composition-render.js'
import { between } from '../../utils/format.js'

const
  radius = 50,
  diameter = 2 * radius,
  circumference = diameter * Math.PI,
  strokeDashArray = Math.round(circumference * 1000) / 1000

// used by QKnob
export const commonProps = {
  ...useSizeProps,

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

  showValue: Boolean,
  reverse: Boolean,

  instantFeedback: Boolean
}

export default defineComponent({
  name: 'QCircularProgress',

  props: {
    value: {
      type: Number,
      default: 0
    },

    indeterminate: Boolean,

    ...commonProps
  },

  setup (props, { slots }) {
    const $q = useQuasar()
    const { sizeStyle } = useSize(props)

    const svgStyle = computed(() => ({
      transform: `rotate3d(0, 0, 1, ${props.angle - 90}deg)`
    }))

    const circleStyle = computed(() => props.instantFeedback !== true && props.indeterminate !== true
      ? { transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease' }
      : ''
    )

    const dir = computed(() => ($q.lang.rtl === true ? -1 : 1) * (props.reverse ? -1 : 1))

    const viewBox = computed(() => diameter / (1 - props.thickness / 2))

    const viewBoxAttr = computed(() =>
      `${viewBox.value / 2} ${viewBox.value / 2} ${viewBox.value} ${viewBox.value}`
    )

    const normalized = computed(() => between(props.value, props.min, props.max))

    const strokeDashOffset = computed(() => {
      const progress = 1 - (normalized.value - props.min) / (props.max - props.min)
      return (dir.value * progress) * circumference
    })

    const strokeWidth = computed(() => props.thickness / 2 * viewBox.value)

    function getCircle ({ thickness, offset, color, cls }) {
      return h('circle', {
        class: 'q-circular-progress__' + cls + (color !== void 0 ? ` text-${color}` : ''),
        style: circleStyle.value,
        fill: 'transparent',
        stroke: 'currentColor',
        'stroke-width': thickness,
        'stroke-dasharray': strokeDashArray,
        'stroke-dashoffset': offset,
        cx: viewBox.value,
        cy: viewBox.value,
        r: radius
      })
    }

    return () => {
      const svgChild = []

      props.centerColor !== void 0 && props.centerColor !== 'transparent' && svgChild.push(
        h('circle', {
          class: `q-circular-progress__center text-${props.centerColor}`,
          fill: 'currentColor',
          r: radius - strokeWidth.value / 2,
          cx: viewBox.value,
          cy: viewBox.value
        })
      )

      props.trackColor !== void 0 && props.trackColor !== 'transparent' && svgChild.push(
        getCircle({
          cls: 'track',
          thickness: strokeWidth.value,
          offset: 0,
          color: props.trackColor
        })
      )

      svgChild.push(
        getCircle({
          cls: 'circle',
          thickness: strokeWidth.value,
          offset: strokeDashOffset.value,
          color: props.color
        })
      )

      const child = [
        h('svg', {
          class: 'q-circular-progress__svg',
          style: svgStyle.value,
          viewBox: viewBoxAttr.value,
          'aria-hidden': 'true'
        }, svgChild)
      ]

      props.showValue === true && child.push(
        h('div', {
          class: 'q-circular-progress__text absolute-full row flex-center content-center',
          style: { fontSize: props.fontSize }
        }, slots.default !== void 0 ? slots.default() : [h('div', normalized.value)])
      )

      return h('div', {
        class: `q-circular-progress q-circular-progress--${props.indeterminate === true ? 'in' : ''}determinate`,
        style: sizeStyle.value,
        role: 'progressbar',
        'aria-valuemin': props.min,
        'aria-valuemax': props.max,
        'aria-valuenow': props.indeterminate === true ? void 0 : normalized.value
      }, hMergeSlotSafely(slots.internal, child)) // "internal" is used by QKnob
    }
  }
})
