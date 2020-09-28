import { h, defineComponent } from 'vue'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QBtnGroup',

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
      const props = ['unelevated', 'outline', 'flat', 'rounded', 'push', 'stretch', 'glossy']
        .filter(t => this[t] === true)
        .map(t => `q-btn-group--${t}`).join(' ')

      return `q-btn-group row no-wrap${props.length > 0 ? ' ' + props : ''}` +
        (this.spread === true ? ' q-btn-group--spread' : ' inline')
    }
  },

  render () {
    return h('div', { class: this.classes }, slot(this, 'default'))
  }
})
