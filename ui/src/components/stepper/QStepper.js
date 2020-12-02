import { h, defineComponent, computed, provide, getCurrentInstance } from 'vue'

import StepHeader from './StepHeader.js'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/use-dark.js'
import { usePanelParentProps, usePanelParent } from '../../composables/use-panel.js'

import { stepperKey } from '../../utils/symbols.js'
import { hSlot, hMergeSlot, hDir } from '../../utils/composition-render.js'

export default defineComponent({
  name: 'QStepper',

  props: {
    ...useDarkProps,
    ...usePanelParentProps,

    flat: Boolean,
    bordered: Boolean,
    alternativeLabels: Boolean,
    headerNav: Boolean,
    contracted: Boolean,
    headerClass: String,

    inactiveColor: String,
    inactiveIcon: String,
    doneIcon: String,
    doneColor: String,
    activeIcon: String,
    activeColor: String,
    errorIcon: String,
    errorColor: String
  },

  setup (props, { slots, emit }) {
    const $q = useQuasar()
    const { isDark } = useDark(props, $q)

    const vm = getCurrentInstance()
    const {
      updatePanelsList, isValidPanelName,
      updatePanelIndex, getPanelContent,
      getPanels, panelDirectives, goToPanel
    } = usePanelParent(props, emit, $q, vm)

    provide(stepperKey, computed(() => ({
      goToPanel,
      ...props
    })))

    const classes = computed(() =>
      `q-stepper q-stepper--${props.vertical === true ? 'vertical' : 'horizontal'}` +
      (props.flat === true || isDark.value === true ? ' q-stepper--flat no-shadow' : '') +
      (props.bordered === true || (isDark.value === true && props.flat === false) ? ' q-stepper--bordered' : '') +
      (props.contracted === true ? ' q-stepper--contracted' : '') +
      (isDark.value === true ? ' q-stepper--dark q-dark' : '')
    )

    const headerClasses = computed(() =>
      'q-stepper__header row items-stretch justify-between' +
      ` q-stepper__header--${props.alternativeLabels === true ? 'alternative' : 'standard'}-labels` +
      (props.flat === false || props.bordered === true ? ' q-stepper__header--border' : '') +
      (props.headerClass !== void 0 ? ` ${props.headerClass}` : '')
    )

    function getContent () {
      const top = hSlot(slots.message, [])

      if (props.vertical === true) {
        isValidPanelName(props.modelValue) && updatePanelIndex()

        const content = h('div', {
          class: 'q-stepper__content'
        }, hSlot(slots.default))

        return top === void 0
          ? [content]
          : top.concat(content)
      }

      return [
        h('div', { class: headerClasses.value }, getPanels().map(panel => {
          const step = panel.props

          return h(StepHeader, {
            key: step.name,
            stepper: props,
            step,
            goToPanel
          })
        }))
      ].concat(
        top,
        hDir(
          'div',
          { class: 'q-stepper__content q-panel-parent' },
          getPanelContent(),
          'cont',
          props.swipeable,
          () => panelDirectives.value
        )
      )
    }

    return () => {
      updatePanelsList(slots)

      return h('div', {
        class: classes.value
      }, hMergeSlot(slots.navigation, getContent()))
    }
  }
})
