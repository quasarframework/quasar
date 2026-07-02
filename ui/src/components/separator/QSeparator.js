import { getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'

import useSeparator, { useSeparatorProps } from './use-separator.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/separator
 */
export default createComponent({
  name: 'QSeparator',

  props: useSeparatorProps,

  setup(props) {
    const vm = getCurrentInstance()
    const separator = useSeparator(props, vm.proxy.$q)

    return () =>
      h('hr', {
        class: separator.classes.value,
        style: separator.style.value,
        'aria-orientation': separator.orientation.value
      })
  }
})
