import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QMarkupTable',

  props: {
    dense: Boolean,
    dark: Boolean,
    flat: Boolean,
    bordered: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => ['horizontal', 'vertical', 'cell', 'none'].includes(v)
    },
    wrapCells: Boolean
  },

  computed: {
    classes () {
      return {
        [`q-table--${this.separator}-separator`]: true,
        'q-table--dark': this.dark,
        'q-table--dense': this.dense,
        'q-table--flat': this.flat,
        'q-table--bordered': this.bordered,
        'q-table--no-wrap': this.wrapCells === false
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-markup-table q-table__container',
      class: this.classes
    }, [
      h('table', { staticClass: 'q-table' }, slot(this, 'default'))
    ])
  }
})
