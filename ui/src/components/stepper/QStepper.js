import { computed, getCurrentInstance, h, provide } from 'vue'

import StepHeader from './StepHeader.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import usePanel, {
  usePanelEmits,
  usePanelProps
} from '../../composables/private.use-panel/use-panel.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stepperKey } from '../../utils/private.symbols/symbols.js'
import { hDir, hMergeSlot, hSlot } from '../../utils/private.render/render.js'

const camelRE = /(-\w)/g

function camelizeProps(props) {
  const acc = {}
  for (const key in props) {
    const newKey = key.replace(camelRE, m => m[1].toUpperCase())
    acc[newKey] = props[key]
  }
  return acc
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/stepper
 */
/**
 * Suggestion: QStep
 *
 * @api slot default
 */

/**
 * Slot specific for the global navigation; Suggestion: QStepperNavigation
 *
 * @api slot navigation
 */

/**
 * Slot specific for putting a message on top of each step (if horizontal stepper) or above steps (if vertical); Suggestion: QBanner, div.q-pa-lg
 *
 * @api slot message
 */
export default createComponent({
  name: 'QStepper',

  props: {
    ...useDarkProps,
    ...usePanelProps,

    /**
     * @api prop flat
     * @extends flat
     */
    flat: Boolean,
    /**
     * @api prop bordered
     * @extends bordered
     */
    bordered: Boolean,
    /**
     * Use alternative labels - stacks the icon on top of the label (applies only to horizontal stepper)
     *
     * @api prop alternative-labels
     * @type {Boolean}
     * @category header
     */
    alternativeLabels: Boolean,
    /**
     * Allow navigation through the header
     *
     * @api prop header-nav
     * @type {Boolean}
     * @category behavior
     */
    headerNav: Boolean,
    /**
     * Hide header labels on narrow windows
     *
     * @api prop contracted
     * @type {Boolean}
     * @category header|behavior
     */
    contracted: Boolean,
    /**
     * Class definitions to be attributed to the header
     *
     * @api prop header-class
     * @type {String}
     * @category style
     * @example 'my-special-class'
     */
    headerClass: String,

    /**
     * @api prop inactive-color
     * @extends color
     * @category header
     */
    inactiveColor: String,
    /**
     * @api prop inactive-icon
     * @extends icon
     * @category header
     */
    inactiveIcon: String,
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
    errorColor: String
  },

  emits: usePanelEmits,

  setup(props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const {
      updatePanelsList,
      isValidPanelName,
      updatePanelIndex,
      getPanelContent,
      getPanels,
      panelDirectives,
      goToPanel,
      keepAliveProps,
      needsUniqueKeepAliveWrapper
    } = usePanel()

    provide(
      stepperKey,
      computed(() => ({
        goToPanel,
        keepAliveProps,
        needsUniqueKeepAliveWrapper,
        ...props
      }))
    )

    const classes = computed(
      () =>
        `q-stepper q-stepper--${props.vertical ? 'vertical' : 'horizontal'}` +
        (props.flat ? ' q-stepper--flat' : '') +
        (props.bordered ? ' q-stepper--bordered' : '') +
        (isDark.value ? ' q-stepper--dark q-dark' : '')
    )

    const headerClasses = computed(
      () =>
        'q-stepper__header row items-stretch justify-between' +
        ` q-stepper__header--${props.alternativeLabels ? 'alternative' : 'standard'}-labels` +
        (props.bordered || !props.flat ? ' q-stepper__header--border' : '') +
        (props.contracted ? ' q-stepper__header--contracted' : '') +
        (props.headerClass !== void 0 ? ` ${props.headerClass}` : '')
    )

    function getContent() {
      const top = hSlot(slots.message, [])

      if (props.vertical) {
        if (isValidPanelName(props.modelValue)) updatePanelIndex()

        const content = h(
          'div',
          {
            class: 'q-stepper__content'
          },
          hSlot(slots.default)
        )

        // oxlint-disable-next-line unicorn/prefer-spread
        return top === void 0 ? [content] : top.concat(content)
      }

      return [
        h(
          'div',
          { class: headerClasses.value },
          getPanels().map(panel => {
            const step = camelizeProps(panel.props)

            return h(StepHeader, {
              key: step.name,
              stepper: props,
              step,
              goToPanel
            })
          })
        ),

        top,

        hDir(
          'div',
          { class: 'q-stepper__content q-panel-parent' },
          getPanelContent(),
          'cont',
          props.swipeable,
          () => panelDirectives.value
        )
      ]
    }

    return () => {
      updatePanelsList(slots)

      return h(
        'div',
        {
          class: classes.value
        },
        hMergeSlot(slots.navigation, getContent())
      )
    }
  }
})
