import Vue from 'vue'

export default Vue.extend({
  name: 'QTd',

  props: {
    props: Object,
    autoWidth: Boolean
  },

  render (h) {
    if (this.props === void 0) {
      return h('td', {
        class: { 'q-table--col-auto-width': this.autoWidth }
      }, this.$slots.default)
    }

    let col
    const name = this.$vnode.key

    if (name) {
      col = this.props.colsMap[name]
      if (col === void 0) { return }
    }
    else {
      col = this.props.col
    }

    return h('td', {
      class: col.__tdClass +
        (this.autoWidth === true ? ' q-table--col-auto-width' : '')
    }, this.$slots.default)
  }
})
