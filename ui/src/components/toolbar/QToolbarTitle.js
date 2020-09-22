import { h, defineComponent } from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default defineComponent({
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

  render () {
    return h('div', {
      class: this.classes,
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
