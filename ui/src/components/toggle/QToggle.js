import { h, computed } from 'vue'

import QIcon from '../icon/QIcon.js'

import useCheckbox, { useCheckboxProps, useCheckboxEmits } from '../checkbox/use-checkbox.js'

import { createComponent } from '../../utils/private/create.js'

export default createComponent({
  name: 'QToggle',

  props: {
    ...useCheckboxProps,

    icon: String,
    iconColor: String
  },

  emits: useCheckboxEmits,

  setup (props) {
    function getInner (isTrue, isIndeterminate) {
      const icon = computed(() =>
        (isTrue.value === true
          ? props.checkedIcon
          : (isIndeterminate.value === true ? props.indeterminateIcon : props.uncheckedIcon)
        ) || props.icon
      )

      const color = computed(() => (isTrue.value === true ? props.iconColor : null))

      return () => [
        h('div', { class: 'q-toggle__track' }),

        h('div', {
          class: 'q-toggle__thumb absolute flex flex-center no-wrap'
        }, icon.value !== void 0
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
