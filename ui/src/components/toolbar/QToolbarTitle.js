import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QToolbarTitle',

  mixins: [ ListenersMixin ],

  props: {
    shrink: Boolean
  },

  computed: {
    classes () {
      return 'q-toolbar__title ellipsis' +
        (this.shrink === true ? ' col-shrink' : '')
    }
  },

  render (h) {
    return h('div', {
      class: this.classes,
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
