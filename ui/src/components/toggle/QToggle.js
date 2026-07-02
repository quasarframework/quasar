import { computed, h } from 'vue'

import QIcon from '../icon/QIcon.js'

import useCheckbox from '../checkbox/use-checkbox.js'
import { useToggleEmits, useToggleProps } from './use-toggle.js'

import { createComponent } from '../../utils/private.create/create.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/toggle
 */
/**
 * Default slot can be used as label, unless 'label' prop is specified; Suggestion: string
 *
 * @api slot default
 */
export default createComponent({
  name: 'QToggle',

  props: useToggleProps,

  emits: useToggleEmits,

  setup(props) {
    function getInner(isTrue, isIndeterminate) {
      const icon = computed(
        () =>
          (isTrue.value
            ? props.checkedIcon
            : isIndeterminate.value
              ? props.indeterminateIcon
              : props.uncheckedIcon) || props.icon
      )

      const color = computed(() => (isTrue.value ? props.iconColor : null))

      return () => [
        h('div', { class: 'q-toggle__track' }),

        h(
          'div',
          {
            class: 'q-toggle__thumb absolute flex flex-center no-wrap'
          },
          icon.value !== void 0
            ? [
                h(QIcon, {
                  name: icon.value,
                  color: color.value
                })
              ]
            : void 0
        )
      ]
    }

    return useCheckbox('toggle', getInner)
  }
})
