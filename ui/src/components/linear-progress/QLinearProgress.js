import { h, computed, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private.use-dark/use-dark.js'
import useSize, { useSizeProps } from '../../composables/private.use-size/use-size.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot } from '../../utils/private.render/render.js'

const defaultSizes = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14
}

function width (val, reverse, $q) {
  return {
    transform: reverse === true
      ? `translateX(${ $q.lang.rtl === true ? '-' : '' }100%) scale3d(${ -val },1,1)`
      : `scale3d(${ val },1,1)`
  }
}

export default createComponent({
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

    animationSpeed: {
      type: [ String, Number ],
      default: 2100
    },

    instantFeedback: Boolean
  },

  setup (props, { slots }) {
    const { proxy } = getCurrentInstance()
    const isDark = useDark(props, proxy.$q)
    const sizeStyle = useSize(props, defaultSizes)

    const motion = computed(() => props.indeterminate === true || props.query === true)
    const widthReverse = computed(() => props.reverse !== props.query)
    const style = computed(() => ({
      ...(sizeStyle.value !== null ? sizeStyle.value : {}),
      '--q-linear-progress-speed': `${ props.animationSpeed }ms`
    }))

    const classes = computed(() =>
      'q-linear-progress'
      + (props.color !== void 0 ? ` text-${ props.color }` : '')
      + (props.reverse === true || props.query === true ? ' q-linear-progress--reverse' : '')
      + (props.rounded === true ? ' rounded-borders' : '')
    )

    const trackStyle = computed(() => width(props.buffer !== void 0 ? props.buffer : 1, widthReverse.value, proxy.$q))
    const transitionSuffix = computed(() => `with${ props.instantFeedback === true ? 'out' : '' }-transition`)

    const trackClass = computed(() =>
      'q-linear-progress__track absolute-full'
      + ` q-linear-progress__track--${ transitionSuffix.value }`
      + ` q-linear-progress__track--${ isDark.value === true ? 'dark' : 'light' }`
      + (props.trackColor !== void 0 ? ` bg-${ props.trackColor }` : '')
    )

    const modelStyle = computed(() => width(motion.value === true ? 1 : props.value, widthReverse.value, proxy.$q))
    const modelClass = computed(() =>
      'q-linear-progress__model absolute-full'
      + ` q-linear-progress__model--${ transitionSuffix.value }`
      + ` q-linear-progress__model--${ motion.value === true ? 'in' : '' }determinate`
    )

    const stripeStyle = computed(() => ({ width: `${ props.value * 100 }%` }))
    const stripeClass = computed(() =>
      `q-linear-progress__stripe absolute-${ props.reverse === true ? 'right' : 'left' }`
      + ` q-linear-progress__stripe--${ transitionSuffix.value }`
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

      props.stripe === true && motion.value === false && child.push(
        h('div', {
          class: stripeClass.value,
          style: stripeStyle.value
        })
      )

      return h('div', {
        class: classes.value,
        style: style.value,
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
