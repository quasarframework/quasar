import { computed, h } from 'vue'

import QIcon from '../icon/QIcon.js'

import useCheckbox, {
  useCheckboxEmits,
  useCheckboxProps
} from '../checkbox/use-checkbox.js'

import { createComponent } from '../../utils/private.create/create.js'

export default /*#__PURE__*/ createComponent({
  name: 'QToggle',

  props: {
    ...useCheckboxProps,

    icon: String,
    iconColor: String
  },

  emits: useCheckboxEmits,

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
