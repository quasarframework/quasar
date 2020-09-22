import { h, defineComponent } from 'vue'

import AlignMixin from '../../mixins/align.js'
import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QCardActions',

  mixins: [ ListenersMixin, AlignMixin ],

  props: {
    vertical: Boolean
  },

  computed: {
    classes () {
      return `q-card__actions--${this.vertical === true ? 'vert column' : 'horiz row'} ${this.alignClass}`
    }
  },

  render () {
    return h('div', {
      staticClass: 'q-card__actions',
      class: this.classes,
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
