import slot from '../../utils/slot.js'

export default {
  render (h) {
    return h('div', {
      staticClass: 'q-table__middle',
      on: this.$listeners
    }, [
      h('table', { staticClass: 'q-table' }, slot(this, 'default'))
    ])
  }
}
