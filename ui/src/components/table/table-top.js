export default {
  computed: {
    marginalsScope () {
      return {
        pagination: this.computedPagination,
        pagesNumber: this.pagesNumber,
        isFirstPage: this.isFirstPage,
        isLastPage: this.isLastPage,
        firstPage: this.firstPage,
        prevPage: this.prevPage,
        nextPage: this.nextPage,
        lastPage: this.lastPage,

        inFullscreen: this.inFullscreen,
        toggleFullscreen: this.toggleFullscreen
      }
    }
  },

  methods: {
    __getTopDiv (h) {
      const
        top = this.$scopedSlots.top,
        topLeft = this.$scopedSlots['top-left'],
        topRight = this.$scopedSlots['top-right'],
        topSelection = this.$scopedSlots['top-selection'],
        hasSelection = this.hasSelectionMode === true &&
          topSelection !== void 0 &&
          this.rowsSelectedNumber > 0,
        staticClass = 'q-table__top relative-position row items-center'

      if (top !== void 0) {
        return h('div', { staticClass }, [ top(this.marginalsScope) ])
      }

      let child

      if (hasSelection === true) {
        child = topSelection(this.marginalsScope).slice()
      }
      else {
        child = []

        if (topLeft !== void 0) {
          child.push(
            h('div', { staticClass: 'q-table-control' }, [
              topLeft(this.marginalsScope)
            ])
          )
        }
        else if (this.title) {
          child.push(
            h('div', { staticClass: 'q-table__control' }, [
              h('div', { staticClass: 'q-table__title', class: this.titleClass }, this.title)
            ])
          )
        }
      }

      if (topRight !== void 0) {
        child.push(h('div', { staticClass: 'q-table__separator col' }))
        child.push(
          h('div', { staticClass: 'q-table__control' }, [
            topRight(this.marginalsScope)
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
