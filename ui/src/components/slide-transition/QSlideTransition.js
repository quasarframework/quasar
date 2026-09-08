import { Transition, h } from 'vue'

import useSlideTransition from '../../composables/private.use-slide-transition/use-slide-transition.js'

import { createComponent } from '../../utils/private.create/create.js'

export default /*#__PURE__*/ createComponent({
  name: 'QSlideTransition',

  props: {
    appear: Boolean,
    duration: {
      type: Number,
      default: 300
    }
  },

  emits: ['show', 'hide'],

  setup(props, { slots, emit }) {
    const { onEnter, onLeave } = useSlideTransition(() => props.duration, emit)

    return () =>
      h(
        Transition,
        {
          css: false,
          appear: props.appear,
          onEnter,
          onLeave
        },
        slots.default
      )
  }
})
