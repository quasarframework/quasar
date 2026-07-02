import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/space
 */
export default createComponent({
  name: 'QSpace',

  setup() {
    const space = h('div', { class: 'q-space' })
    return () => space
  }
})
