import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QBtnGroup',

  mixin: [ ListenersMixin ],

  props: {
    unelevated: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    stretch: Boolean,
    glossy: Boolean,
    spread: Boolean
  },

  computed: {
    classes () {
      return ['unelevated', 'outline', 'flat', 'rounded', 'push', 'stretch', 'glossy']
        .filter(t => this[t] === true)
        .map(t => `q-btn-group--${t}`).join(' ')
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-btn-group row no-wrap ' +
        (this.spread === true ? 'q-btn-group--spread' : 'inline'),
      class: this.classes,
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
