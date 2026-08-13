import { h } from 'vue'

import QIcon from '../icon/QIcon.js'

import { createComponent } from '../../utils/private.create/create.js'
import useCheckbox, {
  useCheckboxEmits,
  useCheckboxProps
} from './use-checkbox.js'

const createBgNode = () =>
  h(
    'div',
    {
      key: 'svg',
      class: 'q-checkbox__bg absolute'
    },
    [
      h(
        'svg',
        {
          class: 'q-checkbox__svg fit absolute-full',
          viewBox: '0 0 24 24'
        },
        [
          h('path', {
            class: 'q-checkbox__truthy',
            fill: 'none',
            d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
          }),

          h('path', {
            class: 'q-checkbox__indet',
            d: 'M4,14H20V10H4'
          })
        ]
      )
    ]
  )

export default /*#__PURE__*/ createComponent({
  name: 'QCheckbox',

  props: useCheckboxProps,
  emits: useCheckboxEmits,

  setup(props) {
    const bgNode = createBgNode()

    function getInner(isTrue, isIndeterminate) {
      return () => {
        const icon =
          (isTrue.value
            ? props.checkedIcon
            : isIndeterminate.value
              ? props.indeterminateIcon
              : props.uncheckedIcon) || null

        return icon !== null
          ? [
              h(
                'div',
                {
                  key: 'icon',
                  class:
                    'q-checkbox__icon-container absolute-full flex flex-center no-wrap'
                },
                [
                  h(QIcon, {
                    class: 'q-checkbox__icon',
                    name: icon
                  })
                ]
              )
            ]
          : [bgNode]
      }
    }

    return useCheckbox('checkbox', getInner)
  }
})
