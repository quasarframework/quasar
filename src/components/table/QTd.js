export default {
  name: 'QTd',
  props: {
    props: Object,
    autoWidth: Boolean
  },
  render (h) {
    if (!this.props) {
      return h('td', {
        'class': { 'q-table-col-auto-width': this.autoWidth }
      }, this.$slots.default)
    }

    let col
    const name = this.$vnode.key

    if (name) {
      col = this.props.colsMap[name]
      if (!col) { return }
    }
    else {
      col = this.props.col
    }

    return h('td', {
      'class': [col.__tdClass, {
        'q-table-col-auto-width': this.autoWidth
      }]
    }, this.$slots.default)
  }
}
