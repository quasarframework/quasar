import { h, defineComponent, computed } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/use-dark.js'
import useSize, { useSizeProps } from '../../composables/use-size.js'

import { hMergeSlot } from '../../utils/composition-render.js'

const defaultSizes = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14
}

function width (val, reverse) {
  return {
    transform: reverse === true
      ? `translateX(100%) scale3d(${-val},1,1)`
      : `scale3d(${val},1,1)`
  }
}

export default defineComponent({
  name: 'QLinearProgress',

  props: {
    ...useDarkProps,
    ...useSizeProps,

    value: {
      type: Number,
      default: 0
    },
    buffer: Number,

    color: String,
    trackColor: String,

    reverse: Boolean,
    stripe: Boolean,
    indeterminate: Boolean,
    query: Boolean,
    rounded: Boolean,

    instantFeedback: Boolean
  },

  setup (props, { slots }) {
    const $q = useQuasar()
    const { isDark } = useDark(props, $q)
    const { sizeStyle } = useSize(props, defaultSizes)

    const motion = computed(() => props.indeterminate === true || props.query === true)

    const classes = computed(() =>
      'q-linear-progress' +
      (props.color !== void 0 ? ` text-${props.color}` : '') +
      (props.reverse === true || props.query === true ? ' q-linear-progress--reverse' : '') +
      (props.rounded === true ? ' rounded-borders' : '')
    )

    const trackStyle = computed(() => width(props.buffer !== void 0 ? props.buffer : 1, props.reverse))
    const trackClass = computed(() =>
      'q-linear-progress__track absolute-full' +
      ` q-linear-progress__track--with${props.instantFeedback === true ? 'out' : ''}-transition` +
      ` q-linear-progress__track--${isDark.value === true ? 'dark' : 'light'}` +
      (props.trackColor !== void 0 ? ` bg-${props.trackColor}` : '')
    )

    const modelStyle = computed(() => width(motion.value === true ? 1 : props.value, props.reverse))
    const modelClass = computed(() =>
      'q-linear-progress__model absolute-full' +
      ` q-linear-progress__model--with${props.instantFeedback === true ? 'out' : ''}-transition` +
      ` q-linear-progress__model--${motion.value === true ? 'in' : ''}determinate`
    )

    const stripeStyle = computed(() => ({ width: `${props.value * 100}%` }))

    return () => {
      const child = [
        h('div', {
          class: trackClass.value,
          style: trackStyle.value
        }),

        h('div', {
          class: modelClass.value,
          style: modelStyle.value
        })
      ]

      props.stripe === true && motion.value === false && child.push(
        h('div', {
          class: 'q-linear-progress__stripe absolute-full',
          style: stripeStyle.value
        })
      )

      return h('div', {
        class: classes.value,
        style: sizeStyle.value,
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 1,
        'aria-valuenow': props.indeterminate === true
          ? void 0
          : props.value
      }, hMergeSlot(slots.default, child))
    }
  }
})
