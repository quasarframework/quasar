import { Transition, computed, h, watch } from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/platform/Platform.js'

import useIntersection from '../../composables/use-intersection/use-intersection.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QIntersection',

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    once: Boolean,
    transition: String,
    transitionDuration: {
      type: [String, Number],
      default: 300
    },

    ssrPrerender: Boolean,

    margin: String,
    threshold: [Number, Array],
    root: {
      default: null
    },

    disable: Boolean,

    onVisibility: Function
  },

  setup(props, { slots, emit }) {
    // observes the component's root element; disabling goes through
    // the options instead of tearing down the observed element
    // (which would re-create the content; #12668)
    const { isIntersecting: showing } = useIntersection(() => ({
      root: props.root,
      rootMargin: props.margin,
      threshold: props.threshold,
      once: props.once,
      disabled: props.disable
    }))

    if (isRuntimeSsrPreHydration.value && props.ssrPrerender) {
      showing.value = true
    }

    if (props.onVisibility !== void 0) {
      watch(
        showing,
        value => {
          emit('visibility', value)
        },
        { flush: 'sync' }
      )
    }

    const transitionStyle = computed(
      () => `--q-transition-duration: ${props.transitionDuration}ms`
    )

    function getContent() {
      if (showing.value) {
        return [
          h(
            'div',
            { key: 'content', style: transitionStyle.value },
            hSlot(slots.default)
          )
        ]
      }

      if (slots.hidden !== void 0) {
        return [
          h(
            'div',
            { key: 'hidden', style: transitionStyle.value },
            slots.hidden()
          )
        ]
      }
    }

    return () => {
      const child = props.transition
        ? [
            h(
              Transition,
              {
                name: 'q-transition--' + props.transition
              },
              getContent
            )
          ]
        : getContent()

      return h(props.tag, { class: 'q-intersection' }, child)
    }
  }
})
