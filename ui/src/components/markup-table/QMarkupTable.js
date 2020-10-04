import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'

import { hSlot } from '../../utils/render.js'

const separatorValues = [ 'horizontal', 'vertical', 'cell', 'none' ]

export default defineComponent({
  name: 'QMarkupTable',

  mixins: [ DarkMixin ],

  props: {
    dense: Boolean,
    flat: Boolean,
    bordered: Boolean,
    square: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => separatorValues.includes(v)
    },
    wrapCells: Boolean
  },

  computed: {
    classes () {
      return 'q-markup-table q-table__container q-table__card' +
        ` q-table--${this.separator}-separator` +
        (this.isDark === true ? ` q-table--dark q-table__card--dark q-dark` : '') +
        (this.dense === true ? ` q-table--dense` : '') +
        (this.flat === true ? ` q-table--flat` : '') +
        (this.bordered === true ? ` q-table--bordered` : '') +
        (this.square === true ? ` q-table--square` : '') +
        (this.wrapCells === false ? ` q-table--no-wrap` : '')
    }
  },

  render () {
    return h('div', {
      class: this.classes
    }, [
      h('table', { class: 'q-table' }, hSlot(this, 'default'))
    ])
  }
})
