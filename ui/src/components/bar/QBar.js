import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QBar',

  mixins: [ DarkMixin ],

  props: {
    dense: Boolean
  },

  computed: {
    classes () {
      return 'q-bar row no-wrap items-center' +
        ` q-bar--${this.dense === true ? 'dense' : 'standard'} ` +
        ` q-bar--${this.isDark === true ? 'dark' : 'light'}`
    }
  },

  render () {
    return h('div', {
      class: this.classes,
      role: 'toolbar'
    }, hSlot(this, 'default'))
  }
})
