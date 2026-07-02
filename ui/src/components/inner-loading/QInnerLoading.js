import { Transition, computed, getCurrentInstance, h } from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import { createComponent } from '../../utils/private.create/create.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useTransition, {
  useTransitionProps
} from '../../composables/private.use-transition/use-transition.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/inner-loading
 */
/**
 * Default slot is used for replacing default Spinner; Suggestions: a spinner or text
 *
 * @api slot default
 */
export default createComponent({
  name: 'QInnerLoading',

  props: {
    ...useDarkProps,
    ...useTransitionProps,

    /**
     * State - loading or not
     *
     * @api prop showing
     * @type {Boolean}
     * @category state
     */
    showing: Boolean,
    /**
     * Color name for component from the Quasar Color Palette for the inner Spinner (unless using the default slot)
     *
     * @api prop color
     * @extends color
     */
    color: String,

    /**
     * Size in CSS units, including unit name, or standard size name (xs|sm|md|lg|xl), for the inner Spinner (unless using the default slot)
     *
     * @api prop size
     * @type {String|Number}
     * @default '42px'
     */
    size: {
      type: [String, Number],
      default: '42px'
    },

    /**
     * Add a label; Gets overriden when using the default slot
     *
     * @api prop label
     * @type {String}
     * @category label
     * @added-in v2.2
     * @example 'Please wait...'
     */
    label: String,
    /**
     * Add CSS class(es) to the label; Works along the 'label' prop only
     *
     * @api prop label-class
     * @type {String}
     * @category label
     * @added-in v2.2
     * @example 'text-red q-mt-xl'
     */
    labelClass: String,
    /**
     * Apply custom style to the label; Works along the 'label' prop only
     *
     * @api prop label-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category label
     * @added-in v2.2
     * @example 'font-size: 28px'
     * @example { color: '#ff0000' }
     */
    labelStyle: [String, Array, Object]
  },

  setup(props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const { transitionProps, transitionStyle } = useTransition(props)

    const classes = computed(
      () =>
        'q-inner-loading q--avoid-card-border absolute-full column flex-center' +
        (isDark.value ? ' q-inner-loading--dark' : '')
    )

    const labelClass = computed(
      () =>
        'q-inner-loading__label' +
        (props.labelClass !== void 0 ? ` ${props.labelClass}` : '')
    )

    function getInner() {
      const child = [
        h(QSpinner, {
          size: props.size,
          color: props.color
        })
      ]

      if (props.label !== void 0) {
        child.push(
          h(
            'div',
            {
              class: labelClass.value,
              style: props.labelStyle
            },
            [props.label]
          )
        )
      }

      return child
    }

    function getContent() {
      return props.showing
        ? h(
            'div',
            { class: classes.value, style: transitionStyle.value },
            slots.default !== void 0 ? slots.default() : getInner()
          )
        : null
    }

    return () => h(Transition, transitionProps.value, getContent)
  }
})
