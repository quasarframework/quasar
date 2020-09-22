import { h, defineComponent } from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

export default defineComponent({
  name: 'QSpace',

  mixins: [ ListenersMixin ],

  render () {
    return h('div', {
      staticClass: 'q-space',
      on: { ...this.qListeners }
    })
  }
})
