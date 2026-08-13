import { h } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export const skeletonTypes = [
  'text',
  'rect',
  'circle',
  'QBtn',
  'QBadge',
  'QChip',
  'QToolbar',
  'QCheckbox',
  'QRadio',
  'QToggle',
  'QSlider',
  'QRange',
  'QInput',
  'QAvatar'
]

export const skeletonAnimations = [
  'wave',
  'pulse',
  'pulse-x',
  'pulse-y',
  'fade',
  'blink',
  'none'
]

export default /*#__PURE__*/ createComponent({
  name: 'QSkeleton',

  props: {
    ...useDarkProps,

    tag: {
      type: String,
      default: 'div'
    },

    type: {
      type: String,
      validator: v => skeletonTypes.includes(v),
      default: 'rect'
    },

    animation: {
      type: String,
      validator: v => skeletonAnimations.includes(v),
      default: 'wave'
    },
    animationSpeed: {
      type: [String, Number],
      default: 1500
    },

    square: Boolean,
    bordered: Boolean,

    size: String,
    width: String,
    height: String
  },

  setup(props, { slots }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    return () =>
      h(
        props.tag,
        {
          class:
            `q-skeleton q-skeleton--${isDark() ? 'dark' : 'light'} q-skeleton--type-${props.type}` +
            (props.animation !== 'none'
              ? ` q-skeleton--anim q-skeleton--anim-${props.animation}`
              : '') +
            (props.square ? ' q-skeleton--square' : '') +
            (props.bordered ? ' q-skeleton--bordered' : ''),
          style: {
            '--q-skeleton-speed': `${props.animationSpeed}ms`,
            width: props.size !== void 0 ? props.size : props.width,
            height: props.size !== void 0 ? props.size : props.height
          }
        },
        hSlot(slots.default)
      )
  }
})
