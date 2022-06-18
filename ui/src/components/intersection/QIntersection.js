import { h, ref, computed, Transition } from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/Platform.js'

import Intersection from '../../directives/Intersection.js'

import { createComponent } from '../../utils/private/create.js'
import { hSlot, hDir } from '../../utils/private/render.js'

export default createComponent({
  name: 'QIntersection',

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    once: Boolean,
    transition: String,
    transitionDuration: {
      type: [ String, Number ],
      default: 300
    },

    ssrPrerender: Boolean,

    margin: String,
    threshold: [ Number, Array ],
    root: {
      default: null
    },

    disable: Boolean,

    onVisibility: Function
  },

  setup (props, { slots, emit }) {
    const showing = ref(isRuntimeSsrPreHydration.value === true ? props.ssrPrerender : false)

    const intersectionProps = computed(() => (
      props.root !== void 0 || props.margin !== void 0 || props.threshold !== void 0
        ? {
            handler: trigger,
            cfg: {
              root: props.root,
              rootMargin: props.margin,
              threshold: props.threshold
            }
          }
        : trigger
    ))

    const hasDirective = computed(() =>
      props.disable !== true
      && (isRuntimeSsrPreHydration.value !== true || props.once !== true || props.ssrPrerender !== true)
    )

    const directives = computed(() => {
      // if hasDirective.value === true
      return [ [
        Intersection,
        intersectionProps.value,
        void 0,
        { once: props.once }
      ] ]
    })

    const transitionStyle = computed(
      () => `--q-transition-duration: ${ props.transitionDuration }ms`
    )

    function trigger (entry) {
      if (showing.value !== entry.isIntersecting) {
        showing.value = entry.isIntersecting
        props.onVisibility !== void 0 && emit('visibility', showing.value)
      }
    }

    function getContent () {
      return showing.value === true
        ? [ h('div', { key: 'content', style: transitionStyle.value }, hSlot(slots.default)) ]
        : void 0
    }

    return () => {
      const child = props.transition
        ? [
            h(Transition, {
              name: 'q-transition--' + props.transition
            }, getContent)
          ]
        : getContent()

      return hDir(
        props.tag,
        { class: 'q-intersection' },
        child,
        'main',
        hasDirective.value,
        () => directives.value
      )
    }
  }
})
