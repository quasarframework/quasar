import { h, computed, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { createComponent } from '../../utils/private/create.js'
import { hSlot } from '../../utils/private/render.js'

export const skeletonTypes = [
  'text', 'rect', 'circle',
  'QBtn', 'QBadge', 'QChip', 'QToolbar',
  'QCheckbox', 'QRadio', 'QToggle',
  'QSlider', 'QRange', 'QInput',
  'QAvatar'
]

export const skeletonAnimations = [
  'wave', 'pulse', 'pulse-x', 'pulse-y', 'fade', 'blink', 'none'
]

export default createComponent({
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
      type: [ String, Number ],
      default: 1500
    },

    square: Boolean,
    bordered: Boolean,

    size: String,
    width: String,
    height: String
  },

  setup (props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const style = computed(() => {
      const size = props.size !== void 0
        ? [ props.size, props.size ]
        : [ props.width, props.height ]

      return {
        '--q-skeleton-speed': `${ props.animationSpeed }ms`,
        width: size[ 0 ],
        height: size[ 1 ]
      }
    })

    const classes = computed(() =>
      `q-skeleton q-skeleton--${ isDark.value === true ? 'dark' : 'light' } q-skeleton--type-${ props.type }`
      + (props.animation !== 'none' ? ` q-skeleton--anim q-skeleton--anim-${ props.animation }` : '')
      + (props.square === true ? ' q-skeleton--square' : '')
      + (props.bordered === true ? ' q-skeleton--bordered' : '')
    )

    return () => h(props.tag, {
      class: classes.value,
      style: style.value
    }, hSlot(slots.default))
  }
})
