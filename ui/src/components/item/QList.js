import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QList',

  mixins: [ DarkMixin ],

  props: {
    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    padding: Boolean
  },

  computed: {
    classes () {
      return 'q-list' +
        (this.bordered === true ? ' q-list--bordered' : '') +
        (this.dense === true ? ' q-list--dense' : '') +
        (this.separator === true ? ' q-list--separator' : '') +
        (this.isDark === true ? ' q-list--dark' : '') +
        (this.padding === true ? ' q-list--padding' : '')
    }
  },

  render () {
    return h('div', {
      class: this.classes
    }, slot(this, 'default'))
  }
})
