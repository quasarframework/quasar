import { Transition, computed, h, ref } from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/platform/Platform.js'

import Intersection from '../../directives/intersection/Intersection.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hDir, hSlot } from '../../utils/private.render/render.js'

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
    const showing = ref(
      isRuntimeSsrPreHydration.value ? props.ssrPrerender : false
    )

    const intersectionProps = computed(() =>
      props.root !== void 0 ||
      props.margin !== void 0 ||
      props.threshold !== void 0
        ? {
            handler: trigger,
            cfg: {
              root: props.root,
              rootMargin: props.margin,
              threshold: props.threshold
            }
          }
        : trigger
    )

    const directives = computed(() => [
      [
        Intersection,
        props.disable ? false : intersectionProps.value,
        void 0,
        { once: props.once }
      ]
    ])

    const transitionStyle = computed(
      () => `--q-transition-duration: ${props.transitionDuration}ms`
    )

    function trigger(entry) {
      if (showing.value !== entry.isIntersecting) {
        showing.value = entry.isIntersecting
        if (props.onVisibility !== void 0) emit('visibility', showing.value)
      }
    }

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

      return hDir(
        props.tag,
        { class: 'q-intersection' },
        child,
        'main',
        // hDir bakes this into the vnode key, so a flip re-creates the whole
        // content (#17099); disabling goes through the directive value (#12668)
        true,
        () => directives.value
      )
    }
  }
})
