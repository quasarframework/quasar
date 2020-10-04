import { h, defineComponent } from 'vue'

import { slot } from '../../utils/render.js'

export default defineComponent({
  name: 'QToolbarTitle',

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
      class: this.classes
    }, slot(this, 'default'))
  }
})
