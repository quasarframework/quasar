import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QMarkupTable',

  props: {
    dense: Boolean,
    dark: Boolean,
    flat: Boolean,
    bordered: Boolean,
    square: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => ['horizontal', 'vertical', 'cell', 'none'].includes(v)
    },
    wrapCells: Boolean
  },

  computed: {
    classes () {
      return `q-table--${this.separator}-separator` +
        (this.dark === true ? ` q-table--dark q-table__card--dark` : '') +
        (this.dense === true ? ` q-table--dense` : '') +
        (this.flat === true ? ` q-table--flat` : '') +
        (this.bordered === true ? ` q-table--bordered` : '') +
        (this.square === true ? ` q-table--square` : '') +
        (this.wrapCells === false ? ` q-table--no-wrap` : '')
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-markup-table q-table__container q-table__card',
      class: this.classes,
      on: this.$listeners
    }, [
      h('table', { staticClass: 'q-table' }, slot(this, 'default'))
    ])
  }
})
