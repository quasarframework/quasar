import slot from '../../utils/slot.js'

export default {
  render (h) {
    return h('div', {
      staticClass: 'q-table__middle',
      class: this.class,
      style: this.style,
      on: this.$listeners
    }, [
      h('table', { staticClass: 'q-table' }, slot(this, 'default'))
    ])
  }
}
