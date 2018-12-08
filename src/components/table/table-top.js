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
        staticClass = 'q-table__top relative-position row items-center',
        child = []

      if (top !== void 0) {
        return h('div', { staticClass }, [ top(this.marginalsProps) ])
      }

      if (hasSelection === true) {
        child.push(topSelection(this.marginalsProps))
      }
      else {
        if (topLeft !== void 0) {
          child.push(
            h('div', { staticClass: 'q-table-control' }, [
              topLeft(this.marginalsProps)
            ])
          )
        }
        else if (this.title) {
          child.push(
            h('div', { staticClass: 'q-table__control' }, [
              h('div', { staticClass: 'q-table__title' }, this.title)
            ])
          )
        }
      }

      if (topRight !== void 0) {
        child.push(h('div', { staticClass: 'q-table__separator col' }))
        child.push(
          h('div', { staticClass: 'q-table__control' }, [
            topRight(this.marginalsProps)
          ])
        )
      }

      if (child.length === 0) {
        return
      }

      return h('div', { staticClass }, child)
    }
  }
}
