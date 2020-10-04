import { h, defineComponent } from 'vue'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QToolbar',

  props: {
    inset: Boolean
  },

  computed: {
    classes () {
      return 'q-toolbar row no-wrap items-center' +
        (this.inset === true ? ' q-toolbar--inset' : '')
    }
  },

  render () {
    return h('div', { class: this.classes }, hSlot(this, 'default'))
  }
})
