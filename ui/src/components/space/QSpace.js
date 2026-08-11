import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'

export default /*#__PURE__*/ createComponent({
  name: 'QSpace',

  setup() {
    const space = h('div', { class: 'q-space' })
    return () => space
  }
})
