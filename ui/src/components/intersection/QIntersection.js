import { Transition, computed, h, ref } from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/platform/Platform.js'

import Intersection from '../../directives/intersection/Intersection.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hDir, hSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/intersection
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */

/**
 * Slot for content to render when component is not on screen; Example: a text that the user can search for with the browser's search function
 *
 * @api slot hidden
 */
export default createComponent({
  name: 'QIntersection',

  props: {
    /**
     * @api prop tag
     * @extends tag
     * @default 'div'
     * @example 'div'
     * @example 'span'
     * @example 'blockquote'
     */
    tag: {
      type: String,
      default: 'div'
    },

    /**
     * Get triggered only once
     *
     * @api prop once
     * @type {Boolean}
     * @category behavior
     */
    once: Boolean,
    /**
     * @api prop transition
     * @extends transition
     * @category behavior
     */
    transition: String,
    /**
     * Transition duration (in milliseconds, without unit)
     *
     * @api prop transition-duration
     * @type {String|Number}
     * @default 300
     * @category behavior
     * @added-in v2.3.1
     */
    transitionDuration: {
      type: [String, Number],
      default: 300
    },

    /**
     * Pre-render content on server side if using SSR (use it to pre-render above the fold content)
     *
     * @api prop ssr-prerender
     * @type {Boolean}
     * @category behavior
     */
    ssrPrerender: Boolean,

    /**
     * [Intersection API rootMargin prop] Allows you to specify the margins for the root, effectively allowing you to either grow or shrink the area used for intersections
     *
     * @api prop margin
     * @type {String}
     * @category behavior
     * @example '-20px 0px'
     * @example '10px 20px 30px 40px'
     */
    margin: String,
    /**
     * [Intersection API threshold prop] Threshold(s) at which to trigger, specified as a ratio, or list of ratios, of (visible area / total area) of the observed element
     *
     * @api prop threshold
     * @type {Array|Number}
     * @category behavior
     * @example [0, 0.25, 0.5, 0.75, 1]
     * @example 1
     */
    threshold: [Number, Array],
    /**
     * [Intersection API root prop] Lets you define an alternative to the viewport as your root (through its DOM element); It is important to keep in mind that root needs to be an ancestor of the observed element
     *
     * @api prop root
     * @type {Element|null}
     * @default null
     * @category behavior
     * @example document.getElementById('myTable')
     * @example $refs.myTable.$el
     */
    root: {
      default: null
    },

    /**
     * Disable visibility observable (content will remain as it was, visible or hidden)
     *
     * @api prop disable
     * @type {Boolean}
     * @category behavior
     */
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

    const hasDirective = computed(
      () =>
        !props.disable &&
        (!isRuntimeSsrPreHydration.value || !props.once || !props.ssrPrerender)
    )

    const directives = computed(() => [
      [Intersection, intersectionProps.value, void 0, { once: props.once }]
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
        hasDirective.value,
        () => directives.value
      )
    }
  }
})
