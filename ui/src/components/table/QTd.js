import { h, defineComponent } from 'vue'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QTd',

  props: {
    props: Object,
    autoWidth: Boolean,
    noHover: Boolean
  },

  computed: {
    classes () {
      return 'q-td' + (this.autoWidth === true ? ' q-table--col-auto-width' : '') +
        (this.noHover === true ? ' q-td--no-hover' : '')
    }
  },

  render () {
    if (this.props === void 0) {
      return h('td', { class: this.classes }, hSlot(this, 'default'))
    }

    const name = this.$.vnode.key

    const col = this.props.colsMap !== void 0 && name
      ? this.props.colsMap[ name ]
      : this.props.col

    if (col === void 0) { return }

    return h('td', {
      class: this.classes + ' ' + col.__tdClass,
      style: col.style
    }, hSlot(this, 'default'))
  }
})
