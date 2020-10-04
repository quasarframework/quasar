import { h, defineComponent } from 'vue'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QTr',

  props: {
    props: Object,
    noHover: Boolean
  },

  computed: {
    classes () {
      return 'q-tr' +
        (this.props === void 0 || this.props.header === true ? '' : ' ' + this.props.__trClass) +
        (this.noHover === true ? ' q-tr--no-hover' : '')
    }
  },

  render () {
    return h('tr', { class: this.classes }, hSlot(this, 'default'))
  }
})
