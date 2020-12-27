import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

export default Vue.extend({
  name: 'QSpace',

  mixins: [ ListenersMixin ],

  render (h) {
    return h('div', {
      staticClass: 'q-space',
      on: { ...this.qListeners }
    })
  }
})
