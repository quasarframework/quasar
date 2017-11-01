import HistoryMixin from './history-mixin'

export default {
  name: 'q-app',
  mixins: [HistoryMixin],
  render (h) {
    return h('div', { staticClass: 'q-app' }, [
      this.$slots.default
    ])
  }
}
