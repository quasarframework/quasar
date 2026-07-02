import { computed, getCurrentInstance, h } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useSize, {
  useSizeProps
} from '../../composables/private.use-size/use-size.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot } from '../../utils/private.render/render.js'

const defaultSizes = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14
}

function width(val, reverse, $q) {
  return {
    transform: reverse
      ? `translateX(${$q.lang.rtl ? '-' : ''}100%) scale3d(${-val},1,1)`
      : `scale3d(${val},1,1)`
  }
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/linear-progress
 */
/**
 * Suggestion: QTooltip
 *
 * @api slot default
 */
export default createComponent({
  name: 'QLinearProgress',

  props: {
    ...useDarkProps,
    ...useSizeProps,

    /**
     * Progress value (0.0 < x < 1.0)
     *
     * @api prop value
     * @type {Number}
     * @default 0
     * @category model
     */
    value: {
      type: Number,
      default: 0
    },

    /**
     * Optional buffer value (0.0 < x < 1.0)
     *
     * @api prop buffer
     * @type {Number}
     * @category behavior
     */
    buffer: Number,

    /**
     * Color name for component from the Quasar Color Palette
     *
     * @api prop color
     * @extends color
     */
    color: String,

    /**
     * Color name for component's track from the Quasar Color Palette
     *
     * @api prop track-color
     * @extends color
     */
    trackColor: String,

    /**
     * Reverse direction of progress
     *
     * @api prop reverse
     * @type {Boolean}
     * @category behavior
     */
    reverse: Boolean,

    /**
     * Draw stripes; For determinate state only (for performance reasons)
     *
     * @api prop stripe
     * @type {Boolean}
     * @category content
     */
    stripe: Boolean,

    /**
     * Put component into indeterminate mode
     *
     * @api prop indeterminate
     * @type {Boolean}
     * @category behavior
     */
    indeterminate: Boolean,

    /**
     * Put component into query mode
     *
     * @api prop query
     * @type {Boolean}
     * @category behavior
     */
    query: Boolean,

    /**
     * Applies a small standard border-radius for a squared shape of the component
     *
     * @api prop rounded
     * @extends rounded
     */
    rounded: Boolean,

    /**
     * Animation speed, in milliseconds
     *
     * @api prop animation-speed
     * @extends animation-speed
     * @default 2100
     * @addedIn v2.3
     */
    animationSpeed: {
      type: [String, Number],
      default: 2100
    },

    /**
     * No transition when model changes
     *
     * @api prop instant-feedback
     * @type {Boolean}
     * @category behavior
     */
    instantFeedback: Boolean
  },

  setup(props, { slots }) {
    const { proxy } = getCurrentInstance()
    const isDark = useDark(props, proxy.$q)
    const sizeStyle = useSize(props, defaultSizes)

    const motion = computed(() => props.indeterminate || props.query)
    const widthReverse = computed(() => props.reverse !== props.query)
    const style = computed(() => ({
      ...(sizeStyle.value !== null ? sizeStyle.value : {}),
      '--q-linear-progress-speed': `${props.animationSpeed}ms`
    }))

    const classes = computed(
      () =>
        'q-linear-progress' +
        (props.color !== void 0 ? ` text-${props.color}` : '') +
        (props.reverse || props.query ? ' q-linear-progress--reverse' : '') +
        (props.rounded ? ' rounded-borders' : '')
    )

    const trackStyle = computed(() =>
      width(
        props.buffer !== void 0 ? props.buffer : 1,
        widthReverse.value,
        proxy.$q
      )
    )
    const transitionSuffix = computed(
      () => `with${props.instantFeedback ? 'out' : ''}-transition`
    )

    const trackClass = computed(
      () =>
        'q-linear-progress__track absolute-full' +
        ` q-linear-progress__track--${transitionSuffix.value}` +
        ` q-linear-progress__track--${isDark.value ? 'dark' : 'light'}` +
        (props.trackColor !== void 0 ? ` bg-${props.trackColor}` : '')
    )

    const modelStyle = computed(() =>
      width(motion.value ? 1 : props.value, widthReverse.value, proxy.$q)
    )
    const modelClass = computed(
      () =>
        'q-linear-progress__model absolute-full' +
        ` q-linear-progress__model--${transitionSuffix.value}` +
        ` q-linear-progress__model--${motion.value ? 'in' : ''}determinate`
    )

    const stripeStyle = computed(() => ({ width: `${props.value * 100}%` }))
    const stripeClass = computed(
      () =>
        `q-linear-progress__stripe absolute-${props.reverse ? 'right' : 'left'}` +
        ` q-linear-progress__stripe--${transitionSuffix.value}`
    )

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

      if (props.stripe && !motion.value) {
        child.push(
          h('div', {
            class: stripeClass.value,
            style: stripeStyle.value
          })
        )
      }

      return h(
        'div',
        {
          class: classes.value,
          style: style.value,
          role: 'progressbar',
          'aria-valuemin': 0,
          'aria-valuemax': 1,
          'aria-valuenow': props.indeterminate ? void 0 : props.value
        },
        hMergeSlot(slots.default, child)
      )
    }
  }
})
