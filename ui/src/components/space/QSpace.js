import { h } from 'vue'

import { createComponent } from '../../utils/private/create.js'

const space = h('div', { class: 'q-space' })

export default createComponent({
  name: 'QSpace',

  setup () {
    return () => space
  }
})
