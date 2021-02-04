import Vue from 'vue'

import RatioMixin from '../../mixins/ratio.js'
import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QResponsive',

  mixins: [ RatioMixin, ListenersMixin ],

  render (h) {
    return h('div', {
      staticClass: 'q-responsive',
      on: { ...this.qListeners }
    }, [
      h('div', {
        staticClass: 'q-responsive__filler overflow-hidden'
      }, [
        h('div', { style: this.ratioStyle })
      ]),

      h('div', {
        staticClass: 'q-responsive__content absolute-full fit'
      }, slot(this, 'default'))
    ])
  }
})
