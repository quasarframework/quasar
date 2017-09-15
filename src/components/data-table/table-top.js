export default {
  methods: {
    getTop (h) {
      if (this.noTop) {
        return
      }

      const
        top = this.$scopedSlots.top,
        topLeft = this.$scopedSlots['top-left'],
        topRight = this.$scopedSlots['top-right'],
        topSelection = this.$scopedSlots['top-selection'],
        hasSelection = this.selection && topSelection && this.rowsSelectedNumber > 0,
        cls = 'q-datatable-top relative-position row no-wrap items-center',
        child = [],
        props = {
          hasSelection
        }

      if (top) {
        return h('div', { staticClass: cls }, [ top(props) ])
      }

      if (hasSelection) {
        child.push(topSelection(props))
      }
      else {
        if (topLeft) {
          child.push(topLeft(props))
        }
        else if (this.title) {
          child.push(h('div', { staticClass: 'q-datatable-title' }, this.title))
        }
      }

      if (topRight) {
        child.push(h('div', { staticClass: 'q-datatable-separator col' }))
        child.push(topRight(props))
      }

      if (child.length === 0) {
        return
      }

      return h('div', {
        staticClass: `${cls}${hasSelection ? ` text-${this.color} q-datatable-top-selection` : ''}`
      }, child)
    }
  }
}
