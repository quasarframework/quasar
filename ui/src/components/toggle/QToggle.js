import { h, defineComponent, computed } from 'vue'

import QIcon from '../icon/QIcon.js'
import useCheckbox, { useCheckboxProps, useCheckboxEmits } from '../checkbox/use-checkbox.js'

export default defineComponent({
  name: 'QToggle',

  props: {
    ...useCheckboxProps,

    icon: String,
    checkedIcon: String,
    uncheckedIcon: String,
    indeterminateIcon: String,

    iconColor: String
  },

  emits: useCheckboxEmits,

  setup (props) {
    function getInner (isTrue, isIndeterminate) {
      const computedIcon = computed(() =>
        (isTrue.value === true
          ? props.checkedIcon
          : (isIndeterminate.value === true ? props.indeterminateIcon : props.uncheckedIcon)
        ) || props.icon
      )

      const computedIconColor = computed(() => {
        if (isTrue.value === true) {
          return props.iconColor
        }
      })

      return () => [
        h('div', { class: 'q-toggle__track' }),

        h('div', {
          class: 'q-toggle__thumb absolute flex flex-center no-wrap'
        }, computedIcon.value !== void 0
          ? [
              h(QIcon, {
                name: computedIcon.value,
                color: computedIconColor.value
              })
            ]
          : void 0
        )
      ]
    }

    return useCheckbox('toggle', getInner)
  }
})
