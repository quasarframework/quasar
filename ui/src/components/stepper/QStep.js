import { KeepAlive, computed, getCurrentInstance, h, inject, ref } from 'vue'

import QSlideTransition from '../slide-transition/QSlideTransition.js'
import StepHeader from './StepHeader.js'

import { usePanelChildProps } from '../../composables/private.use-panel/use-panel.js'
import useRenderCache from '../../composables/use-render-cache/use-render-cache.js'

import { createComponent } from '../../utils/private.create/create.js'
import {
  emptyRenderFn,
  stepperKey
} from '../../utils/private.symbols/symbols.js'
import { hSlot } from '../../utils/private.render/render.js'

function getStepWrapper(slots) {
  return h(
    'div',
    {
      class: 'q-stepper__step-content'
    },
    [
      h(
        'div',
        {
          class: 'q-stepper__step-inner'
        },
        hSlot(slots.default)
      )
    ]
  )
}

const PanelWrapper = {
  setup(_, { slots }) {
    return () => getStepWrapper(slots)
  }
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/stepper
 */
/**
 * The content of the step; Can also contain a QStepperNavigation if you want to handle step navigation and don't have a global navigation in place
 *
 * @api slot default
 */
export default createComponent({
  name: 'QStep',

  props: {
    ...usePanelChildProps,

    /**
     * @api prop icon
     * @extends icon
     * @category header
     */
    icon: String,
    /**
     * @api prop color
     * @extends color
     */
    color: String,
    /**
     * Step title
     *
     * @api prop title
     * @type {String}
     * @category header
     * @required
     * @example 'Ad Groups'
     * @example 'Payment'
     */
    title: {
      type: String,
      required: true
    },
    /**
     * Step’s additional information that appears beneath the title
     *
     * @api prop caption
     * @type {String}
     * @category header
     * @example 'Create an account'
     * @example 'Payment details'
     */
    caption: String,
    /**
     * Step's prefix (max 2 characters) which replaces the icon if step does not has error, is being edited or is marked as done
     *
     * @api prop prefix
     * @type {String|Number}
     * @category header
     * @example '1'
     * @example 2
     * @example 'A'
     */
    prefix: [String, Number],

    /**
     * Icon name following Quasar convention; If 'none' (String) is used as value, then it will defer to prefix or the regular icon for this state; Make sure you have the icon library installed unless you are using 'img:' prefix
     *
     * @api prop done-icon
     * @extends icon
     * @category header
     */
    doneIcon: String,
    /**
     * @api prop done-color
     * @extends color
     * @category header
     */
    doneColor: String,
    /**
     * Icon name following Quasar convention; If 'none' (String) is used as value, then it will defer to prefix or the regular icon for this state; Make sure you have the icon library installed unless you are using 'img:' prefix
     *
     * @api prop active-icon
     * @extends icon
     * @category header
     */
    activeIcon: String,
    /**
     * @api prop active-color
     * @extends color
     * @category header
     */
    activeColor: String,
    /**
     * Icon name following Quasar convention; If 'none' (String) is used as value, then it will defer to prefix or the regular icon for this state; Make sure you have the icon library installed unless you are using 'img:' prefix
     *
     * @api prop error-icon
     * @extends icon
     * @category header
     */
    errorIcon: String,
    /**
     * @api prop error-color
     * @extends color
     * @category header
     */
    errorColor: String,

    /**
     * Allow navigation through the header
     *
     * @api prop header-nav
     * @type {Boolean}
     * @default true
     * @category behavior
     */
    headerNav: {
      type: Boolean,
      default: true
    },
    done: Boolean,
    error: Boolean,

    onScroll: [Function, Array]
  },

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const $stepper = inject(stepperKey, emptyRenderFn)
    if ($stepper === emptyRenderFn) {
      console.error('QStep needs to be a child of QStepper')
      return emptyRenderFn
    }

    const { getCache } = useRenderCache()

    const rootRef = ref(null)

    const isActive = computed(() => $stepper.value.modelValue === props.name)

    const scrollEvent = computed(() =>
      (!$q.platform.is.ios && $q.platform.is.chrome) ||
      !isActive.value ||
      !$stepper.value.vertical
        ? {}
        : {
            onScroll(e) {
              const { target } = e
              if (target.scrollTop > 0) {
                target.scrollTop = 0
              }

              if (props.onScroll !== void 0) emit('scroll', e)
            }
          }
    )

    const contentKey = computed(() =>
      typeof props.name === 'string' || typeof props.name === 'number'
        ? props.name
        : String(props.name)
    )

    function getStepContent() {
      const vertical = $stepper.value.vertical

      if (vertical && $stepper.value.keepAlive) {
        return h(
          KeepAlive,
          $stepper.value.keepAliveProps.value,
          isActive.value
            ? [
                h(
                  $stepper.value.needsUniqueKeepAliveWrapper.value
                    ? getCache(contentKey.value, () => ({
                        ...PanelWrapper,
                        name: contentKey.value
                      }))
                    : PanelWrapper,
                  { key: contentKey.value },
                  slots.default
                )
              ]
            : void 0
        )
      }

      return !vertical || isActive.value ? getStepWrapper(slots) : void 0
    }

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class: 'q-stepper__step',
          role: 'tabpanel',
          ...scrollEvent.value
        },
        $stepper.value.vertical
          ? [
              h(StepHeader, {
                stepper: $stepper.value,
                step: props,
                goToPanel: $stepper.value.goToPanel
              }),

              $stepper.value.animated
                ? h(QSlideTransition, getStepContent)
                : getStepContent()
            ]
          : [getStepContent()]
      )
  }
})
