import { h, defineComponent } from 'vue'

import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QPageContainer',

  setup (_, { slots }) {

    return () => h('div', {
      class: 'q-page-container'
    }, hSlot(slots.default))
  }
})
