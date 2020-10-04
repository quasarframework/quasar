import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'

import { slot } from '../../utils/render.js'

export default defineComponent({
  name: 'QCard',

  mixins: [ DarkMixin ],

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    square: Boolean,
    flat: Boolean,
    bordered: Boolean
  },

  computed: {
    classes () {
      return 'q-card' +
        (this.isDark === true ? ' q-card--dark q-dark' : '') +
        (this.bordered === true ? ' q-card--bordered' : '') +
        (this.square === true ? ' q-card--square no-border-radius' : '') +
        (this.flat === true ? ' q-card--flat no-shadow' : '')
    }
  },

  render () {
    return h(this.tag, { class: this.classes }, slot(this, 'default'))
  }
})
