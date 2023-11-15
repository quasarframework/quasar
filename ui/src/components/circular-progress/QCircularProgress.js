import { h, computed, getCurrentInstance } from 'vue'

import useSize from '../../composables/private/use-size.js'
import { useCircularCommonProps } from './use-circular-progress.js'

import { createComponent } from '../../utils/private/create.js'
import { hMergeSlotSafely } from '../../utils/private/render.js'
import { between } from '../../utils/format.js'

const
  radius = 50,
  diameter = 2 * radius,
  circumference = diameter * Math.PI,
  strokeDashArray = Math.round(circumference * 1000) / 1000

export default createComponent({
  name: 'QCircularProgress',

  props: {
    ...useCircularCommonProps,

    value: {
      type: Number,
      default: 0
    },

    animationSpeed: {
      type: [ String, Number ],
      default: 600
    },

    indeterminate: Boolean
  },

  setup (props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance()
    const sizeStyle = useSize(props)

    const viewBox = computed(() => diameter / (1 - props.thickness / 2))

    const strokeWidth = computed(() => props.thickness / 2 * viewBox.value)

    const svgStyle = computed(() => {
      const strokeWidthAngle = props.rounded === true ? 180 * strokeWidth.value / circumference : 0
      const angle = ($q.lang.rtl === true ? -1 : 1) * props.angle

      return {
        transform: props.reverse !== ($q.lang.rtl === true)
          ? `scale3d(-1, 1, 1) rotate3d(0, 0, 1, ${ -90 - angle + strokeWidthAngle }deg)`
          : `rotate3d(0, 0, 1, ${ angle + strokeWidthAngle - 90 }deg)`
      }
    })

    const circleStyle = computed(() => (
      props.instantFeedback !== true && props.indeterminate !== true
        ? { transition: `stroke-dashoffset ${ props.animationSpeed }ms ease 0s, stroke ${ props.animationSpeed }ms ease` }
        : ''
    ))


    const viewBoxAttr = computed(() =>
      `${ viewBox.value / 2 } ${ viewBox.value / 2 } ${ viewBox.value } ${ viewBox.value }`
    )

    const normalized = computed(() => between(props.value, props.min, props.max))

    const strokeDashOffset = computed(() => {
      const strokeLength = circumference * (normalized.value - props.min) / (props.max - props.min)

      return circumference - strokeLength + (props.rounded === true && normalized.value !== props.max && strokeLength > strokeWidth.value ? strokeWidth.value : 0)
    })

    function getCircle ({ thickness, offset, color, cls, rounded }) {
      return h('circle', {
        class: 'q-circular-progress__' + cls + (color !== void 0 ? ` text-${ color }` : ''),
        style: circleStyle.value,
        fill: 'transparent',
        stroke: 'currentColor',
        'stroke-width': thickness,
        'stroke-dasharray': strokeDashArray,
        'stroke-dashoffset': offset,
        'stroke-linecap': rounded,
        cx: viewBox.value,
        cy: viewBox.value,
        r: radius
      })
    }

    return () => {
      const svgChild = []

      props.centerColor !== void 0 && props.centerColor !== 'transparent' && svgChild.push(
        h('circle', {
          class: `q-circular-progress__center text-${ props.centerColor }`,
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
          color: props.color,
          rounded: props.rounded === true ? 'round' : void 0
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
        }, slots.default !== void 0 ? slots.default() : [ h('div', normalized.value) ])
      )

      return h('div', {
        class: `q-circular-progress q-circular-progress--${ props.indeterminate === true ? 'in' : '' }determinate`,
        style: sizeStyle.value,
        role: 'progressbar',
        'aria-valuemin': props.min,
        'aria-valuemax': props.max,
        'aria-valuenow': props.indeterminate === true ? void 0 : normalized.value
      }, hMergeSlotSafely(slots.internal, child)) // "internal" is used by QKnob
    }
  }
})
