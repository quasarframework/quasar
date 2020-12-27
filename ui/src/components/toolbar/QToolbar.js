import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QToolbar',

  mixins: [ ListenersMixin ],

  props: {
    inset: Boolean
  },

  render (h) {
    return h('div', {
      staticClass: 'q-toolbar row no-wrap items-center',
      class: this.inset ? 'q-toolbar--inset' : null,
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
