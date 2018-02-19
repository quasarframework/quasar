export default {
  computed: {
    marginalsProps () {
      return {
        pagination: this.computedPagination,
        pagesNumber: this.pagesNumber,
        isFirstPage: this.isFirstPage,
        isLastPage: this.isLastPage,
        prevPage: this.prevPage,
        nextPage: this.nextPage,

        inFullscreen: this.inFullscreen,
        toggleFullscreen: this.toggleFullscreen
      }
    }
  },
  methods: {
    getTop (h) {
      const
        top = this.$scopedSlots.top,
        topLeft = this.$scopedSlots['top-left'],
        topRight = this.$scopedSlots['top-right'],
        topSelection = this.$scopedSlots['top-selection'],
        hasSelection = this.hasSelectionMode && topSelection && this.rowsSelectedNumber > 0,
        staticClass = 'q-table-top relative-position row no-wrap items-center scroll',
        child = []

      if (top) {
        return h('div', { staticClass }, [ top(this.marginalsProps) ])
      }

      if (hasSelection) {
        child.push(h('div', [topSelection(this.marginalsProps)]))
      }
      else {
        if (topLeft) {
          child.push(h('div', [topLeft(this.marginalsProps)]))
        }
        else if (this.title) {
          child.push(h('div', { staticClass: 'q-table-title' }, this.title))
        }
      }

      if (topRight) {
        child.push(h('div', { staticClass: 'q-table-separator col' }))
        child.push(h('div', [topRight(this.marginalsProps)]))
      }

      if (child.length === 0) {
        return
      }

      return h('div', { staticClass: `${staticClass} gutter-x-sm` }, child)
    }
  }
}
