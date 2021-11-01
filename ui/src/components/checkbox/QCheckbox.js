import { h } from 'vue'

import { createComponent } from '../../utils/private/create.js'
import useCheckbox, { useCheckboxProps, useCheckboxEmits } from './use-checkbox.js'

const bgNode = h('div', {
  class: 'q-checkbox__bg absolute'
}, [
  h('svg', {
    class: 'q-checkbox__svg fit absolute-full',
    viewBox: '0 0 24 24',
    'aria-hidden': 'true'
  }, [
    h('path', {
      class: 'q-checkbox__truthy',
      fill: 'none',
      d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
    }),

    h('path', {
      class: 'q-checkbox__indet',
      d: 'M4,14H20V10H4'
    })
  ])
])

export default createComponent({
  name: 'QCheckbox',

  props: useCheckboxProps,
  emits: useCheckboxEmits,

  setup () {
    return useCheckbox('checkbox', () => () => [ bgNode ])
  }
})
